'use client';

import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalInventoryUsage from '../components/modals/components-modal-inventory-usage';
import type { Inventory, Prisma, User } from '@prisma/client';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const toast = withReactContent(Swal);

export type InventoryUsage = Prisma.InventoryUsageGetPayload<{ include: { inventory: true; user: true } }>;

type ComponentsTablesInventoryUsagesProps = {
    usages: InventoryUsage[];
    inventories: Inventory[];
    users: User[];
};

const ComponentsTablesInventoryUsages = ({ usages, inventories, users }: ComponentsTablesInventoryUsagesProps) => {
    const [usageList, setUsageList] = useState<InventoryUsage[]>(usages);
    const [inventoryList, setInventoryList] = useState<Inventory[]>(inventories);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [usage, setUsage] = useState<InventoryUsage | null>(null);

    const handleOpenModal = (usage: InventoryUsage | null) => {
        setUsage(usage);
        setModalOpen(true);
    };

    const handleUpdateUsages = (usage: InventoryUsage) => {
        const index = usageList.findIndex((u) => u.id === usage.id);
        setUsage(usage);
        handleUpdateInventories(usage.inventory);

        if (index < 0) {
            setUsageList([usage, ...usageList]);
            return;
        }

        setUsageList([...usageList.slice(0, index), usage, ...usageList.slice(index + 1)]);
    };

    const handleUpdateInventories = (inventory: Inventory) => {
        const index = inventoryList.findIndex((i) => i.id === inventory.id);
        setInventoryList([...inventoryList.slice(0, index), inventory, ...inventoryList.slice(index + 1)]);
    };

    const handleDeleteUsage = async ({ id }: InventoryUsage) => {
        try {
            const body = { id };

            const result = await fetch('/api/inventory-usages', { method: 'DELETE', body: JSON.stringify(body) });
            const response: { success: boolean; message: string } = await result.json();

            if (!response.success) throw new Error(response.message);

            setUsageList(usageList.filter((u) => u.id !== id));
            toast.fire({
                title: 'Successfuly deleted Inventory Usage.',
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
            });
        } catch (error) {
            toast.fire({
                title: `${error}`,
                toast: true,
                position: 'bottom-right',
                showConfirmButton: false,
                timer: 5000,
                showCloseButton: true,
            });
        }
    };

    return (
        <div>
            <ComponentsModalInventoryUsage isOpen={isModalOpen} onToggleOpen={setModalOpen} usage={usage} onUpdateUsages={handleUpdateUsages} inventories={inventoryList} users={users} />

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
                            <th className="max-w-1 whitespace-nowrap">Quantity</th>
                            <th>Staff</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usageList.length ? (
                            usageList.map((usage) => {
                                return (
                                    <tr key={usage.id}>
                                        <td className="max-w-1 whitespace-nowrap">{usage.timestamp.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                        <td>{usage?.inventory.name}</td>
                                        <td className="text-center max-w-1 whitespace-nowrap">{usage.quantity}</td>
                                        <td>{usage?.user.name}</td>
                                        <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                            <Tippy content="Edit">
                                                <button type="button" onClick={() => handleOpenModal(usage)}>
                                                    <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                                </button>
                                            </Tippy>
                                            <Tippy content="Delete">
                                                <button type="button" onClick={() => handleDeleteUsage(usage)}>
                                                    <IconTrashLines className="m-auto" />
                                                </button>
                                            </Tippy>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5}>No inventory usage recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComponentsTablesInventoryUsages;
