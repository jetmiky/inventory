import prisma from '@/prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// @ts-ignore
BigInt.prototype.toJSON = function () {
    return this.toString();
};

const createInventoryOrderPayment = z.object({
    total: z.number().min(1),
    timestamp: z.coerce.date(),
    inventoryOrderId: z.number().min(1).max(191),
    supplierPaymentMethodId: z.number().min(1).max(191),
});

const updateInventoryOrderPaymentSchema = z.object({
    id: z.number().min(1),
    total: z.number().min(1),
    timestamp: z.coerce.date(),
    inventoryOrderId: z.number().min(1).max(191),
    supplierPaymentMethodId: z.number().min(1).max(191),
});

const deleteInventoryOrderPaymentSchema = z.object({
    id: z.number().min(1),
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createInventoryOrderPayment.safeParse(body);

    if (!validation.success) {
        console.error(validation.error.errors);
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const order = await prisma.inventoryOrder.findFirst({
        where: { id: validation.data.inventoryOrderId },
    });

    const data = { totalPayment: { increment: validation.data.total }, status: order?.status };

    if (Number(order?.totalPayment) + validation.data.total >= Number(order?.total)) {
        data.status = 'COMPLETED';
    }

    await prisma.inventoryOrder.update({ where: { id: validation.data.inventoryOrderId }, data });

    const payment = await prisma.inventoryOrderPayment.create({
        data: {
            total: validation.data.total,
            timestamp: validation.data.timestamp,
            inventoryOrderId: validation.data.inventoryOrderId,
            supplierPaymentMethodId: validation.data.supplierPaymentMethodId,
        },
        include: { method: true },
    });

    return NextResponse.json(payment, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const validation = updateInventoryOrderPaymentSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const order = await prisma.inventoryOrder.findFirst({
        where: { id: validation.data.inventoryOrderId },
    });

    const oldPayment = await prisma.inventoryOrderPayment.findFirst({
        where: { id: validation.data.id },
    });

    const totalPaymentBefore = Number(order?.totalPayment) - Number(oldPayment?.total);
    const updatedTotalPayment = totalPaymentBefore + Number(validation.data.total);

    const data = { totalPayment: updatedTotalPayment, status: order?.status };

    if (updatedTotalPayment >= Number(order?.total)) {
        data.status = 'COMPLETED';
    }

    await prisma.inventoryOrder.update({ where: { id: order?.id }, data });

    const payment = await prisma.inventoryOrderPayment.update({
        data: {
            total: validation.data.total,
            timestamp: validation.data.timestamp,
            inventoryOrderId: validation.data.inventoryOrderId,
            supplierPaymentMethodId: validation.data.supplierPaymentMethodId,
        },
        include: { method: true },
        where: { id: validation.data.id },
    });

    return NextResponse.json(payment, { status: 200 });
}

export async function DELETE(request: NextRequest) {
    const body = await request.json();
    const validation = deleteInventoryOrderPaymentSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const payment = await prisma.inventoryOrderPayment.delete({ where: { id: validation.data.id } });
    const order = await prisma.inventoryOrder.findFirst({
        where: { id: payment.inventoryOrderId },
    });

    const data = { totalPayment: { decrement: payment.total }, status: order?.status };

    if (Number(order?.totalPayment) + Number(payment.total) >= Number(order?.total)) {
        data.status = 'COMPLETED';
    }

    await prisma.inventoryOrder.update({ where: { id: order?.id }, data });

    return NextResponse.json({ message: 'Supplier deleted successfully', success: true }, { status: 200 });
}
