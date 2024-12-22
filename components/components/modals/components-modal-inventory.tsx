'use client';

import IconX from '@/components/icon/icon-x';
import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import type { InventoryBrand, InventoryType } from '@prisma/client';
import type { Inventory } from '@/components/tables/components-tables-inventories';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Select from 'react-select';
import IconSave from '@/components/icon/icon-save';

const toast = withReactContent(Swal);

type ComponentsModalInventoryProps = {
    inventory: Inventory | null;
    types: InventoryType[];
    brands: InventoryBrand[];
    isOpen: boolean;
    onToggleOpen: (state: boolean) => void;
    onUpdateInventories: (inventory: Inventory) => void;
};

type InventoryForm = {
    name: string;
    description: string;
    minimumStock: string;
    typeId: string;
    brandId: string;
};

const ComponentsModalInventory = ({ inventory, types, brands, isOpen, onToggleOpen, onUpdateInventories }: ComponentsModalInventoryProps) => {
    const [id, setId] = useState<number>(inventory?.id || 0);
    const { register, handleSubmit, setValue, control } = useForm<InventoryForm>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [typeOptions, setTypeOptions] = useState<{ value: string; label: string }[]>([]);
    const [brandOptions, setBrandOptions] = useState<{ value: string; label: string }[]>([]);

    const handleFormSubmit = async (data: InventoryForm) => {
        try {
            setIsSubmitting(true);

            const method = id === 0 ? 'POST' : 'PUT';
            const body = { ...data, id, typeId: Number.parseInt(data.typeId), brandId: Number.parseInt(data.brandId), minimumStock: Number.parseInt(data.minimumStock) };

            const response = await fetch('/api/inventories', { method, body: JSON.stringify(body) });
            const inventory: Inventory = await response.json();
            onUpdateInventories(inventory);

            toast.fire({
                title: method === 'POST' ? 'Successfuly added new inventory.' : 'Sucessfully edited inventory',
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
        setId(inventory?.id || 0);
        setValue('name', inventory?.name || '');
        setValue('description', inventory?.description || '');
        setValue('minimumStock', inventory?.minimumStock.toString() || '');
        setValue('brandId', inventory?.brandId.toString() || '');
        setValue('typeId', inventory?.typeId.toString() || '');
    }, [inventory, setValue]);

    useEffect(() => {
        setTypeOptions(types.map((type) => ({ value: type.id.toString(), label: type.name })));
    }, [types]);

    useEffect(() => {
        setBrandOptions(brands.map((brand) => ({ value: brand.id.toString(), label: brand.name })));
    }, [brands]);

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
                                    <h5 className="text-lg font-bold">Add Inventory</h5>
                                    <button onClick={() => onToggleOpen(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="px-5 pt-3 pb-6">
                                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                        <div>
                                            <label htmlFor="type" className="text-sm">
                                                Inventory Type
                                            </label>
                                            <Controller
                                                name="typeId"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <Select
                                                        options={typeOptions}
                                                        value={typeOptions.find((opt) => opt.value === value)}
                                                        onChange={(val) => onChange(val?.value)}
                                                        className="text-sm"
                                                        placeholder="Choose Inventory Type ..."
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="brand" className="text-sm">
                                                Inventory Brand
                                            </label>
                                            <Controller
                                                name="brandId"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <Select
                                                        options={brandOptions}
                                                        value={brandOptions.find((opt) => opt.value === value)}
                                                        onChange={(val) => onChange(val?.value)}
                                                        className="text-sm"
                                                        placeholder="Choose Inventory Brand ..."
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="name" className="text-sm">
                                                Name
                                            </label>
                                            <input id="name" type="text" placeholder="Inventory Name" className="form-input" {...register('name')} required />
                                        </div>
                                        <div>
                                            <label htmlFor="description" className="text-sm">
                                                Description
                                            </label>
                                            <textarea id="description" placeholder="Inventory Description" className="form-input" {...register('description')} required />
                                        </div>
                                        <div>
                                            <label htmlFor="minimumStock" className="text-sm">
                                                Minimum Quantity in Stock
                                            </label>
                                            <input id="minimumStock" type="number" placeholder="12" className="form-input" {...register('minimumStock')} required />
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

export default ComponentsModalInventory;
