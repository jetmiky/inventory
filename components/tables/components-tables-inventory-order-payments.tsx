'use client';

import type InventoryOrderPayment from '@/interfaces/InventoryOrderPayment';
import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalInventoryOrderPayment from '../components/modals/components-modal-inventory-order-payment';

const ComponentsTablesInventoryOrderPayments = () => {
    const payments: InventoryOrderPayment[] = [
        { id: 'IOP001', timestamp: '2012123', method: 'Transfer BCA', total: 300000 },
        { id: 'IOP002', timestamp: '2012123', method: 'Transfer BRI', total: 342000 },
        { id: 'IOP003', timestamp: '2012123', method: 'Transfer Mandiri', total: 20000 },
    ];

    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    return (
        <div>
            <ComponentsModalInventoryOrderPayment isOpen={isModalOpen} onToggleOpen={setModalOpen} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Order Payments</h2>

                <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
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
                        {payments.map((payment) => {
                            return (
                                <tr key={payment.id}>
                                    <td>{payment.timestamp}</td>
                                    <td>{payment.method}</td>
                                    <td>{payment.total}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
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

export default ComponentsTablesInventoryOrderPayments;
