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
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // Check if user already exists
      const { data: existing } = await supabaseAdmin
        .from('users')
        .select('id, name, image')
        .eq('email', user.email)
        .single();

      if (existing) {
        // User exists — only update image if they haven't set a custom one
        // Never overwrite name (user may have customized it)
        if (!existing.image && user.image) {
          await supabaseAdmin
            .from('users')
            .update({ image: user.image })
            .eq('email', user.email);
        }
      } else {
        // New user — insert with Google name + image as defaults
        await supabaseAdmin.from('users').insert({
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        });
      }

      return true;
    },
    async jwt({ token, trigger }) {
      // On sign-in or explicit update, fetch latest profile state
      if (trigger === 'signIn' || trigger === 'update' || !('profile_completed' in token)) {
        if (token.email) {
          const { data } = await supabaseAdmin
            .from('users')
            .select('id, profile_completed, phone, tesla_model, tesla_year')
            .eq('email', token.email as string)
            .single();
          if (data) {
            token.id = data.id;
            token.profile_completed = data.profile_completed ?? false;
            token.phone = data.phone ?? null;
            token.tesla_model = data.tesla_model ?? null;
            token.tesla_year = data.tesla_year ?? null;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      const u = session.user as typeof session.user & {
        id: string;
        profile_completed: boolean;
        phone: string | null;
        tesla_model: string | null;
        tesla_year: number | null;
      };
      u.id = token.id as string;
      u.profile_completed = (token.profile_completed as boolean) ?? false;
      u.phone = (token.phone as string | null) ?? null;
      u.tesla_model = (token.tesla_model as string | null) ?? null;
      u.tesla_year = (token.tesla_year as number | null) ?? null;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
