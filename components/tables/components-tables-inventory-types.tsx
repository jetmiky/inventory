'use client';

import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import type { InventoryType } from '@prisma/client';
import ComponentsModalInventoryTypes from '../components/modals/components-modal-inventory-types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const toast = withReactContent(Swal);

type ComponentsTablesInventoryTypesProps = {
    types: InventoryType[];
};

const ComponentsTablesInventoryTypes = ({ types }: ComponentsTablesInventoryTypesProps) => {
    const [typeList, setTypeList] = useState<InventoryType[]>(types);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [type, setType] = useState<InventoryType | null>(null);

    const handleOpenModal = (type: InventoryType | null) => {
        setType(type);
        setModalOpen(true);
    };

    const handleUpdateTypes = (type: InventoryType) => {
        const index = typeList.findIndex((b) => b.id === type.id);
        setType(type);

        if (index < 0) {
            setTypeList([...typeList, type]);
            return;
        }

        setTypeList([...typeList.slice(0, index), type, ...typeList.slice(index + 1)]);
    };

    const handleDeleteType = async ({ id }: InventoryType) => {
        try {
            const body = { id };

            const result = await fetch('/api/types', { method: 'DELETE', body: JSON.stringify(body) });
            const response: { success: boolean; message: string } = await result.json();

            if (!response.success) throw new Error(response.message);

            setTypeList(typeList.filter((b) => b.id !== id));
            toast.fire({
                title: 'Successfuly deleted inventory type.',
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
                            <th className="max-w-1 whitespace-nowrap">#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {typeList.map((type) => {
                            return (
                                <tr key={type.id}>
                                    <td className="max-w-1 whitespace-nowrap">{`IT00${type.id}`}</td>
                                    <td>{type.name}</td>
                                    <td>{type.description}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => handleOpenModal(type)}>
                                                <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button type="button" onClick={() => handleDeleteType(type)}>
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
