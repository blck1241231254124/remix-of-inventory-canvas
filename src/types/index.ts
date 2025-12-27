// User Roles
export type UserRole = 'admin' | 'warehouse_staff' | 'department_user' | 'head_of_warehouse';

// Transaction Status
export type TransactionStatus = 'DRAFT' | 'WAITING_APPROVAL' | 'APPROVED' | 'REJECTED';

// User
export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

// Category
export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Item
export interface Item {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  unit: string;
  stock: number;
  minStock: number;
  location: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Supplier
export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  createdAt: string;
  updatedAt: string;
}

// Base Transaction
export interface BaseTransaction {
  id: string;
  transactionNumber: string;
  status: TransactionStatus;
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  signatureImage?: string;
}

// Transaction Item
export interface TransactionItem {
  itemId: string;
  quantity: number;
  notes?: string;
}

// Incoming Goods
export interface IncomingGoods extends BaseTransaction {
  supplierId: string;
  referenceNumber: string;
  receivedDate: string;
  items: TransactionItem[];
}

// Outgoing Goods
export interface OutgoingGoods extends BaseTransaction {
  destination: string;
  requestedBy: string;
  items: TransactionItem[];
}

// Item Request
export interface ItemRequest extends BaseTransaction {
  department: string;
  requestedBy: string;
  requiredDate: string;
  items: TransactionItem[];
  fulfilledAt?: string;
  fulfilledBy?: string;
}

// Purchase Order
export interface PurchaseOrder extends BaseTransaction {
  supplierId: string;
  expectedDate: string;
  items: TransactionItem[];
  receivedAt?: string;
  receivedBy?: string;
}

// Stock Movement
export interface StockMovement {
  id: string;
  itemId: string;
  transactionType: 'incoming' | 'outgoing' | 'request' | 'purchase';
  transactionId: string;
  transactionNumber: string;
  quantityChange: number;
  previousStock: number;
  newStock: number;
  createdAt: string;
  createdBy: string;
}

// Auth Context
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// LocalStorage Keys
export const STORAGE_KEYS = {
  USERS: 'inventory_users',
  CATEGORIES: 'inventory_categories',
  ITEMS: 'inventory_items',
  SUPPLIERS: 'inventory_suppliers',
  INCOMING_GOODS: 'inventory_incoming_goods',
  OUTGOING_GOODS: 'inventory_outgoing_goods',
  ITEM_REQUESTS: 'inventory_item_requests',
  PURCHASE_ORDERS: 'inventory_purchase_orders',
  STOCK_MOVEMENTS: 'inventory_stock_movements',
  CURRENT_USER: 'inventory_current_user',
} as const;

// Role Labels
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  warehouse_staff: 'Warehouse Staff',
  department_user: 'Department User',
  head_of_warehouse: 'Head of Warehouse',
};

// Status Labels
export const STATUS_LABELS: Record<TransactionStatus, string> = {
  DRAFT: 'Draft',
  WAITING_APPROVAL: 'Waiting Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};
