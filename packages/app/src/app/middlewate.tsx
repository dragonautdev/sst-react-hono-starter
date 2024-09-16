import NextAuth from "next-auth";
import authConfig from "../utils/lib/auth/auth.config";

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

const { auth } = NextAuth(authConfig);

export default auth(() => {});
