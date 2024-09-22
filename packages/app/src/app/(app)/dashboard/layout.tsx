// import "~/styles/globals.css";
import Layout from "~/components/Layout/Layout";
// import { Toaster } from "~/components/ui/Toaster";
import { SessionProvider } from "next-auth/react";
import { auth } from "~/utils/lib/auth/auth/auth";

import { redirect } from "next/navigation";
import React from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session === null) {
    redirect("/login");
  }
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className="">
          <Layout>
            <main className="min-h-screen bg-[#FCFCFD] px-5 ">{children}</main>
            {/* <Toaster /> */}
          </Layout>
        </body>
      </html>
    </SessionProvider>
  );
}
