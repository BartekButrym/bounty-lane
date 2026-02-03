import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';


import { getAuth } from '@/auth/cookie';
import { User } from '../../../../generated/prisma/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isFetched, setIsFetched] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const { user } = await getAuth();
      setUser(user);
      setIsFetched(true);
    };

    fetchUser();
  }, [pathname]);

  return { user, isFetched };
};
