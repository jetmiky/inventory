'use client';

import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import type { InventoryBrand, InventoryType, Prisma } from '@prisma/client';
import ComponentsModalInventory from '../components/modals/components-modal-inventory';

export type Inventory = Prisma.InventoryGetPayload<{ include: { brand: true; type: true } }>;

type ComponentsTablesInventoriesProps = {
    inventories: Inventory[];
    types: InventoryType[];
    brands: InventoryBrand[];
};

const ComponentsTablesInventories = ({ inventories, types, brands }: ComponentsTablesInventoriesProps) => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [inventory, setInventory] = useState<Inventory | null>(null);

    const handleOpenModal = (inventory: Inventory | null) => {
        setInventory(inventory);
        setModalOpen(true);
    };

    const handleUpdateInventories = (inventory: Inventory) => {
        const index = inventories.findIndex((b) => b.id === inventory.id);

        if (index < 0) {
            inventories.push(inventory);
            return;
        }

        inventories[index] = inventory;
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
                            <th>#</th>
                            <th>Type</th>
                            <th>Brand</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Minimum Stock</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventories.map((inventory) => {
                            return (
                                <tr key={inventory.id}>
                                    <td>{`IN00${inventory.id}`}</td>
                                    <td>{inventory.type.name}</td>
                                    <td>{inventory.brand.name}</td>
                                    <td>{inventory.name}</td>
                                    <td>{inventory.description}</td>
                                    <td>{inventory.minimumStock}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => handleOpenModal(inventory)}>
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

export default ComponentsTablesInventories;
