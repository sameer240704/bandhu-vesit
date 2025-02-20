import { RiHome3Line, RiEmotionLaughLine, RiFlowChart } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { TbUniverse, TbMessageChatbot } from "react-icons/tb";
import { LuBrain, LuUserRound } from "react-icons/lu";
import { FaGears, FaRegNewspaper } from "react-icons/fa6";
import { SlPeople } from "react-icons/sl";
import { RiRobot3Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";

export const sidebarData = [
  {
    category: "dashboard",
    items: [
      { title: "overview", route: "/overview", icon: RiHome3Line },
      { title: "favourite", route: "/favourite", icon: RxDashboard },
    ],
  },
  {
    category: "games",
    items: [
      { title: "universe", route: "/games/universe", icon: TbUniverse },
      { title: "cognitive", route: "/games/cognitive", icon: LuBrain },
      { title: "motor", route: "/games/motor", icon: FaGears },
      {
        title: "emotional",
        route: "/games/emotional",
        icon: RiEmotionLaughLine,
      },
      { title: "social", route: "/games/social", icon: SlPeople },
      { title: "chatbot", route: "/games/cb/chatbot", icon: TbMessageChatbot },
    ],
  },
  {
    category: "user",
    items: [
      { title: "game-flow", route: "/user/game-flow", icon: RiFlowChart },
      { title: "Amigo", route: "/user/amigo", icon: RiRobot3Line },
      { title: "news", route: "/user/news", icon: FaRegNewspaper },
      { title: "profile", route: "/user/profile", icon: LuUserRound },
    ],
  },
];
