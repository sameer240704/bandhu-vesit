import Image from "next/image";
import { Logo } from "@/public/images";

const MessageBox = ({ message }) => {
  const formatMessage = (text) => {
    if (!text) return null;

    const bulletPointRegex = /^[*-]\s(.+)/gm;
    const numberedListRegex = /^(\d+\.\s)(.+)/gm;

    const bulletPoints = text.matchAll(bulletPointRegex);
    const numberedLists = text.matchAll(numberedListRegex);

    if (bulletPoints) {
      const points = Array.from(bulletPoints, (match) => match[1]);
      return (
        <ul className="list-disc list-inside text-gray-100 text-sm leading-relaxed space-y-2">
          {points.map((point, index) => (
            <li key={index}>{point.trim()}</li>
          ))}
        </ul>
      );
    } else if (numberedLists) {
      const points = Array.from(numberedLists, (match) => match[2]);
      return (
        <ol className="list-decimal list-inside text-gray-100 text-sm leading-relaxed space-y-2">
          {points.map((point, index) => (
            <li key={index}>{point.trim()}</li>
          ))}
        </ol>
      );
    }

    if (text.includes("🎮")) {
      const gameLines = text.split("\n").filter((line) => line.includes("🎮"));

      return (
        <ul className="list-none pl-0 text-gray-100 text-sm leading-relaxed space-y-2">
          {gameLines.map((line, index) => {
            const parts = line.split("🎮");
            const gameName = parts[0].replace(/[•\s]/g, "").trim();
            const gameDescription = parts[1]?.trim() || "";

            return (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-md font-semibold mr-1">{gameName}</span>
                <span>{gameDescription}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <p className="text-gray-100 text-sm leading-relaxed whitespace-pre-line">
        {text}
      </p>
    );
  };

  return (
    <div className="z-10 h-[500px] w-[900px] flex space-y-6 flex-col bg-gradient-to-tr from-slate-400/30 via-gray-500/30 to-slate-600-400/30 p-4 backdrop-blur-md rounded-lg border border-slate-600/30">
      {message === "" ? (
        <div className="h-full w-full flex justify-center items-center gap-x-2">
          <Image src={Logo} alt="amigo.ai" className="h-20 w-auto" />
        </div>
      ) : (
        <div className="h-full w-full rounded-b-md font-medium overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2">
          {formatMessage(message)}
        </div>
      )}
    </div>
  );
};

export default MessageBox;
