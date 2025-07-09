'use client';

import React from 'react';
import { Button } from './button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Logoutbutton() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay

    const errormessage = null;

    if (!errormessage) {
      toast('Logged out successfully');
      setLoading(false);
      router.push('/');
    } else {
      toast.error(errormessage);
      setLoading(false);
    }
  };

  return (
    <Button className="w-24" onClick={handleLogout} disabled={loading}>
      {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Logout'}
    </Button>
  );
}
