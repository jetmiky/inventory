import prisma from '@/prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createInventorySchema = z.object({
    name: z.string().min(1).max(191),
    description: z.string().min(1).max(191),
    minimumStock: z.number().min(1),
    brandId: z.number().min(1),
    typeId: z.number().min(1),
});

const updateInventorySchema = z.object({
    id: z.number().min(1),
    name: z.string().min(1).max(191),
    description: z.string().min(1).max(191),
    minimumStock: z.number().min(1),
    brandId: z.number().min(1),
    typeId: z.number().min(1),
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createInventorySchema.safeParse(body);

    if (!validation.success) {
        console.error(validation.error.errors);
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const inventory = await prisma.inventory.create({
        data: {
            name: validation.data.name,
            description: validation.data.description,
            minimumStock: validation.data.minimumStock,
            brandId: validation.data.brandId,
            typeId: validation.data.typeId,
            stock: 0,
        },
        include: { brand: true, type: true },
    });

    return NextResponse.json(inventory, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const validation = updateInventorySchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const inventory = await prisma.inventory.update({
        data: {
            name: validation.data.name,
            description: validation.data.description,
            minimumStock: validation.data.minimumStock,
            brandId: validation.data.brandId,
            typeId: validation.data.typeId,
        },
        include: { brand: true, type: true },
        where: { id: validation.data.id },
    });

    return NextResponse.json(inventory, { status: 200 });
}