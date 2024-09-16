"use client";

import { Github, Google } from "~/components/ui";
import { Button } from "./Auth-Button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const [clickedGoogle, setClickedGoogle] = useState(false);
  const [clickedGithub, setClickedGithub] = useState(false);

  // check if the user got here as a result of workspace invite
  const invite = searchParams.get("invite");

  const callbackUrl = invite
    ? `/invites/accept?email=${searchParams.get("email")}&workspaceSlug=${searchParams.get("workspaceSlug")}`
    : "/welcome";

  useEffect(() => {
    // when leave page, reset state
    return () => {
      setClickedGoogle(false);
      setClickedGithub(false);
    };
  }, []);

  return (
    <>
      <Button
        variant="secondary"
        text="Continue with Google"
        onClick={() => {
          setClickedGoogle(true);
          signIn("google", {
            callbackUrl,
          });
        }}
        loading={clickedGoogle}
        icon={<Google className="h-4 w-4" />}
      />
      <Button
        text="Continue with GitHub"
        onClick={() => {
          setClickedGithub(true);
          signIn("github", {
            callbackUrl,
          });
        }}
        loading={clickedGithub}
        icon={<Github className="h-4 w-4" />}
      />
      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-gray-500 transition-colors hover:text-black"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
