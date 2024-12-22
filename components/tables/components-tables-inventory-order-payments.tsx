'use client';

import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalInventoryOrderPayment from '../components/modals/components-modal-inventory-order-payment';
import type { Prisma, SupplierPaymentMethod } from '@prisma/client';
import type { InventoryOrder } from '@/app/(defaults)/inventory-orders/[id]/page';

export type InventoryOrderPayment = Prisma.InventoryOrderPaymentGetPayload<{ include: { method: true } }>;

type ComponentsTablesInventoryOrderPaymentsProps = {
    order: InventoryOrder | null;
    methods: SupplierPaymentMethod[];
};

const ComponentsTablesInventoryOrderPayments = ({ order, methods }: ComponentsTablesInventoryOrderPaymentsProps) => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [payment, setPayment] = useState<InventoryOrderPayment | null>(null);

    const handleOpenModal = (payment: InventoryOrderPayment | null) => {
        setPayment(payment);
        setModalOpen(true);
    };

    const handleUpdatePayments = (payment: InventoryOrderPayment) => {
        const index = order?.payments.findIndex((t) => t.id === payment.id) as number;
        setPayment(payment);

        if (index < 0) {
            order?.payments.push(payment);
            return;
        }

        if (order?.payments) order.payments[index] = payment;
    };

    return (
        <div>
            <ComponentsModalInventoryOrderPayment isOpen={isModalOpen} onToggleOpen={setModalOpen} payment={payment} order={order} methods={methods} onUpdatePayments={handleUpdatePayments} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Order Payments</h2>

                <button type="button" className="btn btn-primary" onClick={() => handleOpenModal(null)}>
                    <IconPlus className="mr-4" />
                    Add Payment
                </button>
            </div>

            <div className="table-responsive mb-5">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>Date and Time</th>
                            <th>Payment Method</th>
                            <th>Total</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order?.payments?.map((payment) => {
                            return (
                                <tr key={payment.id}>
                                    <td>{payment.timestamp.toString()}</td>
                                    <td>{payment.method.name}</td>
                                    <td>{payment.total}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => handleOpenModal(payment)}>
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

export default ComponentsTablesInventoryOrderPayments;
