import { PrismaClient } from '@prisma/client';

const createPrismaClient = () => {
    return new PrismaClient();
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
declare const globalThis: {
    prismaGlobal: ReturnType<typeof createPrismaClient>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? createPrismaClient();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
