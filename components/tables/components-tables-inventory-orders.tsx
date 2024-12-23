'use client';

import IconEye from '../icon/icon-eye';
import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalInventoryOrder from '../components/modals/components-modal-inventory-order';
import type { Prisma, Supplier } from '@prisma/client';
import { useRouter } from 'next/navigation';
import formatThousands from 'format-thousands';

export type InventoryOrder = Prisma.InventoryOrderGetPayload<{ include: { supplier: true } }>;

type ComponentsTablesInventoryOrdersProps = {
    orders: InventoryOrder[];
    suppliers: Supplier[];
};

const ComponentsTablesInventoryOrders = ({ orders, suppliers }: ComponentsTablesInventoryOrdersProps) => {
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [order, setOrder] = useState<InventoryOrder | null>(null);

    const handleOpenModal = (order: InventoryOrder | null) => {
        setOrder(order);
        setModalOpen(true);
    };

    const handleViewOrder = (order: InventoryOrder) => {
        router.push(`/inventory-orders/${order.id}`);
    };

    const handleUpdateOrders = (order: InventoryOrder) => {
        const index = orders.findIndex((t) => t.id === order.id);
        setOrder(order);

        if (index < 0) {
            orders.push(order);
            return;
        }

        orders[index] = order;
    };

    return (
        <div>
            <ComponentsModalInventoryOrder isOpen={isModalOpen} onToggleOpen={setModalOpen} order={order} suppliers={suppliers} onUpdateOrders={handleUpdateOrders} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Inventory Orders</h2>

                <button type="button" className="btn btn-primary" onClick={() => handleOpenModal(null)}>
                    <IconPlus className="mr-4" />
                    Add Inventory Order
                </button>
            </div>

            <div className="table-responsive mb-5">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>Invoice</th>
                            <th>Invoice Date</th>
                            <th>Supplier</th>
                            <th colSpan={2}>Total Price</th>
                            <th>Payment Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length ? (
                            orders.map((order) => {
                                return (
                                    <tr key={order.id}>
                                        <td>{order.invoice}</td>
                                        <td>{order.timestamp.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                        <td>{order.supplier.name}</td>
                                        <td className="max-w-1 whitespace-nowrap">Rp</td>
                                        <td className="text-right">{formatThousands(order.total || 0, '.')}</td>
                                        <td>
                                            {order.status === 'INCOMPLETE' ? (
                                                <span className="badge bg-danger rounded-lg px-4 py-1 shadow-lg">INCOMPLETE</span>
                                            ) : (
                                                <span className="badge bg-primary rounded-lg px-4 py-1 shadow-lg">COMPLETED</span>
                                            )}
                                        </td>
                                        <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                            <Tippy content="View">
                                                <button type="button" onClick={() => handleViewOrder(order)}>
                                                    <IconEye className="ltr:mr-2 rtl:ml-2" />
                                                </button>
                                            </Tippy>
                                            <Tippy content="Edit">
                                                <button type="button" onClick={() => handleOpenModal(order)}>
                                                    <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                                </button>
                                            </Tippy>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6}>No inventory order recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComponentsTablesInventoryOrders;
