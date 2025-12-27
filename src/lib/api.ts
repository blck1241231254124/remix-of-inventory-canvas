import { 
  User, 
  Category, 
  Item, 
  Supplier, 
  IncomingGoods, 
  OutgoingGoods, 
  ItemRequest, 
  PurchaseOrder, 
  StockMovement,
  STORAGE_KEYS,
  TransactionStatus
} from '@/types';
import { storage, generateId, getCurrentTimestamp, generateTransactionNumber } from './storage';

// User API
export const userApi = {
  getAll: (): User[] => {
    return storage.get<User[]>(STORAGE_KEYS.USERS) || [];
  },

  getById: (id: string): User | undefined => {
    const users = userApi.getAll();
    return users.find(u => u.id === id);
  },

  getByUsername: (username: string): User | undefined => {
    const users = userApi.getAll();
    return users.find(u => u.username === username);
  },

  create: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const users = userApi.getAll();
    const newUser: User = {
      ...user,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    storage.set(STORAGE_KEYS.USERS, [...users, newUser]);
    return newUser;
  },

  update: (id: string, updates: Partial<User>): User | undefined => {
    const users = userApi.getAll();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return undefined;

    const updatedUser = {
      ...users[index],
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };
    users[index] = updatedUser;
    storage.set(STORAGE_KEYS.USERS, users);
    return updatedUser;
  },

  delete: (id: string): boolean => {
    const users = userApi.getAll();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return false;
    storage.set(STORAGE_KEYS.USERS, filtered);
    return true;
  },
};

// Category API
export const categoryApi = {
  getAll: (): Category[] => {
    return storage.get<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
  },

  getById: (id: string): Category | undefined => {
    const categories = categoryApi.getAll();
    return categories.find(c => c.id === id);
  },

  create: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category => {
    const categories = categoryApi.getAll();
    const newCategory: Category = {
      ...category,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    storage.set(STORAGE_KEYS.CATEGORIES, [...categories, newCategory]);
    return newCategory;
  },

  update: (id: string, updates: Partial<Category>): Category | undefined => {
    const categories = categoryApi.getAll();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    const updated = {
      ...categories[index],
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };
    categories[index] = updated;
    storage.set(STORAGE_KEYS.CATEGORIES, categories);
    return updated;
  },

  delete: (id: string): boolean => {
    const categories = categoryApi.getAll();
    const filtered = categories.filter(c => c.id !== id);
    if (filtered.length === categories.length) return false;
    storage.set(STORAGE_KEYS.CATEGORIES, filtered);
    return true;
  },
};

// Item API
export const itemApi = {
  getAll: (): Item[] => {
    return storage.get<Item[]>(STORAGE_KEYS.ITEMS) || [];
  },

  getById: (id: string): Item | undefined => {
    const items = itemApi.getAll();
    return items.find(i => i.id === id);
  },

  getLowStock: (): Item[] => {
    const items = itemApi.getAll();
    return items.filter(i => i.stock <= i.minStock);
  },

  create: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Item => {
    const items = itemApi.getAll();
    const newItem: Item = {
      ...item,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    storage.set(STORAGE_KEYS.ITEMS, [...items, newItem]);
    return newItem;
  },

  update: (id: string, updates: Partial<Item>): Item | undefined => {
    const items = itemApi.getAll();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return undefined;

    const updated = {
      ...items[index],
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };
    items[index] = updated;
    storage.set(STORAGE_KEYS.ITEMS, items);
    return updated;
  },

  updateStock: (id: string, quantityChange: number): Item | undefined => {
    const items = itemApi.getAll();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return undefined;

    const newStock = items[index].stock + quantityChange;
    if (newStock < 0) return undefined; // Prevent negative stock

    const updated = {
      ...items[index],
      stock: newStock,
      updatedAt: getCurrentTimestamp(),
    };
    items[index] = updated;
    storage.set(STORAGE_KEYS.ITEMS, items);
    return updated;
  },

  delete: (id: string): boolean => {
    const items = itemApi.getAll();
    const filtered = items.filter(i => i.id !== id);
    if (filtered.length === items.length) return false;
    storage.set(STORAGE_KEYS.ITEMS, filtered);
    return true;
  },
};

// Supplier API
export const supplierApi = {
  getAll: (): Supplier[] => {
    return storage.get<Supplier[]>(STORAGE_KEYS.SUPPLIERS) || [];
  },

  getById: (id: string): Supplier | undefined => {
    const suppliers = supplierApi.getAll();
    return suppliers.find(s => s.id === id);
  },

  create: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Supplier => {
    const suppliers = supplierApi.getAll();
    const newSupplier: Supplier = {
      ...supplier,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    storage.set(STORAGE_KEYS.SUPPLIERS, [...suppliers, newSupplier]);
    return newSupplier;
  },

  update: (id: string, updates: Partial<Supplier>): Supplier | undefined => {
    const suppliers = supplierApi.getAll();
    const index = suppliers.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    const updated = {
      ...suppliers[index],
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };
    suppliers[index] = updated;
    storage.set(STORAGE_KEYS.SUPPLIERS, suppliers);
    return updated;
  },

  delete: (id: string): boolean => {
    const suppliers = supplierApi.getAll();
    const filtered = suppliers.filter(s => s.id !== id);
    if (filtered.length === suppliers.length) return false;
    storage.set(STORAGE_KEYS.SUPPLIERS, filtered);
    return true;
  },
};

// Incoming Goods API
export const incomingGoodsApi = {
  getAll: (): IncomingGoods[] => {
    return storage.get<IncomingGoods[]>(STORAGE_KEYS.INCOMING_GOODS) || [];
  },

  getById: (id: string): IncomingGoods | undefined => {
    const records = incomingGoodsApi.getAll();
    return records.find(r => r.id === id);
  },

  create: (data: Omit<IncomingGoods, 'id' | 'transactionNumber' | 'status' | 'createdAt' | 'updatedAt'>): IncomingGoods => {
    const records = incomingGoodsApi.getAll();
    const newRecord: IncomingGoods = {
      ...data,
      id: generateId(),
      transactionNumber: generateTransactionNumber('IN'),
      status: 'DRAFT',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    storage.set(STORAGE_KEYS.INCOMING_GOODS, [...records, newRecord]);
    return newRecord;
  },

  update: (id: string, updates: Partial<IncomingGoods>): IncomingGoods | undefined => {
    const records = incomingGoodsApi.getAll();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    // Don't allow updates on approved transactions
    if (records[index].status === 'APPROVED') return undefined;

    const updated = {
      ...records[index],
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };
    records[index] = updated;
    storage.set(STORAGE_KEYS.INCOMING_GOODS, records);
    return updated;
  },

  submit: (id: string): IncomingGoods | undefined => {
    return incomingGoodsApi.update(id, { 
      status: 'WAITING_APPROVAL',
      submittedAt: getCurrentTimestamp(),
    });
  },

  approve: (id: string, userId: string, signatureImage: string): IncomingGoods | undefined => {
    const record = incomingGoodsApi.getById(id);
    if (!record || record.status !== 'WAITING_APPROVAL') return undefined;

    const updated = incomingGoodsApi.update(id, {
      status: 'APPROVED',
      approvedBy: userId,
      approvedAt: getCurrentTimestamp(),
      signatureImage,
    });

    if (updated) {
      // Update stock for each item
      updated.items.forEach(item => {
        const existingItem = itemApi.getById(item.itemId);
        if (existingItem) {
          itemApi.updateStock(item.itemId, item.quantity);
          // Create stock movement
          stockMovementApi.create({
            itemId: item.itemId,
            transactionType: 'incoming',
            transactionId: updated.id,
            transactionNumber: updated.transactionNumber,
            quantityChange: item.quantity,
            previousStock: existingItem.stock,
            newStock: existingItem.stock + item.quantity,
            createdBy: userId,
          });
        }
      });
    }

    return updated;
  },

  reject: (id: string, userId: string, reason: string): IncomingGoods | undefined => {
    return incomingGoodsApi.update(id, {
      status: 'REJECTED',
      rejectedBy: userId,
      rejectedAt: getCurrentTimestamp(),
      rejectionReason: reason,
    });
  },

  delete: (id: string): boolean => {
    const records = incomingGoodsApi.getAll();
    const record = records.find(r => r.id === id);
    if (!record || record.status !== 'DRAFT') return false;

    const filtered = records.filter(r => r.id !== id);
    storage.set(STORAGE_KEYS.INCOMING_GOODS, filtered);
    return true;
  },
};

// Outgoing Goods API
export const outgoingGoodsApi = {
  getAll: (): OutgoingGoods[] => {
    return storage.get<OutgoingGoods[]>(STORAGE_KEYS.OUTGOING_GOODS) || [];
  },

  getById: (id: string): OutgoingGoods | undefined => {
    const records = outgoingGoodsApi.getAll();
    return records.find(r => r.id === id);
  },

  create: (data: Omit<OutgoingGoods, 'id' | 'transactionNumber' | 'status' | 'createdAt' | 'updatedAt'>): OutgoingGoods => {
    const records = outgoingGoodsApi.getAll();
    const newRecord: OutgoingGoods = {
      ...data,
      id: generateId(),
      transactionNumber: generateTransactionNumber('OUT'),
      status: 'DRAFT',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    storage.set(STORAGE_KEYS.OUTGOING_GOODS, [...records, newRecord]);
    return newRecord;
  },

  update: (id: string, updates: Partial<OutgoingGoods>): OutgoingGoods | undefined => {
    const records = outgoingGoodsApi.getAll();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    if (records[index].status === 'APPROVED') return undefined;

    const updated = {
      ...records[index],
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };
    records[index] = updated;
    storage.set(STORAGE_KEYS.OUTGOING_GOODS, records);
    return updated;
  },

  submit: (id: string): OutgoingGoods | undefined => {
    return outgoingGoodsApi.update(id, { 
      status: 'WAITING_APPROVAL',
      submittedAt: getCurrentTimestamp(),
    });
  },

  approve: (id: string, userId: string, signatureImage: string): OutgoingGoods | undefined => {
    const record = outgoingGoodsApi.getById(id);
    if (!record || record.status !== 'WAITING_APPROVAL') return undefined;

    // Check stock availability
    for (const item of record.items) {
      const existingItem = itemApi.getById(item.itemId);
      if (!existingItem || existingItem.stock < item.quantity) {
        return undefined; // Insufficient stock
      }
    }

    const updated = outgoingGoodsApi.update(id, {
      status: 'APPROVED',
      approvedBy: userId,
      approvedAt: getCurrentTimestamp(),
      signatureImage,
    });

    if (updated) {
      updated.items.forEach(item => {
        const existingItem = itemApi.getById(item.itemId);
        if (existingItem) {
          itemApi.updateStock(item.itemId, -item.quantity);
          stockMovementApi.create({
            itemId: item.itemId,
            transactionType: 'outgoing',
            transactionId: updated.id,
            transactionNumber: updated.transactionNumber,
            quantityChange: -item.quantity,
            previousStock: existingItem.stock,
            newStock: existingItem.stock - item.quantity,
            createdBy: userId,
          });
        }
      });
    }

    return updated;
  },

  reject: (id: string, userId: string, reason: string): OutgoingGoods | undefined => {
    return outgoingGoodsApi.update(id, {
      status: 'REJECTED',
      rejectedBy: userId,
      rejectedAt: getCurrentTimestamp(),
      rejectionReason: reason,
    });
  },

  delete: (id: string): boolean => {
    const records = outgoingGoodsApi.getAll();
    const record = records.find(r => r.id === id);
    if (!record || record.status !== 'DRAFT') return false;

    const filtered = records.filter(r => r.id !== id);
    storage.set(STORAGE_KEYS.OUTGOING_GOODS, filtered);
    return true;
  },
};

// Item Request API
export const itemRequestApi = {
  getAll: (): ItemRequest[] => {
    return storage.get<ItemRequest[]>(STORAGE_KEYS.ITEM_REQUESTS) || [];
  },

  getById: (id: string): ItemRequest | undefined => {
    const records = itemRequestApi.getAll();
    return records.find(r => r.id === id);
  },

  create: (data: Omit<ItemRequest, 'id' | 'transactionNumber' | 'status' | 'createdAt' | 'updatedAt'>): ItemRequest => {
    const records = itemRequestApi.getAll();
    const newRecord: ItemRequest = {
      ...data,
      id: generateId(),
      transactionNumber: generateTransactionNumber('REQ'),
      status: 'DRAFT',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    storage.set(STORAGE_KEYS.ITEM_REQUESTS, [...records, newRecord]);
    return newRecord;
  },

  update: (id: string, updates: Partial<ItemRequest>): ItemRequest | undefined => {
    const records = itemRequestApi.getAll();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    if (records[index].status === 'APPROVED') return undefined;

    const updated = {
      ...records[index],
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };
    records[index] = updated;
    storage.set(STORAGE_KEYS.ITEM_REQUESTS, records);
    return updated;
  },

  submit: (id: string): ItemRequest | undefined => {
    return itemRequestApi.update(id, { 
      status: 'WAITING_APPROVAL',
      submittedAt: getCurrentTimestamp(),
    });
  },

  approve: (id: string, userId: string, signatureImage: string): ItemRequest | undefined => {
    const record = itemRequestApi.getById(id);
    if (!record || record.status !== 'WAITING_APPROVAL') return undefined;

    // Check stock availability
    for (const item of record.items) {
      const existingItem = itemApi.getById(item.itemId);
      if (!existingItem || existingItem.stock < item.quantity) {
        return undefined; // Insufficient stock
      }
    }

    const updated = itemRequestApi.update(id, {
      status: 'APPROVED',
      approvedBy: userId,
      approvedAt: getCurrentTimestamp(),
      signatureImage,
      fulfilledAt: getCurrentTimestamp(),
      fulfilledBy: userId,
    });

    if (updated) {
      updated.items.forEach(item => {
        const existingItem = itemApi.getById(item.itemId);
        if (existingItem) {
          itemApi.updateStock(item.itemId, -item.quantity);
          stockMovementApi.create({
            itemId: item.itemId,
            transactionType: 'request',
            transactionId: updated.id,
            transactionNumber: updated.transactionNumber,
            quantityChange: -item.quantity,
            previousStock: existingItem.stock,
            newStock: existingItem.stock - item.quantity,
            createdBy: userId,
          });
        }
      });
    }

    return updated;
  },

  reject: (id: string, userId: string, reason: string): ItemRequest | undefined => {
    return itemRequestApi.update(id, {
      status: 'REJECTED',
      rejectedBy: userId,
      rejectedAt: getCurrentTimestamp(),
      rejectionReason: reason,
    });
  },

  delete: (id: string): boolean => {
    const records = itemRequestApi.getAll();
    const record = records.find(r => r.id === id);
    if (!record || record.status !== 'DRAFT') return false;

    const filtered = records.filter(r => r.id !== id);
    storage.set(STORAGE_KEYS.ITEM_REQUESTS, filtered);
    return true;
  },
};

// Purchase Order API
export const purchaseOrderApi = {
  getAll: (): PurchaseOrder[] => {
    return storage.get<PurchaseOrder[]>(STORAGE_KEYS.PURCHASE_ORDERS) || [];
  },

  getById: (id: string): PurchaseOrder | undefined => {
    const records = purchaseOrderApi.getAll();
    return records.find(r => r.id === id);
  },

  create: (data: Omit<PurchaseOrder, 'id' | 'transactionNumber' | 'status' | 'createdAt' | 'updatedAt'>): PurchaseOrder => {
    const records = purchaseOrderApi.getAll();
    const newRecord: PurchaseOrder = {
      ...data,
      id: generateId(),
      transactionNumber: generateTransactionNumber('PO'),
      status: 'DRAFT',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    storage.set(STORAGE_KEYS.PURCHASE_ORDERS, [...records, newRecord]);
    return newRecord;
  },

  update: (id: string, updates: Partial<PurchaseOrder>): PurchaseOrder | undefined => {
    const records = purchaseOrderApi.getAll();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    if (records[index].status === 'APPROVED') return undefined;

    const updated = {
      ...records[index],
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };
    records[index] = updated;
    storage.set(STORAGE_KEYS.PURCHASE_ORDERS, records);
    return updated;
  },

  submit: (id: string): PurchaseOrder | undefined => {
    return purchaseOrderApi.update(id, { 
      status: 'WAITING_APPROVAL',
      submittedAt: getCurrentTimestamp(),
    });
  },

  approve: (id: string, userId: string, signatureImage: string): PurchaseOrder | undefined => {
    const record = purchaseOrderApi.getById(id);
    if (!record || record.status !== 'WAITING_APPROVAL') return undefined;

    const updated = purchaseOrderApi.update(id, {
      status: 'APPROVED',
      approvedBy: userId,
      approvedAt: getCurrentTimestamp(),
      signatureImage,
      receivedAt: getCurrentTimestamp(),
      receivedBy: userId,
    });

    if (updated) {
      updated.items.forEach(item => {
        const existingItem = itemApi.getById(item.itemId);
        if (existingItem) {
          itemApi.updateStock(item.itemId, item.quantity);
          stockMovementApi.create({
            itemId: item.itemId,
            transactionType: 'purchase',
            transactionId: updated.id,
            transactionNumber: updated.transactionNumber,
            quantityChange: item.quantity,
            previousStock: existingItem.stock,
            newStock: existingItem.stock + item.quantity,
            createdBy: userId,
          });
        }
      });
    }

    return updated;
  },

  reject: (id: string, userId: string, reason: string): PurchaseOrder | undefined => {
    return purchaseOrderApi.update(id, {
      status: 'REJECTED',
      rejectedBy: userId,
      rejectedAt: getCurrentTimestamp(),
      rejectionReason: reason,
    });
  },

  delete: (id: string): boolean => {
    const records = purchaseOrderApi.getAll();
    const record = records.find(r => r.id === id);
    if (!record || record.status !== 'DRAFT') return false;

    const filtered = records.filter(r => r.id !== id);
    storage.set(STORAGE_KEYS.PURCHASE_ORDERS, filtered);
    return true;
  },
};

// Stock Movement API
export const stockMovementApi = {
  getAll: (): StockMovement[] => {
    return storage.get<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS) || [];
  },

  getByItemId: (itemId: string): StockMovement[] => {
    const movements = stockMovementApi.getAll();
    return movements.filter(m => m.itemId === itemId);
  },

  create: (data: Omit<StockMovement, 'id' | 'createdAt'>): StockMovement => {
    const movements = stockMovementApi.getAll();
    const newMovement: StockMovement = {
      ...data,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
    };
    storage.set(STORAGE_KEYS.STOCK_MOVEMENTS, [...movements, newMovement]);
    return newMovement;
  },
};

// Auth API
export const authApi = {
  login: (username: string, password: string): User | null => {
    const user = userApi.getByUsername(username);
    if (user && user.password === password) {
      storage.set(STORAGE_KEYS.CURRENT_USER, user);
      return user;
    }
    return null;
  },

  logout: (): void => {
    storage.remove(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    return storage.get<User>(STORAGE_KEYS.CURRENT_USER);
  },
};
