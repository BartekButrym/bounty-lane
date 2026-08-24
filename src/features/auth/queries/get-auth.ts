'use server';

import { cookies } from 'next/headers';
import { cache } from 'react';

import { SESSION_COOKIE_NAME } from '@/auth/constants';
import { validateSession } from '@/auth/session';

export const getAuth = cache(async () => {
  const sessionToken =
    (await cookies()).get(SESSION_COOKIE_NAME)?.value ?? null;

  if (!sessionToken) {
    return { session: null, user: null };
  }

  return validateSession(sessionToken);
});
