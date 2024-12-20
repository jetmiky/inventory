'use client';

import type InventoryUsage from '@/interfaces/InventoryUsage';
import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalInventoryUsage from '../components/modals/components-modal-inventory-usage';

const ComponentsTablesInventoryUsages = () => {
    const usages: InventoryUsage[] = [
        { id: 'IU001', inventory: 'Red Fabric', quantity: 2, staff: 'Yuke Sampurna', timestamp: '20240212' },
        { id: 'IU002', inventory: 'Black Threads', quantity: 12, staff: 'Yuke Sampurna', timestamp: '20241212' },
        { id: 'IU003', inventory: 'White Threads', quantity: 12, staff: 'Once Mekel', timestamp: '20241220' },
    ];

    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    return (
        <div>
            <ComponentsModalInventoryUsage isOpen={isModalOpen} onToggleOpen={setModalOpen} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Inventory Usages</h2>

                <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
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
                                    <td>{usage.timestamp}</td>
                                    <td>{usage.inventory}</td>
                                    <td>{usage.quantity}</td>
                                    <td>{usage.staff}</td>
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

export default ComponentsTablesInventoryUsages;
