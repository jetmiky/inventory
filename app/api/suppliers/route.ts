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

const deleteSupplierSchema = z.object({
    id: z.number().min(1),
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

    return NextResponse.json({ ...supplier, methods: [] }, { status: 201 });
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
        include: { methods: true },
    });

    return NextResponse.json(supplier, { status: 200 });
}

export async function DELETE(request: NextRequest) {
    const body = await request.json();
    const validation = deleteSupplierSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const supplier = await prisma.supplier.findFirst({
        where: { id: validation.data.id },
        include: { orders: true },
    });

    if (supplier?.orders?.length) {
        return NextResponse.json({ message: `Cannot delete supplier, as already have ${supplier?.orders?.length} inventory order(s).`, success: false }, { status: 409 });
    }

    await prisma.supplierPaymentMethod.deleteMany({ where: { supplierId: validation.data.id } });
    await prisma.supplier.delete({ where: { id: validation.data.id } });

    return NextResponse.json({ message: 'Supplier deleted successfully', success: true }, { status: 200 });
}
