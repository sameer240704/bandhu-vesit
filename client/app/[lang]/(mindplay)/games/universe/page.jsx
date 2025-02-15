"use client";

import { Button } from "@/components/ui/button";
import ChatComponent from "@/components/Universe/ChatComponent";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { Volume2 } from "lucide-react";

const MindplayUniversePage = () => {
  const { dict, currentLang } = useLanguage();
  const router = useRouter();

  return (
    <div className="h-full w-full flex justify-center items-start gap-x-5">
      <div className="h-full flex flex-col gap-y-5 w-2/3">
        <div className="h-1/2 w-full rounded-xl border border-black bg-bandhuUniverseBg bg-center bg-cover relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative h-full flex flex-col justify-between p-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  {dict?.universe?.bandhu}
                </h1>
                <p className="text-gray-200 text-lg max-w-xl">
                  {dict?.universe?.bandhu_desc}
                </p>
              </div>
              <div className="flex gap-x-4 pt-2">
                <Button
                  className="h-12 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all border border-white/20 text-lg"
                  onClick={() =>
                    router.push(
                      `/${currentLang}/games/universe/bandhu-universe`
                    )
                  }
                >
                  {dict?.universe?.exploring}
                </Button>
                <Button className="h-12 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-all text-lg">
                  {dict?.universe?.learn_more}
                  <Volume2 className="size-10" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-1/2 w-full rounded-xl border border-black bg-avatarBuilerBg bg-center bg-cover relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative h-full flex flex-col justify-between p-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  {dict?.universe?.avatar}
                </h1>
                <p className="text-gray-200 text-lg max-w-xl">
                  {dict?.universe?.avatar_desc}
                </p>
              </div>
              <div className="flex gap-x-4 pt-2">
                <Button
                  className="h-12 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all border border-white/20 text-lg"
                  onClick={() =>
                    router.push(`/${currentLang}/games/universe/avatar-builder`)
                  }
                >
                  {dict?.universe?.start}
                </Button>
                <Button className="h-12 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-all text-lg">
                  {dict?.universe?.learn_more}
                  <Volume2 className="size-10" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChatComponent />
    </div>
  );
};

export default MindplayUniversePage;
