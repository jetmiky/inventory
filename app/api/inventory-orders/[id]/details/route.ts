import prisma from '@/prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createInventoryOrderDetailSchema = z.object({
    quantity: z.number().min(1),
    price: z.number().min(1),
    inventoryId: z.number().min(1),
});

const updateInventoryOrderDetailSchema = z.object({
    id: z.number().min(1),
    quantity: z.number().min(1),
    price: z.number().min(1),
    inventoryId: z.number().min(1),
});

const deleteInventoryOrderDetailSchema = z.object({
    id: z.number().min(1),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const orderId = (await params).id;
    const body = await request.json();
    const validation = createInventoryOrderDetailSchema.safeParse(body);

    if (!validation.success) {
        console.error(validation.error.errors);
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const detail = await prisma.inventoryOrderDetail.create({
        data: {
            quantity: validation.data.quantity,
            price: validation.data.price,
            inventoryOrderId: Number.parseInt(orderId),
            inventoryId: validation.data.inventoryId,
        },
        include: { inventory: true },
    });

    await prisma.inventory.update({
        where: { id: validation.data.inventoryId },
        data: { stock: { increment: validation.data.quantity } },
    });

    await prisma.inventoryOrder.update({
        where: { id: Number.parseInt(orderId) },
        data: { total: { increment: validation.data.quantity * validation.data.price } },
    });

    return NextResponse.json(detail, { status: 201 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const orderId = (await params).id;
    const body = await request.json();
    const validation = updateInventoryOrderDetailSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const detail = await prisma.inventoryOrderDetail.update({
        data: {
            quantity: validation.data.quantity,
            price: validation.data.price,
            inventoryId: validation.data.inventoryId,
        },
        where: { id: validation.data.id },
        include: { inventory: true },
    });

    await prisma.inventory.update({
        where: { id: validation.data.inventoryId },
        data: { stock: { increment: validation.data.quantity - detail.quantity } },
    });

    await prisma.inventoryOrder.update({
        where: { id: Number.parseInt(orderId) },
        data: { total: { increment: (validation.data.quantity - detail.quantity) * validation.data.price } },
    });

    return NextResponse.json(detail, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const orderId = (await params).id;

    const body = await request.json();
    const validation = deleteInventoryOrderDetailSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const detail = await prisma.inventoryOrderDetail.delete({ where: { id: validation.data.id } });

    await prisma.inventory.update({
        where: { id: detail.inventoryId },
        data: { stock: { decrement: detail.quantity } },
    });

    await prisma.inventoryOrder.update({
        where: { id: Number.parseInt(orderId) },
        data: { total: { decrement: detail.quantity * Number(detail.price) } },
    });

    return NextResponse.json({ message: 'Inventory Order Item deleted successfully', success: true }, { status: 200 });
}
