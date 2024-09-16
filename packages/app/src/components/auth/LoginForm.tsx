"use client";
import { Button } from "./Auth-Button";
import { Github, Google } from "../ui/icons";
import { useMediaQuery } from "~/utils/hooks/useMediaQuery";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");
  const [showEmailOption, setShowEmailOption] = useState(false);
  const [noSuchAccount, setNoSuchAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [clickedGoogle, setClickedGoogle] = useState(false);
  const [clickedGithub, setClickedGithub] = useState(false);
  const [clickedEmail, setClickedEmail] = useState(false);
  const [clickedSSO, setClickedSSO] = useState(false);

  useEffect(() => {
    const error = searchParams?.get("error");
    error && toast.error(error);
  }, [searchParams]);

  const { isMobile } = useMediaQuery();

  useEffect(() => {
    // when leave page, reset state
    return () => {
      setClickedGoogle(false);
      setClickedGithub(false);
      setClickedEmail(false);
      setClickedSSO(false);
    };
  }, []);

  return (
    <>
      <div className="flex space-x-2">
        <Button
          variant="secondary"
          onClick={() => {
            setClickedGoogle(true);
            signIn("google", {
              callbackUrl: "/welcome/redirect",
            });
          }}
          loading={clickedGoogle}
          disabled={clickedEmail || clickedSSO}
          icon={<Google className="h-5 w-5" />}
        />
        <Button
          variant="secondary"
          onClick={() => {
            setClickedGithub(true);
            signIn("github", {
              callbackUrl: "/welcome/redirect",
            });
          }}
          loading={clickedGithub}
          disabled={clickedEmail || clickedSSO}
          icon={<Github className="h-5 w-5 text-black" />}
        />
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setClickedEmail(true);
          fetch("/api/auth/account-exists", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          })
            .then(async (res) => {
              const { exists } = await res.json();
              if (exists) {
                signIn("email", {
                  email,
                  redirect: false,
                  ...(next && next.length > 0 ? { callbackUrl: next } : {}),
                }).then((res) => {
                  setClickedEmail(false);
                  if (res?.ok && !res?.error) {
                    setEmail("");
                    toast.success("Email sent - check your inbox!");
                  } else {
                    toast.error("Error sending email - try again?");
                  }
                });
              } else {
                toast.error("No account found with that email address.");
                setNoSuchAccount(true);
                setClickedEmail(false);
              }
            })
            .catch(() => {
              setClickedEmail(false);
              toast.error("Error sending email - try again?");
            });
        }}
        className="flex flex-col space-y-3"
      >
        {showEmailOption && (
          <div>
            <div className="mb-4 mt-1 border-t border-gray-300" />
            <input
              id="email"
              name="email"
              autoFocus={!isMobile}
              type="email"
              placeholder="tony@jani-ai.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setNoSuchAccount(false);
                setEmail(e.target.value);
              }}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
        )}
        <Button
          text="Continue with Email"
          variant="secondary"
          {...(!showEmailOption && {
            type: "button",
            onClick: (e: any) => {
              e.preventDefault();

              setShowEmailOption(true);
            },
          })}
          loading={clickedEmail}
          disabled={clickedGoogle || clickedSSO}
        />
      </form>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setClickedSSO(true);
          fetch("/api/auth/saml/verify", {
            method: "POST",
            body: JSON.stringify({ slug: e.currentTarget.slug.value }),
          }).then(async (res) => {
            const { data, error } = await res.json();
            if (error) {
              toast.error(error);
              setClickedSSO(false);
              return;
            }
            await signIn("saml", undefined, {
              tenant: data.workspaceId,
              product: "Dub",
            });
          });
        }}
        className="flex flex-col space-y-3"
      ></form>
      {noSuchAccount ? (
        <p className="text-center text-sm text-red-500">
          No such account.{" "}
          <Link href="/register" className="font-semibold text-red-600">
            Sign up
          </Link>{" "}
          instead?
        </p>
      ) : (
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-gray-500 transition-colors hover:text-black"
          >
            Sign up
          </Link>
        </p>
      )}
    </>
  );
}
