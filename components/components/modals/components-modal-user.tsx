'use client';

import IconX from '@/components/icon/icon-x';
import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import type { User } from '@/components/tables/components-tables-users';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const toast = withReactContent(Swal);

type ComponentsModalUserProps = {
    user: User | null;
    isOpen: boolean;
    onToggleOpen: (state: boolean) => void;
    onUpdateUsers: (user: User) => void;
};

type UserForm = {
    name: string;
    phone: string;
    email: string;
    address: string;
    password: string;
};

const ComponentsModalUser = ({ user, isOpen, onToggleOpen, onUpdateUsers }: ComponentsModalUserProps) => {
    const [id, setId] = useState<number>(user?.id || 0);
    const { register, handleSubmit, setValue } = useForm<UserForm>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleFormSubmit = async (data: UserForm) => {
        try {
            setIsSubmitting(true);

            const method = id === 0 ? 'POST' : 'PUT';
            const body = { id, ...data };

            const response = await fetch('/api/users', { method, body: JSON.stringify(body) });
            const user: User = await response.json();
            onUpdateUsers(user);

            toast.fire({
                title: method === 'POST' ? 'Successfuly added new user.' : 'Sucessfully edited user',
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
        setId(user?.id || 0);
        setValue('name', user?.name || '');
        setValue('phone', user?.phone || '');
        setValue('email', user?.email || '');
        setValue('address', user?.address || '');
        setValue('password', '');
    }, [user, setValue]);

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
                                    <h5 className="text-lg font-bold">Add User</h5>
                                    <button onClick={() => onToggleOpen(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                                        <div>
                                            <label htmlFor="name">Name</label>
                                            <input id="name" type="text" placeholder="Staff Name" className="form-input" {...register('name')} />
                                        </div>
                                        <div>
                                            <label htmlFor="phone">Phone</label>
                                            <input id="phone" type="text" placeholder="Staff Phone" className="form-input" {...register('phone')} />
                                        </div>
                                        <div>
                                            <label htmlFor="email">Email</label>
                                            <input id="email" type="email" placeholder="Staff Email" className="form-input" {...register('email')} />
                                        </div>
                                        <div>
                                            <label htmlFor="address">Address</label>
                                            <textarea id="address" placeholder="Staff Address" className="form-input" {...register('address')} />
                                        </div>
                                        {id === 0 && (
                                            <div>
                                                <label htmlFor="password">Password</label>
                                                <input type="password" placeholder="********" className="form-input" {...register('password')} />
                                            </div>
                                        )}

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

export default ComponentsModalUser;
