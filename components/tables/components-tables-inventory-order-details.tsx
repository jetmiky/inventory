'use client';

import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalInventoryOrderDiscount from '../components/modals/components-modal-inventory-order-discount';
import ComponentsModalInventoryOrderDetail from '../components/modals/components-modal-inventory-order-detail';
import type { InventoryOrder } from '@/app/(defaults)/inventory-orders/[id]/page';
import type { Inventory, Prisma } from '@prisma/client';
import formatThousands from 'format-thousands';

export type InventoryOrderDetail = Prisma.InventoryOrderDetailGetPayload<{ include: { inventory: true } }>;

type ComponentsTablesInventoryOrderDetailsProps = {
    order: InventoryOrder | null;
    inventories: Inventory[];
};

const ComponentsTablesInventoryOrderDetails = ({ order, inventories }: ComponentsTablesInventoryOrderDetailsProps) => {
    const [isDiscountModalOpen, setDiscountModalOpen] = useState<boolean>(false);
    const [isDetailModalOpen, setDetailModalOpen] = useState<boolean>(false);
    const [detail, setDetail] = useState<InventoryOrderDetail | null>(null);

    const handleOpenDetailModal = (detail: InventoryOrderDetail | null) => {
        setDetail(detail);
        setDetailModalOpen(true);
    };

    const handleUpdateDetails = (detail: InventoryOrderDetail) => {
        const index = order?.details.findIndex((d) => d.id === detail.id) as number;
        setDetail(detail);

        if (index < 0) {
            order?.details.push(detail);
            return;
        }

        if (order?.details) order.details[index] = detail;
    };

    return (
        <div>
            <ComponentsModalInventoryOrderDiscount isOpen={isDiscountModalOpen} onToggleOpen={setDiscountModalOpen} order={order} />
            <ComponentsModalInventoryOrderDetail
                isOpen={isDetailModalOpen}
                onToggleOpen={setDetailModalOpen}
                order={order}
                detail={detail}
                inventories={inventories}
                onUpdateDetails={handleUpdateDetails}
            />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Order Details</h2>

                <div className="flex gap-x-2">
                    <button type="button" className="btn btn-success" onClick={() => setDiscountModalOpen(true)}>
                        <IconPencil className="mr-4" />
                        Edit Taxes and Discount
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => handleOpenDetailModal(null)}>
                        <IconPlus className="mr-4" />
                        Add Item
                    </button>
                </div>
            </div>

            <div className="table-responsive mb-5">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>Inventory</th>
                            <th>Quantity</th>
                            <th colSpan={2}>Price</th>
                            <th colSpan={2}>Total</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order?.details.length ? (
                            <>
                                {order?.details?.map((detail) => {
                                    return (
                                        <tr key={detail.id}>
                                            <td>{detail.inventory.name}</td>
                                            <td>{detail.quantity}</td>
                                            <td className="max-w-1 whitespace-nowrap">Rp</td>
                                            <td className="text-right">{formatThousands(detail.price, '.')}</td>
                                            <td className="max-w-1 whitespace-nowrap">Rp</td>
                                            <td className="text-right">{formatThousands(detail.quantity * Number(detail.price), '.')}</td>
                                            <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                                <Tippy content="Edit">
                                                    <button type="button" onClick={() => handleOpenDetailModal(detail)}>
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
                                <tr className="bg-gray-100 font-bold">
                                    <td colSpan={4} className="text-right">
                                        Subtotal
                                    </td>
                                    <td className="max-w-1 whitespace-nowrap">Rp</td>
                                    <td className="text-right">{0}</td>
                                    <td></td>
                                </tr>
                                <tr className="bg-gray-50 font-bold">
                                    <td colSpan={4} className="text-right">
                                        Tax
                                    </td>
                                    <td className="max-w-1 whitespace-nowrap">Rp</td>
                                    <td className="text-right">{formatThousands(order.tax, '.')}</td>
                                    <td></td>
                                </tr>
                                <tr className="bg-gray-50 font-bold">
                                    <td colSpan={4} className="text-right">
                                        Discount
                                    </td>
                                    <td className="max-w-1 whitespace-nowrap">Rp</td>
                                    <td className="text-right">{formatThousands(order.discount, '.')}</td>
                                    <td></td>
                                </tr>
                                <tr className="bg-gray-100 font-bold">
                                    <td colSpan={4} className="text-right">
                                        Total
                                    </td>
                                    <td className="max-w-1 whitespace-nowrap">Rp</td>
                                    <td className="text-right">{formatThousands(order.total, '.')}</td>
                                    <td></td>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <td colSpan={5}>No order item recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComponentsTablesInventoryOrderDetails;
