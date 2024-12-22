import prisma from '@/prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createBrandSchema = z.object({
    name: z.string().min(1).max(191),
});

const updateBrandSchema = z.object({
    id: z.number().min(1),
    name: z.string().min(1).max(191),
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createBrandSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const brand = await prisma.inventoryBrand.create({
        data: { name: validation.data.name },
    });

    return NextResponse.json(brand, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const validation = updateBrandSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const brand = await prisma.inventoryBrand.update({
        data: { name: validation.data.name },
        where: { id: validation.data.id },
    });

    return NextResponse.json(brand, { status: 200 });
}
