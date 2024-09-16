"use client";

import { AlertCircleFill, LoadingSpinner } from "~/components/ui";

import { useMediaQuery, useRouterStuff } from "~/utils/hooks";
import { InfoTooltip, Modal } from "~/components/ui";
import slugify from "@sindresorhus/slugify";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useToast } from "~/utils/hooks/UseToast";
import Button from "~/components/ui/button";
import { TooltipProvider } from "~/components/ui";
import { Input } from "~/components/ui";
import { api } from "~/trpc/react";

function AddWorkspaceModalHelper({
  showAddWorkspaceModal,
  setShowAddWorkspaceModal,
}: {
  showAddWorkspaceModal: boolean;
  setShowAddWorkspaceModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [data, setData] = useState<{
    name: string;
    slug: string;
  }>({
    name: "",
    slug: "",
  });
  const { name, slug } = data;

  const [slugError, setSlugError] = useState<string | null>(null);

  useEffect(() => {
    setSlugError(null);
    setData((prev) => ({
      ...prev,
      slug: slugify(name),
    }));
  }, [name]);

  const welcomeFlow = pathname === "/welcome";

  const searchParams = useSearchParams();
  const { queryParams } = useRouterStuff();

  const { isMobile } = useMediaQuery();

  const { isLoading, mutateAsync, isError } =
    api.workspace.addWorkSpace.useMutation({
      onError: (error) => {
        toast({
          variant: "destructive",
          description: error.message,
        });
      },
    });
  const onSubmit = async () => {
    try {
      const res = await mutateAsync({ slug: slug, name: name });
      // if (res === "Project already in use") {
      //   setSlugError("Slug is already in use.");
      // }
      if (res) {
        va.track("Created Workspace");
        router.push(`/dashboard/${slug}/farmers`);
        toast({
          description: "Successfully created workspace!",
        });
        setShowAddWorkspaceModal(false);
      }
    } catch (cause) {
      console.log(cause);
    }
  };

  return (
    <TooltipProvider>
      <Modal
        showModal={showAddWorkspaceModal}
        setShowModal={setShowAddWorkspaceModal}
        preventDefaultClose={welcomeFlow}
        onClose={() => {
          if (welcomeFlow) {
            router.back();
          } else if (searchParams.has("newWorkspace")) {
            queryParams({
              del: ["newWorkspace"],
            });
          }
        }}>
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
          <h3 className="text-lg font-medium">Create a new workspace</h3>
          <a
            href="/"
            target="_blank"
            className="-translate-y-2 text-center text-xs text-gray-500 underline underline-offset-4 hover:text-gray-800">
            What is a workspace?
          </a>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16">
          <div>
            <label htmlFor="name" className="flex items-center space-x-2">
              <p className="block text-sm font-medium text-gray-700">
                Workspace Name
              </p>
              <InfoTooltip
                content={`This is the name of your workspace on ${process.env.NEXT_PUBLIC_APP_NAME}.`}
              />
            </label>
            <div className="mt-2 flex rounded-md shadow-sm">
              <Input
                name="name"
                id="name"
                type="text"
                required
                autoFocus={!isMobile}
                autoComplete="off"
                placeholder="Acme, Inc."
                value={name}
                onChange={(e) => {
                  setData({ ...data, name: e.target.value });
                }}
                aria-invalid="true"
              />
            </div>
          </div>

          <div>
            <label htmlFor="slug" className="flex items-center space-x-2">
              <p className="block text-sm font-medium text-gray-700">
                Workspace Slug
              </p>
              <InfoTooltip
                content={`This is your workspace's unique slug on ${process.env.NEXT_PUBLIC_APP_NAME}.`}
              />
            </label>
            <div className="relative mt-2 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-5 text-gray-500 sm:text-sm">
                {process.env.NEXT_PUBLIC_APP_DOMAIN}
              </span>
              <Input
                name="slug"
                id="slug"
                type="text"
                required
                autoComplete="off"
                pattern="[a-zA-Z0-9\-]+"
                className={`${
                  slugError
                    ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500"
                } block w-full rounded-r-md focus:outline-none sm:text-sm`}
                placeholder="acme"
                value={slug}
                minLength={3}
                maxLength={48}
                onChange={(e) => {
                  setSlugError(null);
                  setData({ ...data, slug: e.target.value });
                }}
                aria-invalid="true"
              />
              {slugError && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <AlertCircleFill
                    className="h-5 w-5 text-red-500"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
            {slugError && (
              <p className="mt-2 text-sm text-red-600" id="slug-error">
                {slugError}
              </p>
            )}
          </div>

          <Button type="button" onClick={onSubmit}>
            {isLoading && <LoadingSpinner className="pr-3" />}
            Create Workspace
          </Button>
        </form>
      </Modal>
    </TooltipProvider>
  );
}

export function useAddWorkspaceModal() {
  const [showAddWorkspaceModal, setShowAddWorkspaceModal] = useState(false);

  const AddWorkspaceModal = useCallback(() => {
    return (
      <AddWorkspaceModalHelper
        showAddWorkspaceModal={showAddWorkspaceModal}
        setShowAddWorkspaceModal={setShowAddWorkspaceModal}
      />
    );
  }, [showAddWorkspaceModal, setShowAddWorkspaceModal]);

  return useMemo(
    () => ({ setShowAddWorkspaceModal, AddWorkspaceModal }),
    [setShowAddWorkspaceModal, AddWorkspaceModal]
  );
}
