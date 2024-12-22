import prisma from '@/prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createTypeSchema = z.object({
    name: z.string().min(1).max(191),
    description: z.string().min(1).max(191),
});

const updateTypeSchema = z.object({
    id: z.number().min(1),
    name: z.string().min(1).max(191),
    description: z.string().min(1).max(191),
});

const deleteTypeSchema = z.object({
    id: z.number().min(1),
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createTypeSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const type = await prisma.inventoryType.create({
        data: {
            name: validation.data.name,
            description: validation.data.description,
        },
    });

    return NextResponse.json(type, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const validation = updateTypeSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const type = await prisma.inventoryType.update({
        data: {
            name: validation.data.name,
            description: validation.data.description,
        },
        where: { id: validation.data.id },
    });

    return NextResponse.json(type, { status: 200 });
}

export async function DELETE(request: NextRequest) {
    const body = await request.json();
    const validation = deleteTypeSchema.safeParse(body);

    if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

    const type = await prisma.inventoryType.findFirst({
        where: { id: validation.data.id },
        include: { inventories: true },
    });

    if (type?.inventories?.length) {
        return NextResponse.json({ message: `Cannot delete inventory type, as already mapped to ${type?.inventories?.length} inventory.`, success: false }, { status: 409 });
    }

    await prisma.inventoryType.delete({ where: { id: validation.data.id } });

    return NextResponse.json({ message: 'Inventory type deleted successfully', success: true }, { status: 200 });
}
