'use client';

import IconX from '@/components/icon/icon-x';
import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import type { Supplier } from '@prisma/client';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const toast = withReactContent(Swal);

type ComponentsModalSuppllierProps = {
    supplier: Supplier | null;
    isOpen: boolean;
    onToggleOpen: (state: boolean) => void;
    onUpdateSuppliers: (supplier: Supplier) => void;
};

type SupplierForm = {
    name: string;
    phone: string;
    email: string;
    address: string;
};

const ComponentsModalSupplier = ({ supplier, isOpen, onToggleOpen, onUpdateSuppliers }: ComponentsModalSuppllierProps) => {
    const [id, setId] = useState<number>(supplier?.id || 0);
    const { register, handleSubmit, setValue } = useForm<SupplierForm>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleFormSubmit = async (data: SupplierForm) => {
        try {
            setIsSubmitting(true);

            const method = id === 0 ? 'POST' : 'PUT';
            const body = { id, ...data };

            const response = await fetch('/api/suppliers', { method, body: JSON.stringify(body) });
            const supplier: Supplier = await response.json();
            onUpdateSuppliers(supplier);

            toast.fire({
                title: method === 'POST' ? 'Successfuly added new supplier.' : 'Sucessfully edited supplier',
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
        setId(supplier?.id || 0);
        setValue('name', supplier?.name || '');
        setValue('phone', supplier?.phone || '');
        setValue('email', supplier?.email || '');
        setValue('address', supplier?.address || '');
    }, [supplier, setValue]);

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
                                    <h5 className="text-lg font-bold">Add Supplier</h5>
                                    <button onClick={() => onToggleOpen(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                                        <div>
                                            <label htmlFor="name">Name</label>
                                            <input id="name" type="text" placeholder="Supplier Name" className="form-input" {...register('name')} />
                                        </div>
                                        <div>
                                            <label htmlFor="phone">Phone</label>
                                            <input id="phone" type="text" placeholder="Supplier Phone" className="form-input" {...register('phone')} />
                                        </div>
                                        <div>
                                            <label htmlFor="email">Email</label>
                                            <input id="email" type="email" placeholder="Supplier Email" className="form-input" {...register('email')} />
                                        </div>
                                        <div>
                                            <label htmlFor="address">Address</label>
                                            <textarea id="address" placeholder="Supplier Address" className="form-input" {...register('address')} />
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

export default ComponentsModalSupplier;
