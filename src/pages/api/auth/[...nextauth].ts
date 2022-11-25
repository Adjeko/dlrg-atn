import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from 'next-auth/providers/credentials';
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    //if the provider uses jwt specific informations have to be deconstructed here
    //to have them accessible in the session callback
    async jwt({ token, account, profile }) {
      return token
    },
    // Include user.id on session
    session({ session, token, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      else if(session.user && token && token.sub) {
        session.user.id = token.sub
      }
      
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      type: 'credentials',
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: 'Email', type: 'email', },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const {email, password} = credentials as {email:string,password:string}
        console.log('EMAIL ' + email)
        //find a user with the same password and get the account
        console.log('ENV ' + env.NEXTAUTH_URL)
        let foundAccount
        try{
        foundAccount = await prisma.user.findFirst({
          where: {
            email: email,
          },
          select: {
            id: true,
            email: true,
            name: true,
            accounts: {
              where: {
                type: 'credentials'
              },
              select: {
                userId: true,
                scope: true
              }
            }
          }
        })
      } catch ( error) {
        console.error(error)
      }

        console.log('FOUND ' + foundAccount)

        const isAuthorized = await bcrypt.compare(password, foundAccount?.accounts[0]?.scope ?? "")

        console.log(isAuthorized)
                
        // If no error and we have user data, return it
        if (isAuthorized) {
          const currentUser = await prisma.user.findUnique({
            where: {
              id: foundAccount?.id
            }
          })
          return currentUser;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
