import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const adminLogin = process.env.ADMIN_LOGIN
        const adminPassword = process.env.ADMIN_PASSWORD
        
        if (
          credentials?.username === adminLogin &&
          credentials?.password === adminPassword
        ) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@example.com",
            isAdmin: true
          }
        }
        return null
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = (user as any).isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).isAdmin = token.isAdmin
      }
      return session
    },
  },
}

export const getAuthSession = async () => {
  const { getServerSession } = await import('next-auth')
  return getServerSession(authOptions)
}
