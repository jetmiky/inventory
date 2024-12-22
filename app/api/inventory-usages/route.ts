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
    userId: z.number().min(1),
});

const deleteInventoryUsageSchema = z.object({
    id: z.number().min(1),
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

    await prisma.inventory.update({
        where: { id: validation.data.inventoryId },
        data: { stock: { decrement: validation.data.quantity } },
    });

    return NextResponse.json(usage, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const validation = updateInventoryUsageSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const oldUsage = await prisma.inventoryUsage.findFirst({
        where: { id: validation.data.id },
    });

    const stock = (oldUsage?.quantity as number) - validation.data.quantity;

    const inventory = await prisma.inventory.update({
        where: { id: oldUsage?.inventoryId },
        data: { stock: { increment: stock } },
    });

    const updatedUsage = await prisma.inventoryUsage.update({
        data: {
            quantity: validation.data.quantity,
            timestamp: validation.data.timestamp,
            userId: validation.data.userId,
        },
        include: { inventory: true, user: true },
        where: { id: validation.data.id },
    });

    return NextResponse.json(updatedUsage, { status: 200 });
}

export async function DELETE(request: NextRequest) {
    const body = await request.json();
    const validation = deleteInventoryUsageSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const usage = await prisma.inventoryUsage.delete({ where: { id: validation.data.id } });
    console.log(usage);
    await prisma.inventory.update({
        where: { id: usage.inventoryId },
        data: { stock: { increment: usage.quantity } },
    });

    return NextResponse.json({ message: 'Inventory Usage deleted successfully', success: true }, { status: 200 });
}
