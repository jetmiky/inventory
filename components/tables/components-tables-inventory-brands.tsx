'use client';

import type InventoryBrand from '@/interfaces/InventoryBrand';
import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalInventoryBrands from '../components/modals/components-modal-inventory-brands';

const ComponentsTablesInventoryBrands = () => {
    const brands: InventoryBrand[] = [
        { id: 'IB001', name: 'Zebra Threads' },
        { id: 'IB002', name: 'Top Threads' },
        { id: 'IB003', name: 'Singer' },
    ];

    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    return (
        <div>
            <ComponentsModalInventoryBrands isOpen={isModalOpen} onToggleOpen={setModalOpen} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Inventory Brands</h2>

                <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
                    <IconPlus className="mr-4" />
                    Add Inventory Brand
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
                        {brands.map((type) => {
                            return (
                                <tr key={type.id}>
                                    <td>{type.id}</td>
                                    <td>{type.name}</td>
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

export default ComponentsTablesInventoryBrands;
