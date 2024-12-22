'use client';
import IconX from '@/components/icon/icon-x';
import type { InventoryUsage } from '@/components/tables/components-tables-inventory-usages';
import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import type { Inventory, User } from '@prisma/client';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconSave from '@/components/icon/icon-save';

const toast = withReactContent(Swal);

type ComponentsModalInventoryUsageProps = {
    usage: InventoryUsage | null;
    inventories: Inventory[];
    users: User[];
    isOpen: boolean;
    onToggleOpen: (state: boolean) => void;
    onUpdateUsages: (usage: InventoryUsage) => void;
};

type InventoryUsageForm = {
    quantity: string;
    timestamp: string;
    inventoryId: string;
    userId: string;
};

const ComponentsModalInventoryUsage = ({ usage, isOpen, onToggleOpen, onUpdateUsages, inventories, users }: ComponentsModalInventoryUsageProps) => {
    const [id, setId] = useState<number>(usage?.id || 0);
    const { register, handleSubmit, setValue, control } = useForm<InventoryUsageForm>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [inventoryOptions, setInventoryOptions] = useState<{ value: string; label: string }[]>([]);
    const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);

    const handleFormSubmit = async (data: InventoryUsageForm) => {
        try {
            setIsSubmitting(true);

            const method = id === 0 ? 'POST' : 'PUT';
            const body = { id, ...data, inventoryId: Number.parseInt(data.inventoryId), userId: Number.parseInt(data.userId), quantity: Number.parseInt(data.quantity) };

            const response = await fetch('/api/inventory-usages', { method, body: JSON.stringify(body) });
            const usage: InventoryUsage = await response.json();
            usage.timestamp = new Date(usage.timestamp);

            onUpdateUsages(usage);

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
        setId(usage?.id || 0);
        setValue('quantity', usage?.quantity.toString() || '');
        setValue('timestamp', usage?.timestamp.toISOString() || new Date().toISOString());
        setValue('inventoryId', usage?.inventory.id.toString() || '');
        setValue('userId', usage?.user.id.toString() || '');
    }, [usage, setValue]);

    useEffect(() => {
        setInventoryOptions(inventories.map((inventory) => ({ value: inventory.id.toString(), label: inventory.name })));
    }, [inventories]);

    useEffect(() => {
        setUserOptions(users.map((user) => ({ value: user.id.toString(), label: user.name })));
    }, [users]);

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
                                    <h5 className="text-lg font-bold">Record Inventory Usage</h5>
                                    <button onClick={() => onToggleOpen(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="px-5 pt-3 pb-6">
                                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                        <div>
                                            <label htmlFor="inventory" className="text-sm">
                                                Inventory
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
                                            <label htmlFor="brand" className="text-sm">
                                                Staff
                                            </label>
                                            <Controller
                                                name="userId"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <Select
                                                        options={userOptions}
                                                        value={userOptions.find((opt) => opt.value === value)}
                                                        onChange={(val) => onChange(val?.value)}
                                                        placeholder="Choose staff ..."
                                                        className="text-sm"
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="quantity" className="text-sm">
                                                Quantity
                                            </label>
                                            <input id="quantity" type="number" placeholder="10" className="form-input" {...register('quantity')} />
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

export default ComponentsModalInventoryUsage;
