import { hash } from '@node-rs/argon2';

import { prisma } from '@/lib/prisma';

import { TicketStatus } from '../generated/prisma/enums';

const users = [
  {
    username: 'admin',
    email: 'admin@mail.com',
  },
  {
    username: 'user',
    email: 'rey@mail.com',
  },
];

export const tickets = [
  {
    title: 'Ticket 1',
    content: 'This is the first ticket',
    status: TicketStatus.OPEN,
    bounty: 199,
    deadline: new Date().toISOString().split('T')[0],
  },
  {
    title: 'Ticket 2',
    content: 'This is the second ticket',
    status: TicketStatus.IN_PROGRESS,
    bounty: 299,
    deadline: new Date().toISOString().split('T')[0],
  },
  {
    title: 'Ticket 3',
    content: 'This is the third ticket',
    status: TicketStatus.DONE,
    bounty: 399,
    deadline: new Date().toISOString().split('T')[0],
  },
  {
    title: 'Ticket 4',
    content: 'This is the fourth ticket',
    status: TicketStatus.DONE,
    bounty: 499,
    deadline: new Date().toISOString().split('T')[0],
  },
  {
    title: 'Ticket 5',
    content: 'This is the fifth ticket',
    status: TicketStatus.DONE,
    bounty: 599,
    deadline: new Date().toISOString().split('T')[0],
  },
  {
    title: 'Ticket 6',
    content: 'This is the sixth ticket',
    status: TicketStatus.DONE,
    bounty: 699,
    deadline: new Date().toISOString().split('T')[0],
  },
  {
    title: 'Ticket 7',
    content: 'This is the seventh ticket',
    status: TicketStatus.DONE,
    bounty: 799,
    deadline: new Date().toISOString().split('T')[0],
  },
  {
    title: 'Ticket 8',
    content: 'This is the eighth ticket',
    status: TicketStatus.DONE,
    bounty: 899,
    deadline: new Date().toISOString().split('T')[0],
  },
  {
    title: 'Ticket 9',
    content: 'This is the ninth ticket',
    status: TicketStatus.DONE,
    bounty: 999,
    deadline: new Date().toISOString().split('T')[0],
  },
  {
    title: 'Ticket 10',
    content: 'This is the tenth ticket',
    status: TicketStatus.DONE,
    bounty: 1099,
    deadline: new Date().toISOString().split('T')[0],
  },
];

const comments = [
  { content: 'This is the first comment' },
  { content: 'This is the second comment' },
  { content: 'This is the third comment' },
];

const seed = async () => {
  await prisma.comment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ticket.deleteMany();

  const passwordHash = await hash('1qazxsw2');

  const dbUsers = await prisma.user.createManyAndReturn({
    data: users.map((user) => ({
      ...user,
      passwordHash,
    })),
  });

  const dbTickets = await prisma.ticket.createManyAndReturn({
    data: tickets.map((ticket) => ({
      ...ticket,
      userId: dbUsers[0].id,
    })),
  });

  await prisma.comment.createMany({
    data: comments.map((comment) => ({
      ...comment,
      userId: dbUsers[1].id,
      ticketId: dbTickets[0].id,
    })),
  });

  console.log('Database seeded successfully!');
};

seed();
