'use client';

import IconCreditCard from '@/components/icon/icon-credit-card';
import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import ComponentsModalSupplier from '../components/modals/components-modal-supplier';
import type { Prisma } from '@prisma/client';
import ComponentsModalSupplierPaymentMethod from '../components/modals/components-modal-supplier-payment-method';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const toast = withReactContent(Swal);

export type Supplier = Prisma.SupplierGetPayload<{ include: { methods: true } }>;

type ComponentsTablesSuppliersProps = {
    suppliers: Supplier[];
};

const ComponentsTablesSuppliers = ({ suppliers }: ComponentsTablesSuppliersProps) => {
    const [supplierList, setSupplierList] = useState<Supplier[]>(suppliers);
    const [isSupplierModalOpen, setSupplierModalOpen] = useState<boolean>(false);
    const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState<boolean>(false);
    const [supplier, setSupplier] = useState<Supplier | null>(null);

    const handleOpenSupplierModal = (supplier: Supplier | null) => {
        setSupplier(supplier);
        setSupplierModalOpen(true);
    };

    const handleOpenPaymentMethodModal = (supplier: Supplier) => {
        setSupplier(supplier);
        setIsPaymentMethodModalOpen(true);
    };

    const handleUpdateSuppliers = (supplier: Supplier) => {
        const index = supplierList.findIndex((s) => s.id === supplier.id);
        setSupplier(supplier);

        if (index < 0) {
            setSupplierList([...supplierList, supplier]);
            return;
        }

        setSupplierList([...supplierList.slice(0, index), supplier, ...supplierList.slice(index + 1)]);
    };

    const handleDeleteSupplier = async ({ id }: Supplier) => {
        try {
            const body = { id };

            const result = await fetch('/api/suppliers', { method: 'DELETE', body: JSON.stringify(body) });
            const response: { success: boolean; message: string } = await result.json();

            if (!response.success) throw new Error(response.message);

            setSupplierList(supplierList.filter((s) => s.id !== id));
            toast.fire({
                title: 'Successfuly deleted supplier.',
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
            <ComponentsModalSupplier isOpen={isSupplierModalOpen} onToggleOpen={setSupplierModalOpen} supplier={supplier} onUpdateSuppliers={handleUpdateSuppliers} />
            <ComponentsModalSupplierPaymentMethod isOpen={isPaymentMethodModalOpen} onToggleOpen={setIsPaymentMethodModalOpen} supplier={supplier} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Suppliers</h2>

                <button type="button" className="btn btn-primary" onClick={() => handleOpenSupplierModal(null)}>
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
                        {supplierList.map((supplier) => {
                            return (
                                <tr key={supplier.id}>
                                    <td>{`SP00${supplier.id}`}</td>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.phone}</td>
                                    <td>{supplier.email}</td>
                                    <td>{supplier.address}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                        <Tippy content="Payment Methods">
                                            <button type="button" onClick={() => handleOpenPaymentMethodModal(supplier)}>
                                                <IconCreditCard className="ltr:mr-2 rtl:ml-2" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => handleOpenSupplierModal(supplier)}>
                                                <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button type="button" onClick={() => handleDeleteSupplier(supplier)}>
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
