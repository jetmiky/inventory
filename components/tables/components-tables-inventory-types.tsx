'use client';

import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import type { InventoryType } from '@prisma/client';
import ComponentsModalInventoryTypes from '../components/modals/components-modal-inventory-types';

type ComponentsTablesInventoryTypesProps = {
    types: InventoryType[];
};

const ComponentsTablesInventoryTypes = ({ types }: ComponentsTablesInventoryTypesProps) => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [type, setType] = useState<InventoryType | null>(null);

    const handleOpenModal = (type: InventoryType | null) => {
        setType(type);
        setModalOpen(true);
    };

    const handleUpdateTypes = (type: InventoryType) => {
        const index = types.findIndex((t) => t.id === type.id);

        if (index < 0) {
            types.push(type);
            return;
        }

        types[index] = type;
    };

    return (
        <div>
            <ComponentsModalInventoryTypes isOpen={isModalOpen} onToggleOpen={setModalOpen} onUpdateTypes={handleUpdateTypes} type={type} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Inventory Types</h2>

                <button type="button" className="btn btn-primary" onClick={() => handleOpenModal(null)}>
                    <IconPlus className="mr-4" />
                    Add Inventory Type
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
                        {types.map((type) => {
                            return (
                                <tr key={type.id}>
                                    <td>{`IT00${type.id}`}</td>
                                    <td>{type.name}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => handleOpenModal(type)}>
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

export default ComponentsTablesInventoryTypes;
