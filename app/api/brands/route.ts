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

const deleteBrandSchema = z.object({
    id: z.number().min(1),
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

export async function DELETE(request: NextRequest) {
    const body = await request.json();
    const validation = deleteBrandSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const brand = await prisma.inventoryBrand.findFirst({
        where: { id: validation.data.id },
        include: { inventories: true },
    });

    if (brand?.inventories?.length) {
        return NextResponse.json({ message: `Cannot delete inventory brand, as already mapped to ${brand?.inventories?.length} inventory.`, success: false }, { status: 409 });
    }

    await prisma.inventoryBrand.delete({ where: { id: validation.data.id } });

    return NextResponse.json({ message: 'Brand deleted successfully', success: true }, { status: 200 });
}
