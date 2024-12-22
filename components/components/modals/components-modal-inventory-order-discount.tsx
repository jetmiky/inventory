'use client';

import IconX from '@/components/icon/icon-x';
import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import type { InventoryOrder } from '@/app/(defaults)/inventory-orders/[id]/page';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import IconSave from '@/components/icon/icon-save';

const toast = withReactContent(Swal);

type ComponentsModalInventoryOrderDiscountProps = {
    order: InventoryOrder | null;
    isOpen: boolean;
    onToggleOpen: (state: boolean) => void;
};

type InventoryOrderDiscountForm = {
    tax: string;
    discount: string;
};

const ComponentsModalInventoryOrderDiscount = ({ order, isOpen, onToggleOpen }: ComponentsModalInventoryOrderDiscountProps) => {
    const { register, handleSubmit, setValue } = useForm<InventoryOrderDiscountForm>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleFormSubmit = async (data: InventoryOrderDiscountForm) => {
        try {
            setIsSubmitting(true);

            const body = { id: order?.id, tax: Number.parseInt(data.tax), discount: Number.parseInt(data.discount) };

            const response = await fetch('/api/inventory-orders', { method: 'PUT', body: JSON.stringify(body) });
            const updatedOrder: InventoryOrder = await response.json();
            console.log(updatedOrder);

            toast.fire({
                title: 'Successfuly edited tax and discount.',
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
        setValue('tax', order?.tax.toString() || '');
        setValue('discount', order?.discount.toString() || '');
    }, [order, setValue]);

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
                                    <h5 className="text-lg font-bold">Edit Taxes and Discount</h5>
                                    <button onClick={() => onToggleOpen(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="px-5 pt-3 pb-6">
                                    <div className="mb-6">
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

                                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                                        <div>
                                            <label htmlFor="tax" className="text-sm">
                                                Total Taxes
                                            </label>
                                            <div className="flex">
                                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                    Rp
                                                </div>
                                                <input id="tax" type="number" placeholder="0.00" className="form-input ltr:rounded-l-none rtl:rounded-r-none" {...register('tax')} required />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="discount" className="text-sm">
                                                Total Discounts
                                            </label>
                                            <div className="flex">
                                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                    Rp
                                                </div>
                                                <input id="discount" type="number" placeholder="0.00" className="form-input ltr:rounded-l-none rtl:rounded-r-none" {...register('discount')} required />
                                            </div>
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

export default ComponentsModalInventoryOrderDiscount;
