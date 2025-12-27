import { 
  User, 
  Category, 
  Item, 
  Supplier, 
  STORAGE_KEYS 
} from '@/types';
import { storage, generateId, getCurrentTimestamp } from './storage';

// Seed Users
const seedUsers: User[] = [
  {
    id: generateId(),
    username: 'admin',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
  {
    id: generateId(),
    username: 'warehouse',
    password: 'warehouse123',
    name: 'Warehouse Staff',
    role: 'warehouse_staff',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
  {
    id: generateId(),
    username: 'dept_it',
    password: 'dept123',
    name: 'IT Department User',
    role: 'department_user',
    department: 'IT Department',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
  {
    id: generateId(),
    username: 'dept_hr',
    password: 'dept123',
    name: 'HR Department User',
    role: 'department_user',
    department: 'HR Department',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
  {
    id: generateId(),
    username: 'head_warehouse',
    password: 'head123',
    name: 'Head of Warehouse',
    role: 'head_of_warehouse',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
];

// Seed Categories
const seedCategories: Category[] = [
  {
    id: generateId(),
    name: 'Office Supplies',
    description: 'General office supplies and stationery',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
  {
    id: generateId(),
    name: 'Electronics',
    description: 'Electronic devices and components',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
  {
    id: generateId(),
    name: 'Furniture',
    description: 'Office furniture and fixtures',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
  {
    id: generateId(),
    name: 'Cleaning Supplies',
    description: 'Cleaning materials and equipment',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
];

// Seed Suppliers
const seedSuppliers: Supplier[] = [
  {
    id: generateId(),
    name: 'PT. Office Pro',
    address: 'Jl. Sudirman No. 123, Jakarta',
    phone: '021-5551234',
    email: 'sales@officepro.co.id',
    contactPerson: 'Budi Santoso',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
  {
    id: generateId(),
    name: 'CV. Tech Solutions',
    address: 'Jl. Gatot Subroto No. 45, Bandung',
    phone: '022-4445678',
    email: 'info@techsolutions.co.id',
    contactPerson: 'Andi Wijaya',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
  {
    id: generateId(),
    name: 'UD. Furniture Jaya',
    address: 'Jl. Ahmad Yani No. 67, Surabaya',
    phone: '031-3339012',
    email: 'order@furniturejaya.co.id',
    contactPerson: 'Dewi Lestari',
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  },
];

// Seed Items (will reference categories after seeding)
const createSeedItems = (categories: Category[]): Item[] => {
  const officeCategory = categories.find(c => c.name === 'Office Supplies');
  const electronicsCategory = categories.find(c => c.name === 'Electronics');
  const furnitureCategory = categories.find(c => c.name === 'Furniture');
  const cleaningCategory = categories.find(c => c.name === 'Cleaning Supplies');

  return [
    {
      id: generateId(),
      code: 'OFF-001',
      name: 'A4 Paper (Rim)',
      categoryId: officeCategory?.id || '',
      unit: 'Rim',
      stock: 50,
      minStock: 20,
      location: 'Rack A-1',
      description: 'A4 size paper, 80gsm, 500 sheets per rim',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      code: 'OFF-002',
      name: 'Ballpoint Pen (Box)',
      categoryId: officeCategory?.id || '',
      unit: 'Box',
      stock: 30,
      minStock: 10,
      location: 'Rack A-2',
      description: 'Blue ballpoint pens, 12 pcs per box',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      code: 'OFF-003',
      name: 'Stapler',
      categoryId: officeCategory?.id || '',
      unit: 'Pcs',
      stock: 15,
      minStock: 5,
      location: 'Rack A-3',
      description: 'Standard office stapler',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      code: 'ELC-001',
      name: 'USB Flash Drive 32GB',
      categoryId: electronicsCategory?.id || '',
      unit: 'Pcs',
      stock: 25,
      minStock: 10,
      location: 'Rack B-1',
      description: 'USB 3.0 flash drive, 32GB capacity',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      code: 'ELC-002',
      name: 'Wireless Mouse',
      categoryId: electronicsCategory?.id || '',
      unit: 'Pcs',
      stock: 8,
      minStock: 5,
      location: 'Rack B-2',
      description: 'Wireless optical mouse with USB receiver',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      code: 'ELC-003',
      name: 'Keyboard USB',
      categoryId: electronicsCategory?.id || '',
      unit: 'Pcs',
      stock: 3,
      minStock: 5,
      location: 'Rack B-3',
      description: 'Standard USB keyboard',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      code: 'FRN-001',
      name: 'Office Chair',
      categoryId: furnitureCategory?.id || '',
      unit: 'Pcs',
      stock: 10,
      minStock: 3,
      location: 'Warehouse C',
      description: 'Ergonomic office chair with armrest',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      code: 'FRN-002',
      name: 'Office Desk',
      categoryId: furnitureCategory?.id || '',
      unit: 'Pcs',
      stock: 5,
      minStock: 2,
      location: 'Warehouse C',
      description: 'Standard office desk 120x60cm',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      code: 'CLN-001',
      name: 'Floor Cleaner (Liter)',
      categoryId: cleaningCategory?.id || '',
      unit: 'Liter',
      stock: 20,
      minStock: 10,
      location: 'Rack D-1',
      description: 'Multi-surface floor cleaner',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      code: 'CLN-002',
      name: 'Trash Bags (Roll)',
      categoryId: cleaningCategory?.id || '',
      unit: 'Roll',
      stock: 40,
      minStock: 15,
      location: 'Rack D-2',
      description: 'Large trash bags, 30 pcs per roll',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    },
  ];
};

export const seedData = (): void => {
  // Check if already seeded
  const existingUsers = storage.get(STORAGE_KEYS.USERS);
  if (existingUsers) {
    console.log('Data already seeded');
    return;
  }

  // Seed in order
  storage.set(STORAGE_KEYS.USERS, seedUsers);
  storage.set(STORAGE_KEYS.CATEGORIES, seedCategories);
  storage.set(STORAGE_KEYS.SUPPLIERS, seedSuppliers);
  storage.set(STORAGE_KEYS.ITEMS, createSeedItems(seedCategories));
  storage.set(STORAGE_KEYS.INCOMING_GOODS, []);
  storage.set(STORAGE_KEYS.OUTGOING_GOODS, []);
  storage.set(STORAGE_KEYS.ITEM_REQUESTS, []);
  storage.set(STORAGE_KEYS.PURCHASE_ORDERS, []);
  storage.set(STORAGE_KEYS.STOCK_MOVEMENTS, []);

  console.log('Seed data created successfully');
  console.log('Demo credentials:');
  console.log('- Admin: admin / admin123');
  console.log('- Warehouse: warehouse / warehouse123');
  console.log('- Department: dept_it / dept123 or dept_hr / dept123');
  console.log('- Head of Warehouse: head_warehouse / head123');
};

export const resetData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    storage.remove(key);
  });
  seedData();
};
