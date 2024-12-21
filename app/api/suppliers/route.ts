import prisma from '@/prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createSupplierSchema = z.object({
    name: z.string().min(1).max(191),
    phone: z.string().min(1).max(191),
    email: z.string().min(1).max(191),
    address: z.string().min(1).max(191),
});

const updateSupplierSchema = z.object({
    id: z.number().min(1),
    name: z.string().min(1).max(191),
    phone: z.string().min(1).max(191),
    email: z.string().min(1).max(191),
    address: z.string().min(1).max(191),
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createSupplierSchema.safeParse(body);

    if (!validation.success) {
        console.error(validation.error.errors);
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const supplier = await prisma.supplier.create({
        data: {
            name: validation.data.name,
            phone: validation.data.phone,
            email: validation.data.email,
            address: validation.data.address,
        },
    });

    return NextResponse.json(supplier, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const validation = updateSupplierSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const supplier = await prisma.supplier.update({
        data: {
            name: validation.data.name,
            phone: validation.data.phone,
            email: validation.data.email,
            address: validation.data.address,
        },
        where: { id: validation.data.id },
    });

    return NextResponse.json(supplier, { status: 200 });
}
