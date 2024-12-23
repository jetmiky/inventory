import prisma from '@/prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// @ts-ignore
BigInt.prototype.toJSON = function () {
    return this.toString();
};

const createInventoryOrderSchema = z.object({
    supplierId: z.number().min(1),
    invoice: z.string().min(1).max(191),
    timestamp: z.coerce.date(),
});

const updateInventoryOrderSchema = z.object({
    id: z.number().min(1),
    supplierId: z.optional(z.number().min(1)),
    invoice: z.optional(z.string().min(1).max(191)),
    timestamp: z.optional(z.coerce.date()),
    discount: z.optional(z.number().min(0)),
    tax: z.optional(z.number().min(0)),
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createInventoryOrderSchema.safeParse(body);

    if (!validation.success) {
        console.error(validation.error.errors);
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const order = await prisma.inventoryOrder.create({
        data: {
            invoice: validation.data.invoice,
            timestamp: validation.data.timestamp,
            supplierId: validation.data.supplierId,
        },
        include: { supplier: true },
    });

    return NextResponse.json(order, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const validation = updateInventoryOrderSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const details = await prisma.inventoryOrderDetail.findMany({ where: { inventoryOrderId: validation.data.id } });
    let total = details.reduce((total, detail) => total + detail.quantity * Number(detail.price), 0);
    total = total - (validation.data.discount || 0) + (validation.data.tax || 0);

    const order = await prisma.inventoryOrder.update({
        data: {
            invoice: validation.data?.invoice,
            timestamp: validation.data?.timestamp,
            supplierId: validation.data?.supplierId,
            discount: validation.data?.discount,
            tax: validation.data?.tax,
            total,
        },
        include: { supplier: true },
        where: { id: validation.data.id },
    });

    return NextResponse.json(order, { status: 200 });
}
