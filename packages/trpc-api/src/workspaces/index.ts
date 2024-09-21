import { mergeRouters } from "../trpc";
import { getSpecificWorkSpace } from "./get-specific-workspace";
import { addWorkSpace } from "./add-worksapce";
import { fetchAllWorkspaces } from "./fetch-all-workspace";
import { getUsersAndInvites } from "./getUsersAndInvites";
import { editWorkspace } from "./edit-workspace";
import { invites } from "./invites";
import { deleteTeamInvite } from "./delete-team-invite";
import { resetInviteLink } from "./reset-invites";
import { acceptInvite } from "./accept-invite";
import { changeTeamMemberRole } from "./change-team-member-role";

const workspace = mergeRouters(
  addWorkSpace,
  getSpecificWorkSpace,
  fetchAllWorkspaces,
  getUsersAndInvites,
  editWorkspace,
  invites,
  deleteTeamInvite,
  resetInviteLink,
  acceptInvite,
  changeTeamMemberRole
);
export default workspace;