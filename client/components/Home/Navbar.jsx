"use client";

import { useUser } from "@clerk/clerk-react";
import { Logo } from "@/public/images";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "../Misc/LanguageButton";
import { useLanguage } from "@/context/LanguageContext";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const { dict, currentLang } = useLanguage();

  return (
    <nav className="z-10 w-screen bg-white shadow-lg absolute top-0">
      <div className="mx-auto px-10">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${currentLang}`} className="flex items-center">
            <Image src={Logo} alt="mindplay" className="h-12 w-auto" />
          </Link>

          <div className="flex items-center justify-between space-x-6">
            <LanguageSwitcher currentLang={currentLang} />
            <div className="flex-center space-x-3">
              {isSignedIn ? (
                <Link
                  href={`/${currentLang}/overview`}
                  className="btn-primary font-semibold"
                >
                  {dict?.home?.goToDash}
                </Link>
              ) : (
                <>
                  <Link
                    href={`/${currentLang}/sign-in`}
                    className="btn-primary font-semibold"
                  >
                    {dict?.home?.signIn}
                  </Link>
                  <Link
                    href={`/${currentLang}/sign-up`}
                    className="btn-secondary font-semibold"
                  >
                    {dict?.home?.signUp}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
