'use client';

import IconX from '@/components/icon/icon-x';
import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import type { InventoryOrder } from '@/app/(defaults)/inventory-orders/[id]/page';
import type { InventoryOrderPayment } from '@/components/pages/components-pages-order-detail';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Select from 'react-select';
import type { SupplierPaymentMethod } from '@prisma/client';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconSave from '@/components/icon/icon-save';

const toast = withReactContent(Swal);

type ComponentsModalInventoryOrderPaymentProps = {
    payment: InventoryOrderPayment | null;
    order: InventoryOrder | null;
    methods: SupplierPaymentMethod[];
    isOpen: boolean;
    onToggleOpen: (state: boolean) => void;
    onUpdatePayments: (payment: InventoryOrderPayment) => void;
};

type InventoryOrderPaymentForm = {
    timestamp: string;
    total: string;
    methodId: string;
};

const ComponentsModalInventoryOrderPayment = ({ payment, order, methods, isOpen, onToggleOpen, onUpdatePayments }: ComponentsModalInventoryOrderPaymentProps) => {
    const [id, setId] = useState<number>(payment?.id || 0);
    const { register, handleSubmit, setValue, control } = useForm<InventoryOrderPaymentForm>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [methodOptions, setMethodOptions] = useState<{ value: string; label: string }[]>([]);

    const handleFormSubmit = async (data: InventoryOrderPaymentForm) => {
        try {
            setIsSubmitting(true);

            const method = id === 0 ? 'POST' : 'PUT';
            const body = { ...data, id, supplierPaymentMethodId: Number.parseInt(data.methodId), total: Number.parseInt(data.total), inventoryOrderId: order?.id };

            const response = await fetch('/api/payments', { method, body: JSON.stringify(body) });
            const payment: InventoryOrderPayment = await response.json();
            payment.timestamp = new Date(payment.timestamp);

            onUpdatePayments(payment);

            toast.fire({
                title: method === 'POST' ? 'Successfuly added new payment.' : 'Sucessfully edited payment',
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
            });
        } catch (error) {
            console.error(error);

            toast.fire({
                title: 'Failed.',
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
            });
        } finally {
            setIsSubmitting(false);
            onToggleOpen(false);
        }
    };

    useEffect(() => {
        setId(payment?.id || 0);
        setValue('total', payment?.total.toString() || '');
        setValue('timestamp', payment?.timestamp.toISOString() || new Date().toISOString());
        setValue('methodId', payment?.supplierPaymentMethodId.toString() || '');
    }, [payment, setValue]);

    useEffect(() => {
        setMethodOptions(methods.map((m) => ({ value: m.id.toString(), label: m.name })));
    }, [methods]);

    return (
        <div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" open={isOpen} onClose={() => onToggleOpen(false)}>
                    <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </TransitionChild>
                    <div id="fadein_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <DialogPanel className="panel animate__animated animate__fadeIn my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-6 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold">Add Inventory Order Payment</h5>
                                    <button onClick={() => onToggleOpen(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="px-5 pt-3 pb-6">
                                    <div className="mb-6">
                                        <div>
                                            <label htmlFor="supplier" className="text-sm">
                                                Supplier
                                            </label>
                                            <input
                                                type="text"
                                                className="form-input disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
                                                disabled
                                                defaultValue={order?.supplier.name}
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="invoice" className="text-sm">
                                                Invoice
                                            </label>
                                            <input
                                                type="text"
                                                className="form-input disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
                                                disabled
                                                defaultValue={order?.invoice}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                        <div>
                                            <label htmlFor="methodId" className="text-sm">
                                                Supplier Payment Method
                                            </label>
                                            <Controller
                                                name="methodId"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <Select
                                                        options={methodOptions}
                                                        value={methodOptions.find((opt) => opt.value === value)}
                                                        onChange={(val) => onChange(val?.value)}
                                                        className="text-sm"
                                                        placeholder="Choose Payment Method ..."
                                                        required
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="total" className="text-sm">
                                                Total Payment
                                            </label>
                                            <div className="flex">
                                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                    Rp
                                                </div>
                                                <input id="total" type="number" placeholder="0.00" className="form-input ltr:rounded-l-none rtl:rounded-r-none" {...register('total')} required />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="timestamp" className="text-sm">
                                                Date and Time
                                            </label>
                                            <Controller
                                                name="timestamp"
                                                control={control}
                                                render={({ field: { onChange, ...fieldProps } }) => (
                                                    <Flatpickr
                                                        {...fieldProps}
                                                        data-enable-time
                                                        options={{
                                                            enableTime: true,
                                                            dateFormat: 'Y-m-d H:i',
                                                        }}
                                                        className="form-input"
                                                        onChange={(dates, current) => onChange(current)}
                                                        required
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div className="!mt-6 flex items-center justify-end space-x-3">
                                            <button onClick={() => onToggleOpen(false)} type="button" className="btn btn-outline-danger">
                                                Discard
                                            </button>
                                            <button disabled={isSubmitting} type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                {isSubmitting ? (
                                                    <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle" />
                                                ) : (
                                                    <IconSave className="mr-3" />
                                                )}
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ComponentsModalInventoryOrderPayment;
