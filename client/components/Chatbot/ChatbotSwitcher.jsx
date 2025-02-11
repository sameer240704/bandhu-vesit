import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatbotTypes } from "@/constants/types";
import { Bot } from "lucide-react";
import { useChatbot } from "@/context/ChatbotContext";
import { useLanguage } from "@/context/LanguageContext";

const ChatbotSwitcher = () => {
  const { currentBot, updateBot } = useChatbot();
  const { dict } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Bot className="h-4 w-4" />
          <span className="sr-only">Switch Chatbot</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(ChatbotTypes).map((bot) => (
          <DropdownMenuItem
            key={bot.code}
            onClick={() => updateBot(bot.code)}
            disabled={bot.code === currentBot}
          >
            {dict?.chatbot?.[bot.type]} ({bot.code.toUpperCase()})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatbotSwitcher;
