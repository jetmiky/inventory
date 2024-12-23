'use client';

import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React from 'react';
import type { InventoryOrderDetail } from '@/components/pages/components-pages-order-detail';
import formatThousands from 'format-thousands';

type ComponentsTablesInventoryOrderDetailsProps = {
    details: InventoryOrderDetail[];
    onToggleOpenDiscountModal: (state: boolean) => void;
    onToggleOpenDetailModal: (detail: InventoryOrderDetail | null) => void;
    onDeleteDetail: (detail: InventoryOrderDetail) => void;
    tax: number;
    discount: number;
    total: number;
};

const ComponentsTablesInventoryOrderDetails = ({ details, tax, discount, total, onToggleOpenDiscountModal, onToggleOpenDetailModal, onDeleteDetail }: ComponentsTablesInventoryOrderDetailsProps) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Order Details</h2>

                <div className="flex gap-x-2">
                    <button type="button" className="btn btn-success" onClick={() => onToggleOpenDiscountModal(true)}>
                        <IconPencil className="mr-4" />
                        Edit Taxes and Discount
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => onToggleOpenDetailModal(null)}>
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
                        {details.length ? (
                            details.map((detail) => {
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
                                                <button type="button" onClick={() => onToggleOpenDetailModal(detail)}>
                                                    <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                                </button>
                                            </Tippy>
                                            <Tippy content="Delete">
                                                <button type="button" onClick={() => onDeleteDetail(detail)}>
                                                    <IconTrashLines className="m-auto" />
                                                </button>
                                            </Tippy>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5}>No order item recorded yet.</td>
                            </tr>
                        )}

                        <tr className="bg-gray-100 font-bold">
                            <td colSpan={4} className="text-right">
                                Subtotal
                            </td>
                            <td className="max-w-1 whitespace-nowrap">Rp</td>
                            <td className="text-right">
                                {formatThousands(
                                    details.reduce((total, detail) => total + detail.quantity * Number(detail.price), 0),
                                    '.',
                                )}
                            </td>
                            <td />
                        </tr>
                        <tr className="bg-gray-50 font-bold">
                            <td colSpan={4} className="text-right">
                                Tax (+)
                            </td>
                            <td className="max-w-1 whitespace-nowrap">Rp</td>
                            <td className="text-right">{formatThousands(tax || 0, '.')}</td>
                            <td />
                        </tr>
                        <tr className="bg-gray-50 font-bold">
                            <td colSpan={4} className="text-right">
                                Discount (-)
                            </td>
                            <td className="max-w-1 whitespace-nowrap">Rp</td>
                            <td className="text-right">{formatThousands(discount || 0, '.')}</td>
                            <td />
                        </tr>
                        <tr className="bg-gray-100 font-bold">
                            <td colSpan={4} className="text-right">
                                Total
                            </td>
                            <td className="max-w-1 whitespace-nowrap">Rp</td>
                            <td className="text-right">{formatThousands(total || 0, '.')}</td>
                            <td />
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComponentsTablesInventoryOrderDetails;
