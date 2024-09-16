import React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";


export default function LogoutButton() {
  return (
    <button
      className="flex w-full items-center rounded-md p-2 text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
      onClick={() => {
        signOut({
          callbackUrl: "/login",
        });

      }}
    >
      <i className={`inline-flex  text-gray-500`}>
        <LogOut />
      </i>
      <span className="pl-4 text-[16px] font-medium text-gray-700 ">
        Logout
      </span>
    </button>
  );
}
