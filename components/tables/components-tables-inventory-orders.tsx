'use client';

import type InventoryOrder from '@/interfaces/InventoryOrder';
import IconEye from '../icon/icon-eye';
import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalInventoryOrder from '../components/modals/components-modal-inventory-order';
import Link from 'next/link';

const ComponentsTablesInventoryOrders = () => {
    const orders: InventoryOrder[] = [
        { id: 'IO001', invoice: 'INV/3306', timestamp: '3102102', supplier: 'Nusantara Threads', total: 50000, status: 'Complete' },
        { id: 'IO002', invoice: 'INV/0912/10/24', timestamp: '3102102', supplier: 'Sumatra Embroinvoiceery Co', total: 3000, status: 'Incomplete' },
        { id: 'IO003', invoice: 'INV/3306', timestamp: '3102102', supplier: 'Nusantara Threads', total: 50000, status: 'Paid' },
    ];

    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    return (
        <div>
            <ComponentsModalInventoryOrder isOpen={isModalOpen} onToggleOpen={setModalOpen} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Inventory Orders</h2>

                <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
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
                                    <td>{order.timestamp}</td>
                                    <td>{order.supplier}</td>
                                    <td>{order.total}</td>
                                    <td>{order.status}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                        <Tippy content="View">
                                            <Link href={`/inventory-orders/${order.id}`}>
                                                <IconEye className="ltr:mr-2 rtl:ml-2" />
                                            </Link>
                                        </Tippy>
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => setModalOpen(true)}>
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
