"use client";
import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const AmigoFace = ({ expression }) => (
  <div className="w-full max-w-md aspect-square bg-black rounded-3xl p-8 relative overflow-hidden">
    {/* Antenna */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2">
      <div className="w-4 h-8 bg-gray-300 rounded-full" />
      <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse" />
    </div>
    
    {/* Face Container */}
    <div className="h-full w-full flex flex-col justify-center items-center gap-12">
      {/* Eyes */}
      <div className="flex gap-16">
        <div className={`w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center
          ${expression === 'thinking' ? 'animate-pulse' : ''}
          ${expression === 'happy' ? 'bg-blue-400' : ''}
          ${expression === 'sad' ? 'bg-blue-300' : ''}
        `}>
          <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center
            ${expression === 'thinking' ? 'animate-bounce' : ''}
          `}>
            <div className="w-6 h-6 rounded-full bg-black" />
          </div>
        </div>
        <div className={`w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center
          ${expression === 'thinking' ? 'animate-pulse' : ''}
          ${expression === 'happy' ? 'bg-blue-400' : ''}
          ${expression === 'sad' ? 'bg-blue-300' : ''}
        `}>
          <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center
            ${expression === 'thinking' ? 'animate-bounce' : ''}
          `}>
            <div className="w-6 h-6 rounded-full bg-black" />
          </div>
        </div>
      </div>

      {/* Mouth */}
      <div className={`relative
        ${expression === 'happy' ? 'w-32 h-16 border-b-8 border-blue-400 rounded-b-full' : ''}
        ${expression === 'sad' ? 'w-32 h-16 border-t-8 border-blue-300 rounded-t-full mt-8' : ''}
        ${expression === 'thinking' ? 'w-16 h-16 rounded-full border-8 border-yellow-400 animate-pulse' : ''}
        ${expression === 'neutral' ? 'w-24 h-2 bg-blue-400 rounded-full' : ''}
      `} />

      {/* Cheeks */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-between px-12">
        <div className="w-8 h-4 rounded-full bg-pink-200 opacity-50" />
        <div className="w-8 h-4 rounded-full bg-pink-200 opacity-50" />
      </div>
    </div>
  </div>
);

const VoiceControl = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [response, setResponse] = useState("");
    const [expression, setExpression] = useState("neutral");
    const [errorMsg, setErrorMsg] = useState("");
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
  
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
  
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
  
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          await processAudioWithGemini(audioBlob);
        };
  
        mediaRecorderRef.current.start();
        setIsRecording(true);
        setExpression("thinking");
        setErrorMsg("");
      } catch (error) {
        setErrorMsg("Error accessing microphone");
        setExpression("sad");
        console.error("Error starting recording:", error);
      }
    };
  
    const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        
        // Stop all tracks on the stream
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  
    const processAudioWithGemini = async (audioBlob) => {
      try {
        setExpression("thinking");
  
        // Convert audio blob to base64
        const arrayBuffer = await audioBlob.arrayBuffer();
        const base64Audio = btoa(
          new Uint8Array(arrayBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
  
        // Prepare the prompt parts for Gemini
        const prompt = {
          contents: [{
            parts: [
              { text: "You are Amigo, a friendly and helpful AI assistant. Please listen to the audio and respond in a conversational, friendly manner. Keep responses concise but helpful." },
              { audio: base64Audio }
            ]
          }]
        };
  
        // Generate content with Gemini
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        setResponse(response);
        setExpression("happy");
        
        // Text to speech for response
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(response);
          utterance.pitch = 1.1;
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        }
      } catch (error) {
        setErrorMsg("Error processing audio");
        setExpression("sad");
        console.error("Error processing audio with Gemini:", error);
      }
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
        {/* Robot Face */}
        <div className="mb-8">
          <AmigoFace expression={expression} />
        </div>
  
        {/* Voice Interface */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <div className="flex flex-col gap-2">
              {isRecording && (
                <p className="text-green-500 font-medium text-center animate-pulse">
                  Listening...
                </p>
              )}
              {response && (
                <p className="text-blue-600">
                  <span className="text-gray-500">Amigo:</span> {response}
                </p>
              )}
              {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
            </div>
          </div>
  
          {/* Record Button */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`w-full py-3 rounded-lg transition-all duration-300 
              ${isRecording 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-blue-500 hover:bg-blue-600"
              } text-white font-medium`}
          >
            {isRecording ? "Release to Stop" : "Press and Hold to Talk"}
          </button>
        </div>
      </div>
    );
  };
  
  export default VoiceControl;