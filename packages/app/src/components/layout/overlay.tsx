
import { useAtom } from "jotai";
import { tw } from "~/utils/utils";
import { toggleMobileNavAtom } from "./atoms";

const Overlay = () => {
  const [isMobileNavOpen, toggleMobileNav] = useAtom(toggleMobileNavAtom);
  return (
    <div
      onClick={toggleMobileNav}
      className={tw(
        "bg-gray-25/10 fixed right-0 top-0 z-10 h-screen w-screen cursor-pointer backdrop-blur transition duration-300 ease-in-out md:hidden",
        isMobileNavOpen ? "visible" : "invisible opacity-0"
      )}></div>
  );
};

export default Overlay;
