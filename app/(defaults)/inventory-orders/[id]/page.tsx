import React from 'react';
import type { Metadata } from 'next';
import ComponentsTablesInventoryOrderDetails from '@/components/tables/components-tables-inventory-order-details';
import ComponentsTablesInventoryOrderPayments from '@/components/tables/components-tables-inventory-order-payments';
import IconArrowLeft from '@/components/icon/icon-arrow-left';
import IconPencil from '@/components/icon/icon-pencil';
import prisma from '@/prisma/client';
import type { Prisma } from '@prisma/client';
import Link from 'next/link';
import formatThousands from 'format-thousands';
import ComponentsPagesOrderDetail from '@/components/pages/components-pages-order-detail';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Inventory Order',
};

export type InventoryOrder = Prisma.InventoryOrderGetPayload<{ include: { supplier: true; details: { include: { inventory: true } }; payments: { include: { method: true } } } }>;

type InventoryOrderPageProps = {
    params: Promise<{ id: string }>;
};

const InventoryOrder = async ({ params }: InventoryOrderPageProps) => {
    const id = (await params).id;

    const order = await prisma.inventoryOrder.findFirst({
        where: { id: Number.parseInt(id) },
        include: { supplier: true, details: { include: { inventory: true } }, payments: { include: { method: true } } },
    });

    if (!order) redirect('/not-found');

    const inventories = await prisma.inventory.findMany({
        orderBy: { name: 'asc' },
    });

    const methods = await prisma.supplierPaymentMethod.findMany({
        orderBy: { name: 'asc' },
        where: { supplierId: order?.supplierId },
    });

    return (
        <div className="grid grid-cols-1 gap-4">
            <Link href="/inventory-orders" className="flex items-center text-primary font-bold">
                <IconArrowLeft className="mr-2 rotate-180" />
                Back to Inventory Orders
            </Link>

            <ComponentsPagesOrderDetail order={order} inventories={inventories} methods={methods} />
        </div>
    );
};

export default InventoryOrder;
