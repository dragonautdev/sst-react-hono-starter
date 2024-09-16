"use client";
import { BlurImage, Input, Logo, Modal } from "~/components/ui";
import { Button } from "../../Auth-Button";
import { useMediaQuery } from "~/utils/hooks";
import va from "@vercel/analytics";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { api } from "~/trpc/react";
import { useToast } from "~/utils/hooks";

function InviteTeammateModal({
  showInviteTeammateModal,
  setShowInviteTeammateModal,
  id,
  slug,
  logo,
  workspaceName,
}: {
  showInviteTeammateModal: boolean;
  setShowInviteTeammateModal: Dispatch<SetStateAction<boolean>>;
  id: string;
  slug: string;
  logo: string;
  workspaceName: string;
}) {
  const [inviting, setInviting] = useState(false);
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const { isMobile } = useMediaQuery();
  const utils = api.useUtils();
  const { isPending, mutateAsync } = api.workspace.sendInvite.useMutation({
    onSuccess: () => {
      toast({
        description: "Invite sent out succesfully",
      });
    },
    onError(error, variables, context) {
      toast({
        description: `Failed to send invite, ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      toast({
        description: "Invite sent out succesfully",
      });
      utils.workspace.getUsersAndInvites.invalidate();
      setShowInviteTeammateModal(false);
    },
  });

  async function submitHandler(e: any) {
    e.preventDefault();
    try {
      const res = await mutateAsync({
        email,
        usersLimit: 0,
        workspaceId: id,
        workspaceName,
        workspaceSlug: slug,
      });
    } catch (cause) {
      toast({
        description: "Failed to send invite",
        variant: "destructive",
      });
    }
    // console.log(res);
  }

  return (
    <Modal
      showModal={showInviteTeammateModal}
      setShowModal={setShowInviteTeammateModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
        {/* {logo ? (
          <BlurImage
            src={logo}
            alt={"Invite Teammate"}
            className="h-10 w-10 rounded-full"
            width={20}
            height={20}
          />
        ) : (
          <Logo />
        )} */}
        <h3 className="text-lg font-medium">Invite Teammate</h3>
        <p className="text-center text-sm text-gray-500">
          Invite a teammate to join your workspace. Invitations will be valid
          for 14 days.
        </p>
      </div>
      <form
        onSubmit={submitHandler}
        className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 text-left sm:px-16"
      >
        <div>
          <label htmlFor="email" className="block text-sm text-gray-700">
            Email
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="james@jani-ai.com"
              autoFocus={!isMobile}
              autoComplete="off"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
          </div>
        </div>
        <Button
          loading={isPending}
          text="Send invite"
          type="button"
          onClick={submitHandler}
        />
      </form>
    </Modal>
  );
}

export function useInviteTeammateModal({
  id,
  slug,
  logo,
  workspaceName,
}: {
  id: string;
  slug: string;
  logo: string;
  workspaceName: string;
}) {
  const [showInviteTeammateModal, setShowInviteTeammateModal] = useState(false);

  const InviteTeammateModalCallback = useCallback(() => {
    return (
      <InviteTeammateModal
        showInviteTeammateModal={showInviteTeammateModal}
        setShowInviteTeammateModal={setShowInviteTeammateModal}
        id={id}
        logo={logo}
        slug={slug}
        workspaceName={workspaceName}
      />
    );
  }, [showInviteTeammateModal, setShowInviteTeammateModal]);

  return useMemo(
    () => ({
      setShowInviteTeammateModal,
      InviteTeammateModal: InviteTeammateModalCallback,
    }),
    [setShowInviteTeammateModal, InviteTeammateModalCallback],
  );
}
