'use client';

import IconPlus from '@/components/icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import IconX from '@/components/icon/icon-x';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import type { Role } from '@prisma/client';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { User } from '@/components/tables/components-tables-users';

type ComponentsModalUserRolesProps = {
    user: User | null;
    roles: Role[];
    isOpen: boolean;
    onToggleOpen: (state: boolean) => void;
};

type UserRoleForm = {
    roleId: string;
};

const ComponentsModalUserRoles = ({ user, roles, isOpen, onToggleOpen }: ComponentsModalUserRolesProps) => {
    const { register, handleSubmit, setValue } = useForm<UserRoleForm>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([]);

    const handleResetForm = useCallback(() => {
        setValue('roleId', '');

        const roleOptions = roles.filter((role) => !user?.roles.some((ur) => ur.id === role.id)).map((role) => ({ label: role.name, value: String(role.id) }));
        setRoleOptions(roleOptions);
    }, [setValue, roles, user?.roles]);

    const handleFormSubmit = async (data: UserRoleForm) => {
        try {
            setIsSubmitting(true);

            const body = { roleId: Number.parseInt(data.roleId) };

            const response = await fetch(`/api/users/${user?.id}/roles`, { method: 'POST', body: JSON.stringify(body) });
            const role: Role = await response.json();

            const index = user?.roles.findIndex((r) => r.id === Number.parseInt(data.roleId)) as number;
            if (index < 0) {
                user?.roles.push(role);
            } else {
                if (user?.roles) user.roles[index] = role;
            }

            handleResetForm();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        handleResetForm();
    }, [handleResetForm]);

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
                                    <h5 className="text-lg font-bold">Assign User Roles</h5>
                                    <button onClick={() => onToggleOpen(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                                        <div>
                                            <label htmlFor="role">Assign New Role</label>
                                            <select id="role" {...register('roleId')}>
                                                <option value="" disabled>
                                                    Choose ...
                                                </option>
                                                {roleOptions.map((role) => (
                                                    <option value={role.value} key={role.value}>
                                                        {role.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button disabled={isSubmitting} type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            {isSubmitting && (
                                                <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle" />
                                            )}
                                            <IconPlus className="mr-2" />
                                            Assign Role
                                        </button>
                                    </form>

                                    <div className="mb-4">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Assigned Role</th>
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {user?.roles?.map((role) => (
                                                    <tr key={role.id}>
                                                        <td>{role.name}</td>
                                                        <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
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

                                    <div className="mt-8 flex items-center justify-end">
                                        <button onClick={() => onToggleOpen(false)} type="button" className="btn btn-outline-danger">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ComponentsModalUserRoles;
