"use client";
import { useRef } from "react";
import Link from "next/link";
import { useAtom } from "jotai";
import { tw } from "~/utils/utils";

import { toggleMobileNavAtom } from "./atoms";
import MenuButton from "./menu-button";
import MenuItems from "./menu-items";
import Overlay from "./overlay";

export default function Sidebar() {
  const [isMobileNavOpen, toggleMobileNav] = useAtom(toggleMobileNavAtom);
  const mainNavigationRef = useRef<HTMLElement>(null);

  return (
    <>
      {/* this component is named sidebar as of now but also serves as a mobile navigation header in mobile device */}
      <header
        id="header"
        className="flex items-center justify-between border-b bg-white p-4 md:hidden">
        <Link href="/" title="Home" className="block h-[32px]">
          <img src="/static/images/jani.png" alt="logo" className="h-full" />
        </Link>
        <div className="flex items-center space-x-4">
          <MenuButton />
        </div>
      </header>

      <Overlay />
      <aside
        id="main-navigation"
        ref={mainNavigationRef}
        className={tw(
          `main-navigation fixed top-0 z-30 flex h-screen max-h-screen flex-col border-r border-gray-200 bg-white p-4 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),_0px_8px_8px_-4px_rgba(16,24,40,0.03)] transition-all duration-300 ease-linear md:sticky md:left-0 md:px-4 md:py-8 md:shadow-none md:duration-200`,

          isMobileNavOpen ? "left-0 w-[312px] overflow-hidden " : "-left-full"
        )}>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto overflow-x-hidden">
          <div className="navigation-header flex items-center justify-between">
            <Link
              href="."
              title="Home"
              className="logo flex items-center"
              onClick={toggleMobileNav}>
              <img
                src="/static/images/jani.svg"
                alt="logo"
                className="mx-1.5 pl-3 inline h-[32px]"
              />
            </Link>
          </div>

          <div className={tw("flex-1")}>
            <MenuItems />
          </div>
        </div>
      </aside>
    </>
  );
}
