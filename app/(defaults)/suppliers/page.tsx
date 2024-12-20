import React from 'react';
import type { Metadata } from 'next';
import ComponentsTablesSuppliers from '@/components/tables/components-tables-suppliers';

export const metadata: Metadata = {
    title: 'Suppliers',
};

const Suppliers = () => {
    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="mb-5 flex items-center justify-center">
                <div className="w-full rounded-lg border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="px-6 py-7">
                        <ComponentsTablesSuppliers />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Suppliers;
