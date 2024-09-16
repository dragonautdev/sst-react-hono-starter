"use client";
import { useAddWorkspaceModal } from "./add-workspace-modal";
import { useSearchParams } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
} from "react";
import { api } from "~/trpc/react";


export const ModalContext = createContext<{
  setShowAddWorkspaceModal: Dispatch<SetStateAction<boolean>>;
 
}>({
  setShowAddWorkspaceModal: () => {},
});

export default function ModalProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();

  const { AddWorkspaceModal, setShowAddWorkspaceModal } =
    useAddWorkspaceModal();
     const { data, isLoading } = api.workspace.fetchAllWorkspaces.useQuery();
     const workspaces = data?.workspaces;

//   const { id, error } = useWorkspace();

  // handle ?newWorkspace and ?newLink query params
  useEffect(() => {
    if (searchParams.has("newWorkspace")) {
      setShowAddWorkspaceModal(true);
    }
  }, []);

//   const { data: session, update } = useSession();

  // if user has workspaces but no defaultWorkspace, refresh to get defaultWorkspace
//   useEffect(() => {
//     if (
//       workspaces &&
//       workspaces.length > 0 &&
//       session?.user &&
//       !session.user["defaultWorkspace"]
//     ) {
//       fetch("/api/user", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           defaultWorkspace: workspaces[0].slug,
//         }),
//       }).then(() => update());
//     }
//   }, [session]);

  return (
    <ModalContext.Provider
      value={{
        setShowAddWorkspaceModal,
       
      }}
    >
      <AddWorkspaceModal />
      {children}
    </ModalContext.Provider>
  );
}
