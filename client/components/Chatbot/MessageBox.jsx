import Image from "next/image";
import { Logo } from "@/public/images";

const MessageBox = ({ message }) => {
  const formatMessage = (text) => {
    const points = text.match(/(\d+\.\s|[*-]\s).+/g);

    if (points) {
      return (
        <ol className="list-decimal list-inside text-gray-100 text-sm leading-relaxed space-y-2">
          {points.map((point, index) => (
            <p key={index}>{point.trim()}</p>
          ))}
        </ol>
      );
    }

    return <p className="text-gray-100 text-sm leading-relaxed">{text}</p>;
  };

  return (
    <div className="z-10 h-[500px] w-[900px] flex space-y-6 flex-col bg-gradient-to-tr from-slate-400/30 via-gray-500/30 to-slate-600-400/30 p-2 backdrop-blur-md rounded-lg border border-slate-600/30">
      {message === "" ? (
        <div className="h-full w-full flex justify-center items-center gap-x-2">
          <Image src={Logo} alt="mindplay.ai" className="h-20 w-auto" />
        </div>
      ) : (
        <div className="h-full w-full rounded-b-md font-medium overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {formatMessage(message)}
        </div>
      )}
    </div>
  );
};

export default MessageBox;
