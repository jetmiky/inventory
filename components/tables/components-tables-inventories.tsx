'use client';

import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import type { InventoryBrand, InventoryType, Prisma } from '@prisma/client';
import ComponentsModalInventory from '../components/modals/components-modal-inventory';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const toast = withReactContent(Swal);

export type Inventory = Prisma.InventoryGetPayload<{ include: { brand: true; type: true } }>;

type ComponentsTablesInventoriesProps = {
    inventories: Inventory[];
    types: InventoryType[];
    brands: InventoryBrand[];
};

const ComponentsTablesInventories = ({ inventories, types, brands }: ComponentsTablesInventoriesProps) => {
    const [inventoryList, setInventoryList] = useState<Inventory[]>(inventories);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [inventory, setInventory] = useState<Inventory | null>(null);

    const handleOpenModal = (inventory: Inventory | null) => {
        setInventory(inventory);
        setModalOpen(true);
    };

    const handleUpdateInventories = (inventory: Inventory) => {
        const index = inventoryList.findIndex((i) => i.id === inventory.id);
        setInventory(inventory);

        if (index < 0) {
            setInventoryList([...inventoryList, inventory]);
            return;
        }

        setInventoryList([...inventoryList.slice(0, index), inventory, ...inventoryList.slice(index + 1)]);
    };

    const handleDeleteInventory = async ({ id }: Inventory) => {
        try {
            const body = { id };

            const result = await fetch('/api/inventories', { method: 'DELETE', body: JSON.stringify(body) });
            const response: { success: boolean; message: string } = await result.json();

            if (!response.success) throw new Error(response.message);

            setInventoryList(inventoryList.filter((i) => i.id !== id));
            toast.fire({
                title: 'Successfuly deleted inventory.',
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
            <ComponentsModalInventory isOpen={isModalOpen} onToggleOpen={setModalOpen} onUpdateInventories={handleUpdateInventories} inventory={inventory} types={types} brands={brands} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Inventories</h2>

                <button type="button" className="btn btn-primary" onClick={() => handleOpenModal(null)}>
                    <IconPlus className="mr-4" />
                    Add Inventory
                </button>
            </div>

            <div className="table-responsive mb-5">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th className="max-w-1 whitespace-nowrap">#</th>
                            <th>Type</th>
                            <th>Brand</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th className="max-w-1 whitespace-nowrap">Minimum Stock</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryList.map((inventory) => {
                            return (
                                <tr key={inventory.id}>
                                    <td className="max-w-1 whitespace-nowrap">{`IN00${inventory.id}`}</td>
                                    <td>{inventory.type.name}</td>
                                    <td>{inventory.brand.name}</td>
                                    <td>{inventory.name}</td>
                                    <td>{inventory.description}</td>
                                    <td className="text-center max-w-1 whitespace-nowrap">{inventory.minimumStock}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => handleOpenModal(inventory)}>
                                                <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button type="button" onClick={() => handleDeleteInventory(inventory)}>
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

export default ComponentsTablesInventories;
