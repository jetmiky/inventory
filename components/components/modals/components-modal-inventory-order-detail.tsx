'use client';

import IconX from '@/components/icon/icon-x';
import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import type { InventoryOrderDetail } from '@/components/tables/components-tables-inventory-order-details';
import type { InventoryOrder } from '@/app/(defaults)/inventory-orders/[id]/page';
import type { Inventory } from '@prisma/client';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Select from 'react-select';

const toast = withReactContent(Swal);

type ComponentsModalInventoryOrderDetailProps = {
    detail: InventoryOrderDetail | null;
    order: InventoryOrder | null;
    inventories: Inventory[];
    isOpen: boolean;
    onToggleOpen: (state: boolean) => void;
    onUpdateDetails: (detail: InventoryOrderDetail) => void;
};

type InventoryOrderDetailForm = {
    quantity: string;
    price: string;
    inventoryId: string;
};

const ComponentsModalInventoryOrderDetail = ({ detail, order, inventories, isOpen, onToggleOpen, onUpdateDetails }: ComponentsModalInventoryOrderDetailProps) => {
    const [id, setId] = useState<number>(order?.id || 0);
    const { register, handleSubmit, setValue, control } = useForm<InventoryOrderDetailForm>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [inventoryOptions, setInventoryOptions] = useState<{ value: string; label: string }[]>([]);

    const handleFormSubmit = async (data: InventoryOrderDetailForm) => {
        try {
            setIsSubmitting(true);

            const method = id === 0 ? 'POST' : 'PUT';
            const body = { id, quantity: Number.parseInt(data.quantity), price: Number.parseInt(data.price), inventoryId: Number.parseInt(data.inventoryId) };

            const response = await fetch(`/api/inventory-orders/${order?.id}/details`, { method, body: JSON.stringify(body) });
            const detail: InventoryOrderDetail = await response.json();
            onUpdateDetails(detail);

            toast.fire({
                title: method === 'POST' ? 'Successfuly added new inventory order item.' : 'Sucessfully edited inventory order item',
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
        setId(detail?.id || 0);
        setValue('quantity', detail?.quantity.toString() || '');
        setValue('price', detail?.price.toString() || '');
        setValue('inventoryId', detail?.inventoryId.toString() || '');
    }, [detail, setValue]);

    useEffect(() => {
        setInventoryOptions(inventories.map((i) => ({ value: i.id.toString(), label: i.name })));
    }, [inventories]);

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
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold">Add Inventory Order Detail</h5>
                                    <button onClick={() => onToggleOpen(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                                        <div>
                                            <label htmlFor="inventoryId">Inventory Item</label>
                                            <Controller
                                                name="inventoryId"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <Select options={inventoryOptions} value={inventoryOptions.find((opt) => opt.value === value)} onChange={(val) => onChange(val?.value)} />
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="quantity">Quantity</label>
                                            <input id="quantity" type="number" placeholder="Quantity" className="form-input" {...register('quantity')} />
                                        </div>
                                        <div>
                                            <label htmlFor="price">Price per Item</label>
                                            <input id="price" type="number" placeholder="0.00" className="form-input" {...register('price')} />
                                        </div>

                                        <div className="mt-8 flex items-center justify-end">
                                            <button onClick={() => onToggleOpen(false)} type="button" className="btn btn-outline-danger">
                                                Discard
                                            </button>
                                            <button disabled={isSubmitting} type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                {isSubmitting && (
                                                    <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle" />
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

export default ComponentsModalInventoryOrderDetail;
