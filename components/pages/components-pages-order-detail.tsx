'use client';

import IconPencil from '@/components/icon/icon-pencil';
import type { InventoryOrder } from '@/app/(defaults)/inventory-orders/[id]/page';
import type { Prisma, Inventory, SupplierPaymentMethod } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import ComponentsModalInventoryOrder from '../components/modals/components-modal-inventory-order';
import ComponentsModalInventoryOrderDiscount from '../components/modals/components-modal-inventory-order-discount';
import ComponentsModalInventoryOrderDetail from '../components/modals/components-modal-inventory-order-detail';
import ComponentsModalInventoryOrderPayment from '../components/modals/components-modal-inventory-order-payment';
import ComponentsTablesInventoryOrderDetails from '../tables/components-tables-inventory-order-details';
import ComponentsTablesInventoryOrderPayments from '../tables/components-tables-inventory-order-payments';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import formatThousands from 'format-thousands';

const toast = withReactContent(Swal);

export type InventoryOrderDetail = Prisma.InventoryOrderDetailGetPayload<{ include: { inventory: true } }>;
export type InventoryOrderPayment = Prisma.InventoryOrderPaymentGetPayload<{ include: { method: true } }>;

type ComponentsPagesOrderDetailProps = {
    order: InventoryOrder;
    inventories: Inventory[];
    methods: SupplierPaymentMethod[];
};

const ComponentsPagesOrderDetail = ({ order, inventories, methods }: ComponentsPagesOrderDetailProps) => {
    const [details, setDetails] = useState<InventoryOrderDetail[]>(order?.details || []);
    const [detail, setDetail] = useState<InventoryOrderDetail | null>(null);
    const [payments, setPayments] = useState<InventoryOrderPayment[]>(order?.payments || []);
    const [payment, setPayment] = useState<InventoryOrderPayment | null>(null);
    const [totalPayment, setTotalPayment] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState<boolean>(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

    const handleOpenDetailModal = (detail: InventoryOrderDetail | null) => {
        setDetail(detail);
        setIsDetailModalOpen(true);
    };

    const handleOpenPaymentModal = (payment: InventoryOrderPayment | null) => {
        setPayment(payment);
        setIsPaymentModalOpen(true);
    };

    const handleUpdateDetails = (detail: InventoryOrderDetail) => {
        const index = details.findIndex((p) => p.id === detail.id);
        setDetail(detail);

        if (index < 0) {
            setDetails([...details, detail]);
            return;
        }

        setDetails([...details.slice(0, index), detail, ...details.slice(index + 1)]);
    };

    const handleUpdatePayments = (payment: InventoryOrderPayment) => {
        const index = payments.findIndex((p) => p.id === payment.id);
        setPayment(payment);

        if (index < 0) {
            setPayments([payment, ...payments]);
            return;
        }

        setPayments([...payments.slice(0, index), payment, ...payments.slice(index + 1)]);
    };

    const handleDeleteDetail = async ({ id }: InventoryOrderDetail) => {
        try {
            const body = { id };

            const result = await fetch(`/api/inventory-orders/${order?.id}/details`, { method: 'DELETE', body: JSON.stringify(body) });
            const response: { success: boolean; message: string } = await result.json();

            if (!response.success) throw new Error(response.message);

            setDetails(details.filter((d) => d.id !== id));
            toast.fire({
                title: 'Successfuly deleted Inventory Order Item.',
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
            });
        } catch (error) {
            toast.fire({
                title: `${error}`,
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 5000,
                showCloseButton: true,
            });
        }
    };

    const handleDeletePayment = async ({ id }: InventoryOrderPayment) => {
        try {
            const body = { id };

            const result = await fetch('/api/payments', { method: 'DELETE', body: JSON.stringify(body) });
            const response: { success: boolean; message: string } = await result.json();

            if (!response.success) throw new Error(response.message);

            setPayments(payments.filter((p) => p.id !== id));
            toast.fire({
                title: 'Successfuly deleted Inventory Order Payment.',
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
            });
        } catch (error) {
            toast.fire({
                title: `${error}`,
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 5000,
                showCloseButton: true,
            });
        }
    };

    useEffect(() => {
        setTotalPayment(payments.reduce((total, payment) => total + Number(payment.total), 0));
    }, [payments]);

    useEffect(() => {
        if (Number(order.total)) {
            setProgress(Math.round((totalPayment / Number(order.total)) * 100));
        }
    }, [totalPayment, order]);

    return (
        <section className="space-y-4">
            <ComponentsModalInventoryOrder isOpen={isDataModalOpen} onToggleOpen={setIsDataModalOpen} order={order} suppliers={[]} onUpdateOrders={() => {}} />

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
                            <button type="button" className="btn btn-outline-primary" onClick={() => setIsDataModalOpen(true)}>
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
                            <p className="text-lg font-bold text-gray-800">Rp {formatThousands(totalPayment, '.')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Payment Progress</p>
                            <div className="w-full h-5 bg-[#ebedf2] dark:bg-dark/40 rounded-full">
                                <div className="bg-primary h-5 rounded-full w-4/5 flex items-center justify-center text-white text-xs">{progress}%</div>
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
                        <ComponentsTablesInventoryOrderDetails
                            order={order}
                            details={details}
                            onToggleOpenDiscountModal={setIsDiscountModalOpen}
                            onToggleOpenDetailModal={handleOpenDetailModal}
                            onDeleteDetail={handleDeleteDetail}
                        />
                        <ComponentsModalInventoryOrderDiscount isOpen={isDiscountModalOpen} onToggleOpen={setIsDiscountModalOpen} order={order} />
                        <ComponentsModalInventoryOrderDetail
                            isOpen={isDetailModalOpen}
                            onToggleOpen={setIsDetailModalOpen}
                            order={order}
                            detail={detail}
                            inventories={inventories}
                            onUpdateDetails={handleUpdateDetails}
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <div className="w-full rounded-lg border border-white-light bg-white shadow-[4px_6px_10px_-3px_#edf0f2] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                    <div className="px-6 py-7">
                        <ComponentsTablesInventoryOrderPayments payments={payments} onToggleOpenModal={handleOpenPaymentModal} onDeletePayment={handleDeletePayment} />
                        <ComponentsModalInventoryOrderPayment
                            isOpen={isPaymentModalOpen}
                            onToggleOpen={setIsPaymentModalOpen}
                            payment={payment}
                            order={order}
                            methods={methods}
                            onUpdatePayments={handleUpdatePayments}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ComponentsPagesOrderDetail;
