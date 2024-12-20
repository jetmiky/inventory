'use client';

import type Inventory from '@/interfaces/Inventory';
import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalInventory from '../components/modals/components-modal-inventory';

const ComponentsTablesInventories = () => {
    const inventories: Inventory[] = [
        { id: 'IN001', name: 'Red Thread', description: 'Lorem ipsum', minimumQuantity: 6 },
        { id: 'IN002', name: 'Red Thread', description: 'Lorem ipsum', minimumQuantity: 6 },
        { id: 'IN003', name: 'Black Thread', description: 'Lorem ipsum', minimumQuantity: 12 },
    ];

    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    return (
        <div>
            <ComponentsModalInventory isOpen={isModalOpen} onToggleOpen={setModalOpen} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Inventories</h2>

                <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
                    <IconPlus className="mr-4" />
                    Add Inventory
                </button>
            </div>

            <div className="table-responsive mb-5">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventories.map((inventory) => {
                            return (
                                <tr key={inventory.id}>
                                    <td>{inventory.id}</td>
                                    <td>{inventory.name}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => setModalOpen(true)}>
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
