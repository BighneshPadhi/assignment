import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetchJson } from "@/lib/api";

type DummyJsonUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  image?: string;
  token: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        try {
          const user = await fetchJson<DummyJsonUser>("/auth/login", {
            method: "POST",
            body: {
              username: credentials.username,
              password: credentials.password,
            },
          });

          return {
            id: String(user.id),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            image: user.image,
            token: user.token,
            username: user.username,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          username: user.username,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
};
