import React from 'react';
import type { Metadata } from 'next';
import ComponentsTablesInventoryOrderDetails from '@/components/tables/components-tables-inventory-order-details';
import ComponentsTablesInventoryOrderPayments from '@/components/tables/components-tables-inventory-order-payments';
import prisma from '@/prisma/client';

export const metadata: Metadata = {
    title: 'Inventory Order',
};

type InventoryOrderPageProps = {
    params: Promise<{ id: string }>;
};

const InventoryOrder = async ({ params }: InventoryOrderPageProps) => {
    const id = (await params).id;

    const order = await prisma.inventoryOrder.findFirst({
        where: { id: Number.parseInt(id) },
        include: { supplier: true, payments: { include: { method: true } } },
    });

    const methods = await prisma.supplierPaymentMethod.findMany({
        orderBy: { name: 'asc' },
        where: { supplierId: order?.supplierId },
    });

    return (
        <div className="grid grid-cols-1 gap-6">
            Invoice Number: {id}
            <div className="mb-5 flex items-center justify-center">
                <div className="w-full rounded-lg border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="px-6 py-7">
                        <ComponentsTablesInventoryOrderDetails />
                    </div>
                </div>
            </div>
            <div className="mb-5 flex items-center justify-center">
                <div className="w-full rounded-lg border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="px-6 py-7">
                        <ComponentsTablesInventoryOrderPayments order={order} methods={methods} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryOrder;
