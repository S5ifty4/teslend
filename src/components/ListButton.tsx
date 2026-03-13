'use client';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Props {
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline';
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

export default function ListButton({ size = 'default', variant = 'default', className, style, label = 'List Accessory' }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (session) {
      router.push('/listings/new');
    } else {
      signIn('google', { callbackUrl: '/listings/new' });
    }
  };

  return (
    <Button size={size} variant={variant} className={className} style={style} onClick={handleClick}>
      {label}
    </Button>
  );
}
