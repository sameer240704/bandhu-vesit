import { RiHome3Line, RiEmotionLaughLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { TbUniverse } from "react-icons/tb";
import { LuBrain, LuUserRound } from "react-icons/lu";
import { FaGears } from "react-icons/fa6";
import { SlPeople } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";
import { IconType } from "react-icons";

export type SidebarItem = {
  title: string;
  route: string;
  icon: IconType;
};

export type SidebarCategory = {
  category: string;
  items: SidebarItem[];
};

export const sidebarData: SidebarCategory[] = [
  {
    category: "dashboard",
    items: [
      { title: "overview", route: "/overview", icon: RiHome3Line },
      { title: "recent", route: "/recent", icon: RxDashboard },
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
    ],
  },
  {
    category: "user",
    items: [
      { title: "settings", route: "/user/settings", icon: IoSettingsOutline },
      { title: "profile", route: "/user/profile", icon: LuUserRound },
    ],
  },
];
