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

            <div className="grid grid-cols-2 gap-4">
                <div className="w-full rounded-lg border border-white-light bg-white shadow-[4px_6px_10px_-3px_#edf0f2] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="h-full px-6 py-7 flex flex-col justify-between">
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Invoice Number</p>
                                <p className="text-lg font-bold text-gray-800">{order?.invoice}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Supplier</p>
                                <p className="font-bold text-gray-800">{order?.supplier.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Invoice Date</p>
                                <p className="font-bold text-gray-800">{order?.timestamp.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>

                        <div>
                            <button className="btn btn-outline-primary">
                                <IconPencil className="mr-2" />
                                Edit Detail
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full rounded-lg border border-white-light bg-white shadow-[4px_6px_10px_-3px_#edf0f2] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="px-6 py-7 space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Total Bill</p>
                            <p className="text-lg font-bold text-gray-800">Rp {formatThousands(order?.total || 0, '.')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Payment</p>
                            <p className="text-lg font-bold text-gray-800">
                                Rp{' '}
                                {formatThousands(
                                    order?.payments.reduce((total, payment) => total + Number(payment.total), 0),
                                    '.',
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Payment Progress</p>
                            <div className="w-full h-5 bg-[#ebedf2] dark:bg-dark/40 rounded-full">
                                <div className="bg-primary h-5 rounded-full w-4/5 flex items-center justify-center text-white text-xs">80%</div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Status</p>
                            <div>
                                {order?.status === 'INCOMPLETE' ? (
                                    <span className="badge bg-danger rounded-lg px-4 py-2 shadow-lg">INCOMPLETE</span>
                                ) : (
                                    <span className="badge bg-primary rounded-lg px-4 py-2 shadow-lg">COMPLETED</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <div className="w-full rounded-lg border border-white-light bg-white shadow-[4px_6px_10px_-3px_#edf0f2] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="px-6 py-7">
                        <ComponentsTablesInventoryOrderDetails order={order} inventories={inventories} />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <div className="w-full rounded-lg border border-white-light bg-white shadow-[4px_6px_10px_-3px_#edf0f2] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="px-6 py-7">
                        <ComponentsTablesInventoryOrderPayments order={order} methods={methods} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryOrder;
