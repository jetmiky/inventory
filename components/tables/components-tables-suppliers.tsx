'use client';

import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalSupplier from '../components/modals/components-modal-supplier';
import type { Supplier } from '@prisma/client';

type ComponentsTablesSuppliersProps = {
    suppliers: Supplier[];
};

const ComponentsTablesSuppliers = ({ suppliers }: ComponentsTablesSuppliersProps) => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [supplier, setSupplier] = useState<Supplier | null>(null);

    const handleOpenModal = (supplier: Supplier | null) => {
        setSupplier(supplier);
        setModalOpen(true);
    };

    const handleUpdateSuppliers = (supplier: Supplier) => {
        const index = suppliers.findIndex((s) => s.id === supplier.id);
        setSupplier(supplier);

        if (index < 0) {
            suppliers.push(supplier);
            return;
        }

        suppliers[index] = supplier;
    };

    return (
        <div>
            <ComponentsModalSupplier isOpen={isModalOpen} onToggleOpen={setModalOpen} supplier={supplier} onUpdateSuppliers={handleUpdateSuppliers} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Suppliers</h2>

                <button type="button" className="btn btn-primary" onClick={() => handleOpenModal(null)}>
                    <IconPlus className="mr-4" />
                    Add Supplier
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
                            <th>Address</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier) => {
                            return (
                                <tr key={supplier.id}>
                                    <td>{`SP00${supplier.id}`}</td>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.phone}</td>
                                    <td>{supplier.email}</td>
                                    <td>{supplier.address}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => handleOpenModal(supplier)}>
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

export default ComponentsTablesSuppliers;
