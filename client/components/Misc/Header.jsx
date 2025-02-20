"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import LanguageSwitcher from "./LanguageButton";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ChatbotSwitcher from "../Chatbot/ChatbotSwitcher";
import VoiceControl from "./VoiceControl";
import { useUser } from "@clerk/nextjs";
import { getUserDetails } from "@/lib/actions/user.action";
import { Coins } from "@/public/images";
import { useNextStep } from "nextstepjs";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { dict, currentLang } = useLanguage();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const [coins, setCoins] = useState(100);
  const { user } = useUser();
  const {
    startNextStep,
    closeNextStep,
    currentTour,
    currentStep,
    setCurrentStep,
    isNextStepVisible,
  } = useNextStep();

  const chatbotPath = pathname.split("/").filter(Boolean).pop();
  const isInGameRoute = /^\/[a-z]{2}\/games\/[a-z-]+\/[a-z-]+$/i.test(pathname);

  useEffect(() => {
    if (!pathname) return;

    const getCoins = async () => {
      const userId = user?.publicMetadata?.userId;
      const newCoins = await getUserDetails(userId);
      setCoins(newCoins?.coins);
    };

    getCoins();

    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}\//, "");
    const pathParts = pathWithoutLang.split("/").filter(Boolean);

    const breadcrumbList = pathParts.map((part, index) => {
      const normalizedPart = part.trim();
      const label = dict?.breadcrumb?.[normalizedPart] || normalizedPart;
      const href = `/${currentLang}/` + pathParts.slice(0, index + 1).join("/");
      return { label, href };
    });

    setBreadcrumbItems(breadcrumbList);
  }, [pathname, dict, currentLang, user]);

  const handleStartTour = () => {
    startNextStep("mainTour");
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-start">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <BreadcrumbItem key={index}>
                  {index < breadcrumbItems.length - 1 ? (
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                  {index < breadcrumbItems.length - 1 && (
                    <BreadcrumbSeparator />
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {breadcrumbItems[breadcrumbItems.length - 1]?.label || "Home"}
          </h1>
        </div>
        <div className="flex-center gap-x-3">
          <VoiceControl />
          {isInGameRoute && (
            <Button variant="destructive" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {dict?.breadcrumb?.go_back}
            </Button>
          )}
          <Button onClick={handleStartTour}>Start</Button>
          {chatbotPath === "chatbot" && <ChatbotSwitcher />}
          <LanguageSwitcher currentLang={currentLang} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-2 rounded-full cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-6 h-6"
                  >
                    <Image
                      src={Coins}
                      alt="Coins"
                      layout="fill"
                      className="object-contain"
                    />
                  </motion.div>
                  <span className="font-bold text-white">
                    {coins?.toLocaleString()}
                  </span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your current balance</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default Header;
