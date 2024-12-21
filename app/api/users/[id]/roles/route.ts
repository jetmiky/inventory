import prisma from '@/prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createUserRoleSchema = z.object({
    roleId: z.number().min(1),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const userId = (await params).id;
    const body = await request.json();
    const validation = createUserRoleSchema.safeParse(body);

    if (!validation.success) {
        console.error(validation.error.errors);
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    await prisma.user.update({
        data: {
            roles: {
                connect: { id: validation.data.roleId },
            },
        },
        where: { id: Number.parseInt(userId) },
    });

    const role = await prisma.role.findFirst({
        where: { id: validation.data.roleId },
    });

    return NextResponse.json(role, { status: 201 });
}
