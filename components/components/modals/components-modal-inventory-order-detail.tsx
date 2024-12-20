'use client';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import React, { Fragment } from 'react';

type ComponentsModalInventoryOrderDetailProps = {
    isOpen: boolean;
    onToggleOpen: (state: boolean) => void;
};

const ComponentsModalInventoryOrderDetail = ({ isOpen, onToggleOpen }: ComponentsModalInventoryOrderDetailProps) => {
    return (
        <div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" open={isOpen} onClose={() => onToggleOpen(false)}>
                    <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </TransitionChild>
                    <div id="fadein_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <DialogPanel className="panel animate__animated animate__fadeIn my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold">Add Inventory Order Detail</h5>
                                    <button onClick={() => onToggleOpen(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <form className="space-y-5">
                                        <div>
                                            <label htmlFor="name">Inventory</label>
                                            <input id="name" type="text" placeholder="Inventory Name" className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="quantity">Quantity</label>
                                            <input id="quantity" type="number" placeholder="Quantity" className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="price">Price per Item</label>
                                            <input id="price" type="number" placeholder="0.00" className="form-input" />
                                        </div>
                                    </form>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button onClick={() => onToggleOpen(false)} type="button" className="btn btn-outline-danger">
                                            Discard
                                        </button>
                                        <button onClick={() => onToggleOpen(false)} type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ComponentsModalInventoryOrderDetail;
