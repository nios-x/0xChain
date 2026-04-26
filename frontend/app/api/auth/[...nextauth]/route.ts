import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  // callbacks:{
  //    async signIn({ account, profile }) {
  //     if (account?.provider === "google") {
  //       if (!profile?.email) return false;

  //       const user = await prisma.user.findUnique({
  //         where: { email: profile.email },
  //       });

  //       if (!user) {
  //         await prisma.user.create({
  //           data: {
  //             email: profile.email,
  //             provider: "Google",
  //             //@ts-ignore
  //             pic: profile.picture || "",
  //             name: profile.name || "",
  //           },
  //         });
  //       }

  //       return true;
  //     }
  //     return false;
  //   },
  // }
})


export { handler as GET, handler as POST }