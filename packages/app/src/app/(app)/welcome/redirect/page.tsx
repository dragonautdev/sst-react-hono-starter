"use client";

import React, { useEffect } from "react";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { data, isLoading } = api.workspace.fetchAllWorkspaces.useQuery();
  const workspace = data?.workspaces[0];

  useEffect(() => {
    if (!isLoading) {
      if (!workspace?.slug) {
        router.push("/welcome");
      }

      if (workspace?.slug && !isLoading) {
        router.push(`/dashboard/${workspace?.slug}/farmers`);
      }
    }
  }, [workspace]);

  return (
    <section className="h-screen w-screen bg-gray-50">
      <div className="flex h-[calc(100vh-16px)] items-center justify-center">
        <LoadingSpinner />
      </div>
    </section>
  );
}
