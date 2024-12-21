import prisma from '@/prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createInventoryUsageSchema = z.object({
    quantity: z.number().min(1),
    timestamp: z.coerce.date(),
    inventoryId: z.number().min(1),
    userId: z.number().min(1),
});

const updateInventoryUsageSchema = z.object({
    id: z.number().min(1),
    quantity: z.number().min(1),
    timestamp: z.coerce.date(),
    inventoryId: z.number().min(1),
    userId: z.number().min(1),
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createInventoryUsageSchema.safeParse(body);

    if (!validation.success) {
        console.error(validation.error.errors);
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const usage = await prisma.inventoryUsage.create({
        data: {
            quantity: validation.data.quantity,
            timestamp: validation.data.timestamp,
            inventoryId: validation.data.inventoryId,
            userId: validation.data.userId,
        },
        include: { inventory: true, user: true },
    });

    return NextResponse.json(usage, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const validation = updateInventoryUsageSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const usage = await prisma.inventoryUsage.update({
        data: {
            quantity: validation.data.quantity,
            timestamp: validation.data.timestamp,
            inventoryId: validation.data.inventoryId,
            userId: validation.data.userId,
        },
        include: { inventory: true, user: true },
        where: { id: validation.data.id },
    });

    return NextResponse.json(usage, { status: 200 });
}
