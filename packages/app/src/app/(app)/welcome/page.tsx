// import { Background } from "@dub/ui";
import { constructMetadata } from "~/utils";
import { Suspense } from "react";
import WelcomePageClient from "./_components/WelcomePageClient";

export const runtime = "nodejs";

export const metadata = constructMetadata({
  title: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}`,
});

export default function WelcomePage() {
  return (
    <>
      {/* <Background /> */}
      {/* <Suspense> */}
        <WelcomePageClient />
      {/* </Suspense> */}
    </>
  );
}
