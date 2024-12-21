'use client';

import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalInventoryUsage from '../components/modals/components-modal-inventory-usage';
import type { Inventory, Prisma, User } from '@prisma/client';

export type InventoryUsage = Prisma.InventoryUsageGetPayload<{ include: { inventory: true; user: true } }>;

type ComponentsTablesInventoryUsagesProps = {
    usages: InventoryUsage[];
    inventories: Inventory[];
    users: User[];
};

const ComponentsTablesInventoryUsages = ({ usages, inventories, users }: ComponentsTablesInventoryUsagesProps) => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [usage, setUsage] = useState<InventoryUsage | null>(null);

    const handleOpenModal = (usage: InventoryUsage | null) => {
        setUsage(usage);
        setModalOpen(true);
    };

    const handleUpdateUsages = (usage: InventoryUsage) => {
        const index = usages.findIndex((t) => t.id === usage.id);
        setUsage(usage);

        if (index < 0) {
            usages.push(usage);
            return;
        }

        usages[index] = usage;
    };

    return (
        <div>
            <ComponentsModalInventoryUsage isOpen={isModalOpen} onToggleOpen={setModalOpen} usage={usage} onUpdateUsages={handleUpdateUsages} inventories={inventories} users={users} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Inventory Usages</h2>

                <button type="button" className="btn btn-primary" onClick={() => handleOpenModal(null)}>
                    <IconPlus className="mr-4" />
                    Record Usage
                </button>
            </div>

            <div className="table-responsive mb-5">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>Date and Time</th>
                            <th>Inventory</th>
                            <th>Quantity</th>
                            <th>Staff</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usages.map((usage) => {
                            return (
                                <tr key={usage.id}>
                                    <td>{usage.timestamp.toString()}</td>
                                    <td>{usage?.inventory.name}</td>
                                    <td>{usage.quantity}</td>
                                    <td>{usage?.user.name}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => handleOpenModal(usage)}>
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

export default ComponentsTablesInventoryUsages;
