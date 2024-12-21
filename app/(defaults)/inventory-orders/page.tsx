import React from 'react';
import type { Metadata } from 'next';
import ComponentsTablesInventoryOrders from '@/components/tables/components-tables-inventory-orders';
import prisma from '@/prisma/client';

export const metadata: Metadata = {
    title: 'Inventory Orders',
};

const InventoryOrders = async () => {
    const orders = await prisma.inventoryOrder.findMany({
        orderBy: { timestamp: 'desc' },
        include: { supplier: true },
    });

    const suppliers = await prisma.supplier.findMany({
        orderBy: { name: 'asc' },
    });

    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="mb-5 flex items-center justify-center">
                <div className="w-full rounded-lg border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="px-6 py-7">
                        <ComponentsTablesInventoryOrders orders={orders} suppliers={suppliers} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryOrders;
