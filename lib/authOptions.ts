import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  // session: {
  //     strategy: "jwt",
  // },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'sample username',
        },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        if (!req.body) {
          return null;
        }
        // console.log("REQ BODY IN credentials : ", req.body)
        // const res = await fetch('http://localhost:3001/api/login', {
        // const res = await fetch('http://localhost:3001/api/login', {
        //   method: 'POST',
        //   body: JSON.stringify({
        //     email: req.body.email,
        //     password: req.body.password,
        //   }),
        //   headers: { 'Content-Type': 'application/json' },
        // });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/public/auth/login`,
          {
            method: 'POST',
            body: JSON.stringify({
              email: req.body.email,
              password: req.body.password,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await res.json();

        // If no error and we have user data, return it
        if (res.ok && data.data) {
          return data.data;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  // pages: {
  //     signIn: '/signup'
  // },
  session: {
    maxAge: 24 * 2 * 60 * 60,
    updateAge: 24 * 2 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token; // Persist access token
        token.user = user;
      }
      return token;
    },
    async session({ session, token, user }) {
      (session as any).accessToken = token.accessToken; // Include access token in session
      // console.log("USER : ", user);
      // console.log("TOKEN : ", token);
      (session as any).user = token.user;
      return session;
    },
  },
};
