'use client';

import type InventoryOrderDetail from '@/interfaces/InventoryOrderDetail';
import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalInventoryOrderDiscount from '../components/modals/components-modal-inventory-order-discount';
import ComponentsModalInventoryOrderDetail from '../components/modals/components-modal-inventory-order-detail';
import type { InventoryOrder } from '@/app/(defaults)/inventory-orders/[id]/page';

type ComponentsTablesInventoryOrderDetailsProps = {
    order: InventoryOrder | null;
};

const ComponentsTablesInventoryOrderDetails = ({ order }: ComponentsTablesInventoryOrderDetailsProps) => {
    const details: InventoryOrderDetail[] = [
        { id: 'IOD001', inventory: 'White Threads', quantity: 12, price: 123123, total: 300000 },
        { id: 'IOD002', inventory: 'Black Threads', quantity: 12, price: 9090, total: 300000 },
        { id: 'IOD003', inventory: 'Red Threads', quantity: 12, price: 8080, total: 300000 },
    ];

    const [isDiscountModalOpen, setDiscountModalOpen] = useState<boolean>(false);
    const [isDetailModalOpen, setDetailModalOpen] = useState<boolean>(false);

    return (
        <div>
            <ComponentsModalInventoryOrderDiscount isOpen={isDiscountModalOpen} onToggleOpen={setDiscountModalOpen} order={order} />
            <ComponentsModalInventoryOrderDetail isOpen={isDetailModalOpen} onToggleOpen={setDetailModalOpen} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Order Details</h2>

                <div className="gap-x-4">
                    <button type="button" className="btn btn-primary" onClick={() => setDetailModalOpen(true)}>
                        <IconPlus className="mr-4" />
                        Add Item
                    </button>
                    <button type="button" className="btn btn-success" onClick={() => setDiscountModalOpen(true)}>
                        <IconPencil className="mr-4" />
                        Edit Taxes and Discount
                    </button>
                </div>
            </div>

            <div className="table-responsive mb-5">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>Inventory</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.map((detail) => {
                            return (
                                <tr key={detail.id}>
                                    <td>{detail.inventory}</td>
                                    <td>{detail.quantity}</td>
                                    <td>{detail.price}</td>
                                    <td>{detail.total}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => setDetailModalOpen(true)}>
                                                <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button type="button" onClick={() => setDetailModalOpen(true)}>
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

export default ComponentsTablesInventoryOrderDetails;
