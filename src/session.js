import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { prisma } from './prisma.js';

export const sessionMiddleware = session({
  secret: 'guess what this is?',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true
        }
    )
}); 