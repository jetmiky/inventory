'use client';

import IconX from '@/components/icon/icon-x';
import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import type { InventoryOrder } from '@/components/tables/components-tables-inventory-orders';
import type { Supplier } from '@prisma/client';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconSave from '@/components/icon/icon-save';

const toast = withReactContent(Swal);

type ComponentsModalInventoryOrderProps = {
    order: InventoryOrder | null;
    suppliers: Supplier[];
    isOpen: boolean;
    onToggleOpen: (state: boolean) => void;
    onUpdateOrders: (order: InventoryOrder) => void;
};

type InventoryOrderForm = {
    invoice: string;
    timestamp: string;
    supplierId: string;
};

const ComponentsModalInventoryOrder = ({ order, suppliers, isOpen, onToggleOpen, onUpdateOrders }: ComponentsModalInventoryOrderProps) => {
    const [id, setId] = useState<number>(order?.id || 0);
    const { register, handleSubmit, setValue, control } = useForm<InventoryOrderForm>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [supplierOptions, setSupplierOptions] = useState<{ value: string; label: string }[]>([]);

    const handleFormSubmit = async (data: InventoryOrderForm) => {
        try {
            setIsSubmitting(true);

            const method = id === 0 ? 'POST' : 'PUT';
            const body = { id, ...data, supplierId: Number.parseInt(data.supplierId) };

            const response = await fetch('/api/inventory-orders', { method, body: JSON.stringify(body, (key, value) => (typeof value === 'bigint' ? value.toString() : value)) });
            const order: InventoryOrder = await response.json();
            order.timestamp = new Date(order.timestamp);

            onUpdateOrders(order);

            toast.fire({
                title: method === 'POST' ? 'Successfuly added record inventory usage.' : 'Sucessfully edited inventory usage',
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
        setId(order?.id || 0);
        setValue('invoice', order?.invoice || '');
        setValue('timestamp', order?.timestamp.toISOString() || new Date().toISOString());
        setValue('supplierId', order?.supplierId.toString() || '');
    }, [order, setValue]);

    useEffect(() => {
        setSupplierOptions(suppliers.map((supplier) => ({ value: supplier.id.toString(), label: supplier.name })));
    }, [suppliers]);

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
                                    <h5 className="text-lg font-bold">Add Inventory Order</h5>
                                    <button onClick={() => onToggleOpen(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="px-5 pt-3 pb-6">
                                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                        <div>
                                            <label htmlFor="supplier" className="text-sm">
                                                Supplier
                                            </label>
                                            <Controller
                                                name="supplierId"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <Select
                                                        options={supplierOptions}
                                                        value={supplierOptions.find((opt) => opt.value === value)}
                                                        onChange={(val) => onChange(val?.value)}
                                                        className="text-sm"
                                                        placeholder="Choose supplier ..."
                                                        required
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="invoice" className="text-sm">
                                                Invoice Number
                                            </label>
                                            <input id="invoice" type="text" placeholder="Invoice Number" className="form-input" {...register('invoice')} required />
                                        </div>
                                        <div>
                                            <label htmlFor="timestamp" className="text-sm">
                                                Invoice Date
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

export default ComponentsModalInventoryOrder;
