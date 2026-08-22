import { Book, CircleUser, Library, LucideUsers } from 'lucide-react';

import {
  accountProfilePath,
  homePath,
  organizationsPath,
  ticketsPath,
} from '@/path';

import { NavItem } from './types';

export const navItems: NavItem[] = [
  {
    title: 'All Tickets',
    icon: <Library />,
    href: homePath(),
  },
  {
    title: 'My Tickets',
    icon: <Book />,
    href: ticketsPath(),
  },
  {
    separator: true,
    title: 'Account',
    icon: <CircleUser />,
    href: accountProfilePath(),
  },
  {
    title: 'Organization',
    icon: <LucideUsers />,
    href: organizationsPath(),
  },
];

export const closedClassName =
  'text-background opacity-0 transition-all duration-300 group-hover:z-40 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100';
