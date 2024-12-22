import prisma from '@/prisma/client';
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
    name: z.string().min(1).max(191),
    phone: z.string().min(1).max(191),
    email: z.string().min(1).max(191),
    address: z.string().min(1).max(191),
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
    });

    return NextResponse.json(user, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const user = await prisma.user.update({
        data: {
            name: validation.data.name,
            phone: validation.data.phone,
            email: validation.data.email,
            address: validation.data.address,
        },
        where: { id: validation.data.id },
    });

    return NextResponse.json(user, { status: 200 });
}
