'use client';

import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React from 'react';
import type { InventoryOrderPayment } from '@/components/pages/components-pages-order-detail';
import formatThousands from 'format-thousands';

type ComponentsTablesInventoryOrderPaymentsProps = {
    payments: InventoryOrderPayment[];
    onToggleOpenModal: (payment: InventoryOrderPayment | null) => void;
    onDeletePayment: (payment: InventoryOrderPayment) => void;
};

const ComponentsTablesInventoryOrderPayments = ({ payments, onToggleOpenModal, onDeletePayment }: ComponentsTablesInventoryOrderPaymentsProps) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Order Payments</h2>

                <button type="button" className="btn btn-primary" onClick={() => onToggleOpenModal(null)}>
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
                            <th colSpan={2}>Total Payment</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length ? (
                            <>
                                {payments.map((payment) => {
                                    return (
                                        <tr key={payment.id}>
                                            <td className="max-w-1 whitespace-nowrap">{payment.timestamp.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                            <td>{payment.method.name}</td>
                                            <td className="max-w-1 whitespace-nowrap">Rp</td>
                                            <td className="text-right">{formatThousands(payment.total, '.')}</td>
                                            <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                                <Tippy content="Edit">
                                                    <button type="button" onClick={() => onToggleOpenModal(payment)}>
                                                        <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                                    </button>
                                                </Tippy>
                                                <Tippy content="Delete">
                                                    <button type="button" onClick={() => onDeletePayment(payment)}>
                                                        <IconTrashLines className="m-auto" />
                                                    </button>
                                                </Tippy>
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr className="bg-gray-100 font-bold">
                                    <td colSpan={2} className="text-right">
                                        Total Payment
                                    </td>
                                    <td className="max-w-1 whitespace-nowrap">Rp</td>
                                    <td className="text-right">
                                        {formatThousands(
                                            payments.reduce((total, payment) => total + Number(payment.total), 0),
                                            '.',
                                        )}
                                    </td>
                                    <td />
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <td colSpan={4}>No order payment recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComponentsTablesInventoryOrderPayments;
