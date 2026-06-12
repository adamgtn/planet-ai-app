import { products } from "./mockData";

export type AdminRole = "super_admin" | "admin";

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  lastLoginAt: string;
  active: boolean;
};

export const ADMIN_PERMISSIONS: Record<
  AdminRole,
  {
    label: string;
    description: string;
    capabilities: string[];
  }
> = {
  super_admin: {
    label: "Super Admin",
    description: "Akses penuh termasuk mengelola admin lain.",
    capabilities: [
      "Mengelola Member",
      "Mengelola Produk",
      "Melihat Analytics",
      "Menambah & menghapus Admin",
      "Mengubah role admin",
    ],
  },
  admin: {
    label: "Admin",
    description: "Hanya mengelola member dan produk.",
    capabilities: [
      "Mengelola Member",
      "Mengelola Produk",
      "Melihat Analytics",
    ],
  },
};

export const adminAccounts: AdminAccount[] = [
  {
    id: "adm_001",
    name: "Adam Hidayat",
    email: "adam@planet-ai.id",
    role: "super_admin",
    createdAt: "2025-09-01",
    lastLoginAt: "2026-05-08 09:14",
    active: true,
  },
  {
    id: "adm_002",
    name: "Rini Kartika",
    email: "rini.k@planet-ai.id",
    role: "admin",
    createdAt: "2026-01-15",
    lastLoginAt: "2026-05-08 07:22",
    active: true,
  },
  {
    id: "adm_003",
    name: "Yoga Pratama",
    email: "yoga.p@planet-ai.id",
    role: "admin",
    createdAt: "2026-02-28",
    lastLoginAt: "2026-05-07 18:40",
    active: true,
  },
  {
    id: "adm_004",
    name: "Lia Anjani",
    email: "lia.a@planet-ai.id",
    role: "admin",
    createdAt: "2026-03-22",
    lastLoginAt: "2026-04-30 10:05",
    active: false,
  },
];

export type UserStatus = "active" | "suspended" | "expired";

/** Paket yang dibeli member (kosong = belum diketahui / akun lama). */
export type UserTier = "starter" | "vip" | "aplikasi";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  tier?: UserTier;
  joinedAt: string;
  lastLoginAt: string;
  permissions: string[]; // product IDs
};

export const adminUsers: AdminUser[] = [
  {
    id: "u_001",
    name: "Adam Hidayat",
    email: "adam@planet-ai.id",
    status: "active",
    joinedAt: "2026-01-12",
    lastLoginAt: "2026-05-08 09:14",
    permissions: ["prompt-engineering-mastery", "ai-automation-blueprint"],
  },
  {
    id: "u_002",
    name: "Sinta Maharani",
    email: "sinta.m@gmail.com",
    status: "active",
    joinedAt: "2026-02-03",
    lastLoginAt: "2026-05-07 21:42",
    permissions: ["prompt-engineering-mastery"],
  },
  {
    id: "u_003",
    name: "Bagus Pratama",
    email: "bagus.p@gmail.com",
    status: "active",
    joinedAt: "2026-02-19",
    lastLoginAt: "2026-05-08 08:01",
    permissions: [
      "prompt-engineering-mastery",
      "ai-automation-blueprint",
      "ai-content-creator",
    ],
  },
  {
    id: "u_004",
    name: "Devi Anggraini",
    email: "devianggraini@gmail.com",
    status: "expired",
    joinedAt: "2025-11-05",
    lastLoginAt: "2026-04-12 17:20",
    permissions: ["data-analyst-with-ai"],
  },
  {
    id: "u_005",
    name: "Rizky Aditya",
    email: "rizky.aditya@yahoo.com",
    status: "suspended",
    joinedAt: "2026-03-08",
    lastLoginAt: "2026-04-30 11:09",
    permissions: ["ai-automation-blueprint"],
  },
  {
    id: "u_006",
    name: "Maya Lestari",
    email: "maya@designstudio.id",
    status: "active",
    joinedAt: "2026-03-15",
    lastLoginAt: "2026-05-07 14:55",
    permissions: ["ai-image-generation"],
  },
  {
    id: "u_007",
    name: "Fajar Nugroho",
    email: "fajar.n@startup.id",
    status: "active",
    joinedAt: "2026-04-02",
    lastLoginAt: "2026-05-08 07:33",
    permissions: ["build-ai-saas", "prompt-engineering-mastery"],
  },
  {
    id: "u_008",
    name: "Kintan Permata",
    email: "kintan.p@outlook.com",
    status: "active",
    joinedAt: "2026-04-21",
    lastLoginAt: "2026-05-06 19:12",
    permissions: ["ai-content-creator"],
  },
];

export type ProductMetric = {
  productId: string;
  visits: number;
  clicks: number;
  uniqueVisitors: number;
  conversionRate: number; // %
  avgWatchMinutes: number;
};

export const productMetrics: ProductMetric[] = [
  {
    productId: "prompt-engineering-mastery",
    visits: 4820,
    clicks: 3120,
    uniqueVisitors: 2310,
    conversionRate: 8.4,
    avgWatchMinutes: 38,
  },
  {
    productId: "ai-automation-blueprint",
    visits: 3015,
    clicks: 1842,
    uniqueVisitors: 1576,
    conversionRate: 6.1,
    avgWatchMinutes: 27,
  },
  {
    productId: "build-ai-saas",
    visits: 2440,
    clicks: 1188,
    uniqueVisitors: 1320,
    conversionRate: 4.2,
    avgWatchMinutes: 18,
  },
  {
    productId: "ai-content-creator",
    visits: 3680,
    clicks: 2104,
    uniqueVisitors: 1890,
    conversionRate: 7.5,
    avgWatchMinutes: 21,
  },
  {
    productId: "data-analyst-with-ai",
    visits: 1985,
    clicks: 922,
    uniqueVisitors: 1124,
    conversionRate: 3.6,
    avgWatchMinutes: 14,
  },
  {
    productId: "ai-image-generation",
    visits: 4140,
    clicks: 2680,
    uniqueVisitors: 2055,
    conversionRate: 9.1,
    avgWatchMinutes: 33,
  },
];

// Visits per day, last 14 days (oldest → newest)
export const dailyVisits = [
  { date: "Apr 25", visits: 612, clicks: 318 },
  { date: "Apr 26", visits: 705, clicks: 402 },
  { date: "Apr 27", visits: 580, clicks: 297 },
  { date: "Apr 28", visits: 642, clicks: 356 },
  { date: "Apr 29", visits: 798, clicks: 445 },
  { date: "Apr 30", visits: 851, clicks: 502 },
  { date: "May 01", visits: 920, clicks: 567 },
  { date: "May 02", visits: 1035, clicks: 612 },
  { date: "May 03", visits: 988, clicks: 590 },
  { date: "May 04", visits: 1142, clicks: 698 },
  { date: "May 05", visits: 1205, clicks: 752 },
  { date: "May 06", visits: 1340, clicks: 824 },
  { date: "May 07", visits: 1418, clicks: 901 },
  { date: "May 08", visits: 980, clicks: 624 },
];

export type ActivityEntry = {
  id: string;
  user: string;
  action: string;
  detail: string;
  time: string;
};

export const recentActivities: ActivityEntry[] = [
  {
    id: "a1",
    user: "Bagus Pratama",
    action: "Menyelesaikan",
    detail: "Lesson 'Anatomi Prompt yang Efektif'",
    time: "2 menit lalu",
  },
  {
    id: "a2",
    user: "Sinta Maharani",
    action: "Login",
    detail: "dari Jakarta, Indonesia",
    time: "12 menit lalu",
  },
  {
    id: "a3",
    user: "Maya Lestari",
    action: "Mengakses",
    detail: "AI Image Generation Pro",
    time: "26 menit lalu",
  },
  {
    id: "a4",
    user: "Admin PlanetSoft",
    action: "Menambahkan permission",
    detail: "Build Your First AI SaaS → Fajar Nugroho",
    time: "1 jam lalu",
  },
  {
    id: "a5",
    user: "Kintan Permata",
    action: "Mengunduh materi",
    detail: "Template-Prompt.docx",
    time: "3 jam lalu",
  },
  {
    id: "a6",
    user: "Admin PlanetSoft",
    action: "Membuat akun baru",
    detail: "kintan.p@outlook.com",
    time: "Kemarin",
  },
];

export const adminProductSummary = products.map((p) => {
  const metric = productMetrics.find((m) => m.productId === p.id);
  const owners = adminUsers.filter((u) => u.permissions.includes(p.id)).length;
  return {
    ...p,
    visits: metric?.visits ?? 0,
    clicks: metric?.clicks ?? 0,
    uniqueVisitors: metric?.uniqueVisitors ?? 0,
    conversionRate: metric?.conversionRate ?? 0,
    owners,
  };
});

export const totals = {
  members: adminUsers.length,
  activeMembers: adminUsers.filter((u) => u.status === "active").length,
  totalProducts: products.length,
  visits30d: dailyVisits.reduce((sum, d) => sum + d.visits, 0),
  clicks30d: dailyVisits.reduce((sum, d) => sum + d.clicks, 0),
};
