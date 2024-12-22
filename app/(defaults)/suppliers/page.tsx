import React from 'react';
import type { Metadata } from 'next';
import ComponentsTablesSuppliers from '@/components/tables/components-tables-suppliers';
import prisma from '@/prisma/client';

export const metadata: Metadata = {
    title: 'Suppliers',
};

const Suppliers = async () => {
    const suppliers = await prisma.supplier.findMany({
        orderBy: { id: 'asc' },
        include: { methods: true },
    });

    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="mb-5 flex items-center justify-center">
                <div className="w-full rounded-lg border border-white-light bg-white shadow-[4px_6px_10px_-3px_#edf0f2] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="px-6 py-7">
                        <ComponentsTablesSuppliers suppliers={suppliers} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Suppliers;
