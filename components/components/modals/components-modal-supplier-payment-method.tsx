'use client';

import IconPencil from '@/components/icon/icon-pencil';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import IconX from '@/components/icon/icon-x';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import type { SupplierPaymentMethod } from '@prisma/client';
import type { Supplier } from '@/components/tables/components-tables-suppliers';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type ComponentsModalSuppllierPaymentMethodProps = {
    supplier: Supplier | null;
    isOpen: boolean;
    onToggleOpen: (state: boolean) => void;
};

type PaymentMethodForm = {
    name: string;
    account: string;
};

const ComponentsModalSupplierPaymentMethod = ({ supplier, isOpen, onToggleOpen }: ComponentsModalSuppllierPaymentMethodProps) => {
    const [selectedMethod, setSelectedMethod] = useState<SupplierPaymentMethod | null>(null);
    const { register, handleSubmit, setValue } = useForm<PaymentMethodForm>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSelectMethod = (method: SupplierPaymentMethod) => {
        setSelectedMethod(method);
        setValue('name', method.name);
        setValue('account', method.account);
    };

    const handleResetForm = () => {
        setSelectedMethod(null);
        setValue('name', '');
        setValue('account', '');
    };

    const handleFormSubmit = async (data: PaymentMethodForm) => {
        try {
            setIsSubmitting(true);

            const method = selectedMethod === null ? 'POST' : 'PUT';
            const body = { id: selectedMethod?.id, ...data, supplierId: supplier?.id };

            const response = await fetch(`/api/suppliers/${supplier?.id}/payment-methods`, { method, body: JSON.stringify(body) });
            const paymentMethod: SupplierPaymentMethod = await response.json();

            const index = supplier?.methods.findIndex((m) => m.id === paymentMethod.id) as number;
            if (index < 0) {
                supplier?.methods.push(paymentMethod);
            } else {
                if (supplier?.methods) supplier.methods[index] = paymentMethod;
            }

            handleResetForm();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                    <h5 className="text-lg font-bold">Supplier Payment Methods</h5>
                                    <button onClick={() => onToggleOpen(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="mb-4">
                                        <label htmlFor="supplier_name">Supplier Name</label>
                                        <input type="text" id="supplier_name" className="form-input" value={supplier?.name || ''} disabled />
                                    </div>

                                    <div className="mb-4">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Account Number</th>
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {supplier?.methods?.map((method) => (
                                                    <tr key={method.id}>
                                                        <td>{method.name}</td>
                                                        <td>{method.account}</td>
                                                        <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                                            <Tippy content="Edit">
                                                                <button type="button" onClick={() => handleSelectMethod(method)}>
                                                                    <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                                                </button>
                                                            </Tippy>
                                                            <Tippy content="Delete">
                                                                <button type="button">
                                                                    <IconTrashLines className="m-auto" />
                                                                </button>
                                                            </Tippy>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                                        <div>
                                            <label htmlFor="name">Name</label>
                                            <input id="name" type="text" placeholder="Payment Method Name" className="form-input" {...register('name')} />
                                        </div>
                                        <div>
                                            <label htmlFor="account">Account Number</label>
                                            <input id="account" type="text" placeholder="Account Number" className="form-input" {...register('account')} />
                                        </div>

                                        <div className="mt-8 flex items-center justify-end">
                                            <button onClick={() => onToggleOpen(false)} type="button" className="btn btn-outline-danger">
                                                Close
                                            </button>
                                            <button disabled={isSubmitting} type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                {isSubmitting && (
                                                    <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle" />
                                                )}
                                                Add Payment Method
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

export default ComponentsModalSupplierPaymentMethod;
