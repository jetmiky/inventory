import prisma from '@/prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createPaymentMethodSchema = z.object({
    name: z.string().min(1).max(191),
    account: z.string().min(1).max(191),
});

const updatePaymentMethodSchema = z.object({
    id: z.number().min(1),
    name: z.string().min(1).max(191),
    account: z.string().min(1).max(191),
});

export async function GET(request: NextRequest) {
    const supplierId = request.nextUrl.searchParams.get('id') as string;
    const methods = await prisma.supplierPaymentMethod.findMany({
        where: { supplierId: Number.parseInt(supplierId) },
    });

    return NextResponse.json(methods, { status: 200 });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const supplierId = (await params).id;
    const body = await request.json();
    const validation = createPaymentMethodSchema.safeParse(body);

    if (!validation.success) {
        console.error(validation.error.errors);
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const supplier = await prisma.supplierPaymentMethod.create({
        data: {
            name: validation.data.name,
            account: validation.data.account,
            supplierId: Number.parseInt(supplierId),
        },
    });

    return NextResponse.json(supplier, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const validation = updatePaymentMethodSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const supplier = await prisma.supplierPaymentMethod.update({
        data: {
            name: validation.data.name,
            account: validation.data.account,
        },
        where: { id: validation.data.id },
    });

    return NextResponse.json(supplier, { status: 200 });
}
