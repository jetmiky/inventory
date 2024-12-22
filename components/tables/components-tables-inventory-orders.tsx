'use client';

import IconEye from '../icon/icon-eye';
import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalInventoryOrder from '../components/modals/components-modal-inventory-order';
import Link from 'next/link';
import type { Prisma, Supplier } from '@prisma/client';

export type InventoryOrder = Prisma.InventoryOrderGetPayload<{ include: { supplier: true } }>;

type ComponentsTablesInventoryOrdersProps = {
    orders: InventoryOrder[];
    suppliers: Supplier[];
};

const ComponentsTablesInventoryOrders = ({ orders, suppliers }: ComponentsTablesInventoryOrdersProps) => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [order, setOrder] = useState<InventoryOrder | null>(null);

    const handleOpenModal = (order: InventoryOrder | null) => {
        setOrder(order);
        setModalOpen(true);
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
                            <th>Date and Time</th>
                            <th>Supplier</th>
                            <th>Total Price</th>
                            <th>Payment Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            return (
                                <tr key={order.id}>
                                    <td>{order.invoice}</td>
                                    <td>{order.timestamp.toString()}</td>
                                    <td>{order.supplier.name}</td>
                                    <td>{order.total}</td>
                                    <td>{order.status}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                        <Tippy content="View">
                                            <Link href={`/inventory-orders/${order.id}`}>
                                                <IconEye className="ltr:mr-2 rtl:ml-2" />
                                            </Link>
                                        </Tippy>
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => handleOpenModal(order)}>
                                                <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button type="button" onClick={() => setModalOpen(true)}>
                                                <IconTrashLines className="m-auto" />
                                            </button>
                                        </Tippy>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComponentsTablesInventoryOrders;
