import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { supabaseAdmin } from '@/lib/supabase';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      // Upsert user into Supabase
      await supabaseAdmin.from('users').upsert(
        {
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        },
        { onConflict: 'email' }
      );
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const { data } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single();
        if (data) {
          (session.user as typeof session.user & { id: string }).id = data.id;
        }
      }
      return session;
    },
  },
});
