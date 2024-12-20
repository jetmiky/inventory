export default interface InventoryOrder {
    id: string;
    invoice: string;
    timestamp: string;
    supplier: string;
    total: number;
    status: string;
}
