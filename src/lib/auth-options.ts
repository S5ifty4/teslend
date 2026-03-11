import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabaseAdmin } from '@/lib/supabase';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  pages: {
    newUser: '/onboarding',
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await supabaseAdmin.from('users').upsert(
        { email: user.email, name: user.name ?? null, image: user.image ?? null },
        { onConflict: 'email' }
      );
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const { data } = await supabaseAdmin
          .from('users')
          .select('id, profile_completed, phone, tesla_model, tesla_year')
          .eq('email', session.user.email)
          .single();
        if (data) {
          const u = session.user as typeof session.user & {
            id: string;
            profile_completed: boolean;
            phone: string | null;
            tesla_model: string | null;
            tesla_year: number | null;
          };
          u.id = data.id;
          u.profile_completed = data.profile_completed ?? false;
          u.phone = data.phone ?? null;
          u.tesla_model = data.tesla_model ?? null;
          u.tesla_year = data.tesla_year ?? null;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
