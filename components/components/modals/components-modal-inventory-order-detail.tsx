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
import IconSave from '@/components/icon/icon-save';

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
    const [total, setTotal] = useState<number>(0);
    const { register, handleSubmit, setValue, control, watch } = useForm<InventoryOrderDetailForm>();
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
        watch((value) => {
            if (value.quantity && value.price) {
                setTotal(Number.parseInt(value.quantity) * Number.parseInt(value.price));
            }
        });
    }, [watch]);

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
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-6 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold">Add Inventory Order Detail</h5>
                                    <button onClick={() => onToggleOpen(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="px-5 pt-3 pb-6">
                                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                        <div>
                                            <label htmlFor="inventoryId" className="text-sm">
                                                Inventory Item
                                            </label>
                                            <Controller
                                                name="inventoryId"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <Select
                                                        options={inventoryOptions}
                                                        value={inventoryOptions.find((opt) => opt.value === value)}
                                                        onChange={(val) => onChange(val?.value)}
                                                        className="text-sm"
                                                        placeholder="Choose Inventory ..."
                                                        required
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="quantity" className="text-sm">
                                                Quantity
                                            </label>
                                            <input id="quantity" type="number" placeholder="10" className="form-input" {...register('quantity')} required />
                                        </div>
                                        <div>
                                            <label htmlFor="price" className="text-sm">
                                                Price per Item
                                            </label>
                                            <div className="flex">
                                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                    Rp
                                                </div>
                                                <input id="price" type="number" placeholder="0.00" className="form-input ltr:rounded-l-none rtl:rounded-r-none" {...register('price')} required />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="total" className="text-sm">
                                                Total Price
                                            </label>
                                            <div className="flex">
                                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                                    Rp
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-input rounded-none rounded-r-md disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] cursor-not-allowed"
                                                    disabled
                                                    value={total}
                                                    readOnly
                                                />
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

export default ComponentsModalInventoryOrderDetail;
