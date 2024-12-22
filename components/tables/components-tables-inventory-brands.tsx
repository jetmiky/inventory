'use client';

import IconPencil from '@/components/icon/icon-pencil';
import IconPlus from '../icon/icon-plus';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React, { useState } from 'react';
import type { InventoryBrand } from '@prisma/client';
import ComponentsModalInventoryBrand from '../components/modals/components-modal-inventory-brand';

type ComponentsTablesInventoryBrandsProps = {
    brands: InventoryBrand[];
};

const ComponentsTablesInventoryBrands = ({ brands }: ComponentsTablesInventoryBrandsProps) => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [brand, setBrand] = useState<InventoryBrand | null>(null);

    const handleOpenModal = (brand: InventoryBrand | null) => {
        setBrand(brand);
        setModalOpen(true);
    };

    const handleUpdateBrands = (brand: InventoryBrand) => {
        const index = brands.findIndex((b) => b.id === brand.id);
        setBrand(brand);

        if (index < 0) {
            brands.push(brand);
            return;
        }

        brands[index] = brand;
    };

    return (
        <div>
            <ComponentsModalInventoryBrand isOpen={isModalOpen} onToggleOpen={setModalOpen} onUpdateBrands={handleUpdateBrands} brand={brand} />

            <div className="flex justify-between items-center mb-7">
                <h2 className="text-lg font-bold">Inventory Brands</h2>

                <button type="button" className="btn btn-primary" onClick={() => handleOpenModal(null)}>
                    <IconPlus className="mr-4" />
                    Add Inventory Brand
                </button>
            </div>

            <div className="table-responsive mb-5">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th className="max-w-1 whitespace-nowrap">#</th>
                            <th>Brand Name</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.map((brand) => {
                            return (
                                <tr key={brand.id}>
                                    <td className="max-w-1 whitespace-nowrap">{`IB00${brand.id}`}</td>
                                    <td>{brand.name}</td>
                                    <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => handleOpenModal(brand)}>
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
