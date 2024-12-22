import React from 'react';
import type { Metadata } from 'next';
import ComponentsTablesInventories from '@/components/tables/components-tables-inventories';
import prisma from '@/prisma/client';

export const metadata: Metadata = {
    title: 'Inventories',
};

const Inventories = async () => {
    const inventories = await prisma.inventory.findMany({
        orderBy: { id: 'asc' },
        include: { brand: true, type: true },
    });

    const types = await prisma.inventoryType.findMany({
        orderBy: { name: 'asc' },
    });

    const brands = await prisma.inventoryBrand.findMany({
        orderBy: { name: 'asc' },
    });

    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="mb-5 flex items-center justify-center">
                <div className="w-full rounded-lg border border-white-light bg-white shadow-[4px_6px_10px_-3px_#edf0f2] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="px-6 py-7">
                        <ComponentsTablesInventories inventories={inventories} types={types} brands={brands} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inventories;
