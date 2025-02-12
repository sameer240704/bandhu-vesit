import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { FaFire, FaRegSmileBeam, FaGlobe } from "react-icons/fa";
import { IoGameController } from "react-icons/io5";
import { Logo } from "@/public/images";
import { Button } from "../ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const GameCard = ({
  title,
  publisher,
  rating,
  votes = 42,
  players,
  views,
  imageUrl,
  isHot = false,
  gameLink,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { dict } = useLanguage();

  const handleGameClick = () => {
    const newPath = `${pathname}/${gameLink}`;
    router.push(newPath);
  };

  return (
    <Card className="w-full h-fit text-white overflow-hidden p-3">
      <div className="relative">
        <Image
          src={imageUrl}
          alt={title}
          className="w-full h-52 object-cover rounded-lg border border-white"
        />
        {isHot && (
          <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600 flex justify-center items-center gap-x-1">
            <FaFire className="size-4" />
            <h1 className="text-sm">{dict?.game?.trending}</h1>
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-[900] text-xl mb-2 text-purple-500">{title}</h3>
        <div className="flex items-center justify-between text-sm text-zinc-400 mb-3">
          <span className="flex items-center">
            <Image
              src={Logo}
              alt="logo"
              className="h-6 w-6 mr-2 rounded-full border border-limeGreen-600"
            />
            <span className="font-semibold">{publisher}</span>
          </span>
          <div className="flex items-center gap-x-2">
            <span className="flex items-center gap-x-1">
              <FaRegSmileBeam className="size-5 text-limeGreen-600" />
              <h1 className="font-semibold text-limeGreen-600">{rating}%</h1>
            </span>
            <span>
              <h1>
                {votes} {dict?.game?.votes}
              </h1>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-zinc-400">
          <div className="flex items-center gap-1">
            <IoGameController className="size-8  text-purple-500" />
            <span className="flex flex-col justify-start ml-1">
              <h3 className="font-semibold text-slate-400">
                {dict?.game?.online}
              </h3>
              <h1 className="text-lg font-bold text-slate-500">{players}</h1>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaGlobe className="size-7  text-purple-500" />
            <span className="flex flex-col justify-start ml-1">
              <h3 className="font-semibold text-slate-400">
                {dict?.game?.visits}
              </h3>
              <h1 className="text-lg font-bold text-slate-500">
                {views >= 1000 ? `${(views / 1000).toFixed(1)}M` : views}
              </h1>
            </span>
          </div>
        </div>

        <Button
          className="mt-5 w-full bg-limeGreen-500 text-purple-400 text-sm font-bold hover:bg-limeGreen-600 active:scale-95"
          onClick={handleGameClick}
        >
          {dict?.game?.play}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameCard;
