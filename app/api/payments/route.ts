import prisma from '@/prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createInventoryOrderPayment.safeParse(body);

    if (!validation.success) {
        console.error(validation.error.errors);
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

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
