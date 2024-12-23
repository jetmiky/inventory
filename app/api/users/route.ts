import prisma from '@/prisma/client';
import { User } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createUserSchema = z.object({
    name: z.string().min(1).max(191),
    phone: z.string().min(1).max(191),
    email: z.string().min(1).max(191),
    address: z.string().min(1).max(191),
    password: z.string().min(1).max(191),
});

const updateUserSchema = z.object({
    id: z.number().min(1),
    name: z.optional(z.string().min(1).max(191)),
    phone: z.optional(z.string().min(1).max(191)),
    email: z.optional(z.string().min(1).max(191)),
    address: z.optional(z.string().min(1).max(191)),
    delete: z.optional(z.boolean()),
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createUserSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const user = await prisma.user.create({
        data: {
            name: validation.data.name,
            phone: validation.data.phone,
            email: validation.data.email,
            address: validation.data.address,
            password: validation.data.password,
        },
        include: { roles: true },
    });

    return NextResponse.json(user, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    let user = await prisma.user.update({
        data: {
            name: validation.data?.name,
            phone: validation.data?.phone,
            email: validation.data?.email,
            address: validation.data?.address,
        },
        where: { id: validation.data.id },
        include: { roles: true },
    });

    if (validation.data.delete) {
        const isInactive = !!user.deletedAt;
        user = await prisma.user.update({
            data: {
                deletedAt: isInactive ? null : new Date(),
            },
            where: { id: validation.data.id },
            include: { roles: true },
        });
    }

    return NextResponse.json(user, { status: 200 });
}
