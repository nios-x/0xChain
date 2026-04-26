import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  // Custom pages — redirect unauthenticated users to /login
  pages: {
    signIn: "/login",
  },

  callbacks: {
    /**
     * Persist role (stored in localStorage on the client) into the JWT.
     * On first sign-in we only have the Google profile; role is patched
     * client-side after the user picks one on the login screen.
     */
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.id = profile.sub ?? token.sub;
        token.email = profile.email;
        token.name = profile.name;
        token.picture = (profile as Record<string, unknown>).picture as string | undefined;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id;
      }
      return session;
    },
  },

  // Use JWT strategy (no DB required for session)
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };