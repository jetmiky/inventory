'use client';

import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalUser from '../components/modals/components-modal-user';
import type { User } from '@prisma/client';

type ComponentsTablesUsersProps = {
    users: User[];
};

const ComponentsTablesUsers = ({ users }: ComponentsTablesUsersProps) => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const handleOpenModal = (user: User | null) => {
        setUser(user);
        setModalOpen(true);
    };

    const handleUpdateUsers = (user: User) => {
        const index = users.findIndex((u) => u.id === user.id);
        setUser(user);

        if (index < 0) {
            users.push(user);
            return;
        }

        users[index] = user;
    };

    return (
        <div>
            <ComponentsModalUser isOpen={isModalOpen} onToggleOpen={setModalOpen} onUpdateUsers={handleUpdateUsers} user={user} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Manage Users</h2>

                <button type="button" className="btn btn-primary" onClick={() => handleOpenModal(null)}>
                    <IconPlus className="mr-4" />
                    Add User
                </button>
            </div>

            <div className="table-responsive mb-5">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.email}</td>
                                    <td>{user.email}</td>
                                    <td>{user.email}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => handleOpenModal(user)}>
                                                <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button type="button" onClick={() => setModalOpen(true)}>
                                                <IconTrashLines className="m-auto" />
                                            </button>
                                        </Tippy>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComponentsTablesUsers;
