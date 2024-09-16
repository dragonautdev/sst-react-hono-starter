export const roles = ["owner", "member"] as const;
export const plans = [
  "free",
  "pro",
  "business",
  "business plus",
  "business extra",
  "business max",
  "enterprise",
] as const;
export type PlanProps = (typeof plans)[number];
export type RoleProps = (typeof roles)[number];

export interface WorkspaceProps {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  plan: PlanProps;
  stripeId: string | null;
  billingCycleStart: number;
  stripeConnectId: string | null;
  createdAt: Date;

  users: {
    role: RoleProps;
  }[];
  inviteCode: string;
  // reportLimit: number;
  // farmersLimit: number;
  // harvestsLimit: number;
  betaTester?: boolean;
}

export interface UserProps {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  // source: string | null;
  // migratedWorkspace: string | null;
  // defaultWorkspace?: string;
}

export interface WorkspaceUserProps extends UserProps {
  role: RoleProps;
}
