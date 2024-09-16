"use client";
import { UserProps } from "~/utils/types";
import { Avatar, BlurImage, Modal, Logo } from "~/components/ui";
import { Button } from "../../Auth-Button";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { useToast } from "~/utils/hooks";

function EditRoleModal({
  showEditRoleModal,
  setShowEditRoleModal,
  user,
  role,
}: {
  showEditRoleModal: boolean;
  setShowEditRoleModal: Dispatch<SetStateAction<boolean>>;
  user: UserProps;
  role: "owner" | "member";
}) {
  const params = useParams();
  const { data } = api.workspace.getSpecificWorkspace.useQuery({
    slug: params.accountSlug as unknown as string,
  });
  //   const { id, name: workspaceName, logo } = useWorkspace();
  const workspace = data?.workspace;
  const { id: userId, name, email } = user;
  const { toast } = useToast();
  const utils = api.useUtils();
  const { isLoading, mutateAsync } = api.workspace.changeRole.useMutation({
    onError: (error) => {
      toast({
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Succesfully updated the team member role",
      });
    },

    onSettled: () => {
      utils.workspace.getSpecificWorkspace.invalidate();
    },
  });

  return (
    <Modal showModal={showEditRoleModal} setShowModal={setShowEditRoleModal}>
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
        {/* {workspace?.logo ? (
          <BlurImage
            src={workspace?.logo}
            alt="Workspace logo"
            className="h-10 w-10 rounded-full"
            width={20}
            height={20}
          />
        ) : (
          <Logo />
        )} */}
        <h3 className="text-lg font-medium">Change Teammate Role</h3>
        <p className="text-center text-sm text-gray-500">
          This will change <b className="text-gray-800">{name || email}</b>'s
          role in <b className="text-gray-800">{workspace?.name}</b> to{" "}
          <b className="text-gray-800">{role}</b>. Are you sure you want to
          continue?
        </p>
      </div>

      <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 text-left sm:px-16">
        <div className="flex items-center space-x-3 rounded-md border border-gray-300 bg-white p-3">
          <Avatar user={user} />
          <div className="flex flex-col">
            <h3 className="text-sm font-medium">{user?.user?.name || email}</h3>
            <p className="text-xs text-gray-500">{user?.user?.email}</p>
          </div>
        </div>
        <Button
          text="Confirm"
          className="cursor-pointer"
          loading={isLoading}
          onClick={() => {
            mutateAsync({
              userId: user?.user?.id,
              role,
              workspaceSlug: params.accountSlug as unknown as string,
            });
          }}

        />
      </div>
    </Modal>
  );
}

export function useEditRoleModal({
  user,
  role,
}: {
  user: UserProps;
  role: "owner" | "member";
}) {
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);

  const EditRoleModalCallback = useCallback(() => {
    return (
      <EditRoleModal
        showEditRoleModal={showEditRoleModal}
        setShowEditRoleModal={setShowEditRoleModal}
        user={user}
        role={role}
      />
    );
  }, [showEditRoleModal, setShowEditRoleModal]);

  return useMemo(
    () => ({
      setShowEditRoleModal,
      EditRoleModal: EditRoleModalCallback,
    }),
    [setShowEditRoleModal, EditRoleModalCallback],
  );
}
