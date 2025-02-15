import streamlit as st
import os
from dotenv import load_dotenv
from groq import Groq
import speech_recognition as sr
import tempfile
import edge_tts
import asyncio
import random

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

st.set_page_config(page_title="Amigo.AI - Your Mental Wellness Companion")

st.title("Amigo.AI - Your Mental Wellness Companion")
st.sidebar.markdown("Amigo.AI\nYour Friendly Mental Wellness Support System")

if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "assistant", "content": "Hello! I'm Amigo, your friendly mental wellness companion. How can I support you today?"}
    ]

if "conversation_context" not in st.session_state:
    st.session_state.conversation_context = []

MINDPLAY_GAMES = {
    "Number Match": "A memory game to exercise cognitive abilities by matching card numbers.",
    "Music Mania": "Create musical tunes by matching colored plates with shapes.",
    "Balloon Pop": "Pop on-screen balloons using body movements in real-time.",
    "Hole in the Wall": "Strike poses to pass through wall overlays - gets progressively challenging!",
    "Flappy Bird": "Navigate through obstacles with keyboard controls.",
    "Color And Paint": "Express yourself by coloring templates with AI mood analysis.",
    "Scenario Saga": "Create unique storylines through dynamic scenario choices.",
    "WordChain": "Build vocabulary by connecting words through their last letters."
}

CRISIS_RESOURCES = {
    "India": {
        "AASRA": "24x7 Helpline: 91-9820466726",
        "Vandrevala Foundation": "1860-2662-345 / 1800-2333-330",
        "iCall": "022-25521111",
        "Website": "http://www.aasra.info/"
    },
    "International": {
        "US National Suicide Prevention Lifeline": "1-800-273-8255",
        "UK Samaritans": "116 123",
        "Australia Lifeline": "13 11 14",
        "Website": "https://www.opencounseling.com/suicide-hotlines"
    }
}

def update_conversation_context(user_message, assistant_reply):
    if len(st.session_state.conversation_context) >= 10:
        st.session_state.conversation_context.pop(0)
    st.session_state.conversation_context.append({
        "user": user_message,
        "assistant": assistant_reply
    })

def get_mindplay_recommendation():
    games_list = "\n\n".join([
        f"• {game:<15} 🎮    {description}" 
        for game, description in MINDPLAY_GAMES.items()
    ])
    return f"Here are some engaging games you might enjoy:\n\n{games_list}\n\nWould you like to try any of these games?"

def check_for_crisis(user_input):
    crisis_indicators = [
        "suicide", "kill myself", "end it all", "want to die", "wanna end it",
        "no reason to live", "better off dead", "can't take it anymore",
        "don't want to live", "dont want to live", "end my life",
        "depressed", "depression", "hopeless", "worthless"
    ]
    return any(indicator in user_input.lower() for indicator in crisis_indicators)

def get_crisis_response():
    return """I understand you're going through a difficult time. While I'm here to listen, please reach out to these professional crisis helplines:

► INDIA:
   • AASRA (24/7): 91-9820466726
   • Vandrevala: 1860-2662-345
   • iCall: 022-25521111
   → Visit: http://www.aasra.info/

► INTERNATIONAL:
   • US: 1-800-273-8255
   • UK: 116 123
   • Australia: 13 11 14
   → Visit: https://www.opencounseling.com/suicide-hotlines

These services are free, confidential, and available 24/7."""

def check_for_boredom(user_input):
    boredom_indicators = [
        "bored", "boring", "nothing to do", "uninterested", 
        "not interested", "dull", "monotonous", "tedious",
        "nothing exciting", "no fun", "don't know what to do"
    ]
    return any(indicator in user_input.lower() for indicator in boredom_indicators)

def prepare_system_context(user_message):
    return """You are Amigo.AI, a mental wellness companion. Keep responses concise (2-3 lines max).
    Focus on: practical advice, professional referrals, and brief wellness techniques.
    Be direct, supportive, and clear. Avoid lengthy explanations."""

async def text_to_speech(text):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_audio:
            temp_audio_path = temp_audio.name
            communicate = edge_tts.Communicate(text, 'en-US-ChristopherNeural')
            await communicate.save(temp_audio_path)
        with open(temp_audio_path, 'rb') as audio_file:
            audio_bytes = audio_file.read()
        os.unlink(temp_audio_path)
        return audio_bytes
    except Exception as e:
        st.error(f"Error generating speech: {str(e)}")
        return None

def generate_speech(text):
    return asyncio.run(text_to_speech(text))

def display_chat():
    for idx, message in enumerate(st.session_state.messages):
        with st.chat_message(message["role"]):
            st.write(message["content"])
            if message["role"] == "assistant":
                if st.button("► Play Audio", key=f"play_button_{idx}"):
                    audio_data = generate_speech(message["content"])
                    if audio_data:
                        st.audio(audio_data, format="audio/mp3")

def speech_to_text():
    recognizer = sr.Recognizer()
    microphone = sr.Microphone()
    with microphone as source:
        st.write("► Listening... Speak now.")
        audio = recognizer.listen(source)
    try:
        speech_text = recognizer.recognize_google(audio)
        return speech_text
    except sr.UnknownValueError:
        return "Sorry, I could not understand your speech."
    except sr.RequestError:
        return "Sorry, the speech service is unavailable."

def process_input(user_input):
    if check_for_crisis(user_input):
        crisis_response = get_crisis_response()
        st.session_state.messages.append({"role": "assistant", "content": crisis_response})
        update_conversation_context(user_input, crisis_response)
    elif check_for_boredom(user_input):
        mindplay_response = get_mindplay_recommendation()
        st.session_state.messages.append({"role": "assistant", "content": mindplay_response})
        update_conversation_context(user_input, mindplay_response)
    else:
        with st.spinner("Processing..."):
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": prepare_system_context(user_input)},
                    {"role": "user", "content": user_input}
                ],
                model="llama3-8b-8192",
                stream=False,
            )
            assistant_reply = chat_completion.choices[0].message.content
            st.session_state.messages.append({"role": "assistant", "content": assistant_reply})
            update_conversation_context(user_input, assistant_reply)

st.sidebar.markdown("---")
st.sidebar.markdown("► Features")
st.sidebar.markdown("• MindPlay Games\n• Voice Input\n• Text-to-Speech\n• Mental Wellness Support")

if st.sidebar.button("► Clear Chat"):
    st.session_state.messages = [{"role": "assistant", "content": "Hello! I'm Amigo, your friendly mental wellness companion. How can I support you today?"}]
    st.session_state.conversation_context = []

user_input = st.chat_input("Type your message to Amigo...")
speak_button = st.button("► Speak")

if speak_button:
    speech_text = speech_to_text()
    if not speech_text.startswith(("Sorry", "No speech", "Speech recognition")):
        st.session_state.messages.append({"role": "user", "content": speech_text})
        process_input(speech_text)

if user_input:
    st.session_state.messages.append({"role": "user", "content": user_input})
    process_input(user_input)

display_chat()

st.sidebar.markdown("---")
st.sidebar.markdown("► About")
st.sidebar.markdown("• Amigo.AI supports your mental wellness through conversation, games, and practical guidance.")