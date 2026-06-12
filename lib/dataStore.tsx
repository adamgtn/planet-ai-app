"use client";

/**
 * DataStore — bridge dari API yang dipakai komponen ke PocketBase.
 *
 * API surface tetap sama dengan versi localStorage sebelumnya
 * (useDataStore, useProduct, useUser, upsertProduct, dst) supaya komponen
 * existing tidak perlu berubah banyak. Yang berbeda: state diisi async dari
 * PocketBase, mutasi langsung tulis ke PocketBase, dan ada flag `loading`.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Lesson, Module, Product, Resource } from "./mockData";
import type { AdminUser, UserStatus, UserTier } from "./adminData";
import { getPB } from "./pocketbase";
import { useAuth } from "./auth";

// ─────────────────────────────────────────────────────────────────────────────
// Mappers — convert antara bentuk PocketBase record ↔ tipe app

type PBProduct = {
  id: string;
  collectionId?: string;
  collectionName?: string;
  slug: string;
  title: string;
  tagline: string;
  level: Product["level"];
  duration: string;
  lesson_count: number;
  cover: string;
  /** URL legacy / external (text field). */
  image: string;
  /** Filename file yang ter-upload ke PB Storage. */
  image_file?: string;
  landing_url: string;
  price?: string;
  status: "draft" | "published" | "archived";
};

type PBPermission = {
  id: string;
  user: string;
  product: string;
  status: "active" | "expired";
  granted_at?: string;
  expires_at?: string;
  progress?: number;
};

type PBUserRecord = {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "member" | "vip";
  status: UserStatus;
  tier?: UserTier;
  last_login_at?: string;
  created: string;
};

function pbToProduct(
  rec: PBProduct,
  status: Product["status"] = "locked",
  progress = 0,
  modules: Module[] = []
): Product {
  // Prefer image_file (real upload di PB Storage) over image text field
  // (legacy / external URL). Image yang isinya "blob:..." dianggap invalid
  // (legacy bug — sebelum field image_file ada).
  let imageUrl = "";
  if (rec.image_file && rec.collectionId) {
    imageUrl = `https://db.planet-ai.tech/api/files/${rec.collectionId}/${rec.id}/${rec.image_file}`;
  } else if (rec.image && !rec.image.startsWith("blob:")) {
    imageUrl = rec.image;
  }
  return {
    id: rec.slug || rec.id,
    title: rec.title,
    tagline: rec.tagline,
    level: rec.level,
    duration: rec.duration,
    lessonCount: rec.lesson_count,
    cover: rec.cover,
    image: imageUrl,
    landingUrl: rec.landing_url,
    price: rec.price,
    status,
    progress,
    modules,
  };
}

function pbToUser(rec: PBUserRecord, permissions: string[] = []): AdminUser {
  return {
    id: rec.id,
    name: rec.name,
    email: rec.email,
    status: rec.status ?? "active",
    tier: rec.tier || undefined,
    permissions,
    joinedAt: rec.created?.slice(0, 10) ?? "—",
    lastLoginAt: rec.last_login_at?.replace("T", " ").slice(0, 16) ?? "—",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Context

type Ctx = {
  products: Product[];
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  upsertProduct: (p: Product) => Promise<void>;
  removeProduct: (idOrSlug: string) => Promise<void>;
  upsertUser: (u: AdminUser, password?: string) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  setUserPermissions: (userId: string, productSlugs: string[]) => Promise<void>;
};

const StoreContext = createContext<Ctx | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider

export function DataStoreProvider({ children }: { children: React.ReactNode }) {
  const { user: currentUser, isAuthenticated, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!isAuthenticated) {
      setProducts([]);
      setUsers([]);
      return;
    }

    const pb = getPB();
    setLoading(true);
    setError(null);

    try {
      // Fetch produk + permission user yang sedang login secara paralel
      const [pbProducts, pbPermissions] = await Promise.all([
        pb
          .collection("products")
          .getFullList<PBProduct>({ sort: "-id", requestKey: null }),
        pb
          .collection("permissions")
          .getFullList<PBPermission>({
            filter: currentUser ? `user = "${currentUser.id}"` : "id = ''",
            requestKey: null,
          }),
      ]);

      // Index permission by product id (PocketBase id, bukan slug)
      const permByProductId = new Map<string, PBPermission>();
      for (const p of pbPermissions) permByProductId.set(p.product, p);

      const productList: Product[] = pbProducts.map((rec) => {
        // Admin & Super Admin bypass permission — semua produk tampil
        // sebagai "purchased" sehingga bisa preview/review tanpa hambatan.
        if (isAdmin) {
          return pbToProduct(rec, "purchased", 100);
        }
        const perm = permByProductId.get(rec.id);
        let status: Product["status"] = "locked";
        if (perm) {
          status = perm.status === "expired" ? "expired" : "purchased";
        }
        const progress = perm?.progress ?? 0;
        return pbToProduct(rec, status, progress);
      });

      setProducts(productList);

      // Users hanya bisa diambil oleh admin (sesuai rules PocketBase).
      // Filter role member ATAU vip agar admin/super_admin tidak muncul di
      // halaman Member — tapi member VIP (role="vip") tetap tampil.
      if (isAdmin) {
        const [pbUsers, allPermissions] = await Promise.all([
          pb
            .collection("users")
            .getFullList<PBUserRecord>({
              filter: 'role = "member" || role = "vip"',
              sort: "-id",
              requestKey: null,
            }),
          pb
            .collection("permissions")
            .getFullList<PBPermission>({ requestKey: null }),
        ]);

        // Map slug per product id (untuk balikkan ke slug-based id di app)
        const slugByProductId = new Map(pbProducts.map((p) => [p.id, p.slug]));

        const permsByUser = new Map<string, string[]>();
        for (const perm of allPermissions) {
          const arr = permsByUser.get(perm.user) ?? [];
          const slug = slugByProductId.get(perm.product);
          if (slug) arr.push(slug);
          permsByUser.set(perm.user, arr);
        }

        setUsers(
          pbUsers.map((rec) => pbToUser(rec, permsByUser.get(rec.id) ?? []))
        );
      } else {
        setUsers([]);
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Gagal memuat data dari PocketBase";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin, currentUser]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ─── Product mutations ────────────────────────────────────────────────────

  const upsertProduct = useCallback(
    async (p: Product) => {
      const pb = getPB();

      // Field text yang aman dikirim sebagai JSON. Image text field di-clear
      // kalau ada pendingImageFile (akan diganti oleh image_file). Kalau
      // image string adalah blob URL (legacy), juga di-clear.
      const cleanImage =
        p._pendingImageFile || p.image.startsWith("blob:") ? "" : p.image;

      const basePayload: Partial<PBProduct> = {
        slug: p.id,
        title: p.title,
        tagline: p.tagline,
        level: p.level,
        duration: p.duration,
        lesson_count: p.lessonCount,
        cover: p.cover,
        image: cleanImage,
        landing_url: p.landingUrl,
        price: p.price,
        status: "published",
      };

      // Kalau ada file baru, gunakan FormData supaya PocketBase nyimpan file
      // ke Storage. Field 'image_file' butuh multipart.
      const buildPayload = (): Partial<PBProduct> | FormData => {
        if (!p._pendingImageFile) return basePayload;
        const fd = new FormData();
        for (const [k, v] of Object.entries(basePayload)) {
          if (v !== undefined && v !== null) fd.append(k, String(v));
        }
        fd.append("image_file", p._pendingImageFile);
        return fd;
      };

      // 1. Upsert main product
      const existing = await pb
        .collection("products")
        .getFullList<PBProduct>({
          filter: `slug = "${p.id}"`,
          requestKey: null,
        });

      let productPbId: string;
      if (existing.length > 0) {
        productPbId = existing[0].id;
        await pb
          .collection("products")
          .update(productPbId, buildPayload() as never);
      } else {
        const created = await pb
          .collection("products")
          .create(buildPayload() as never);
        productPbId = created.id;
      }

      // 2. Sync curriculum: hapus semua module existing (cascade-delete
      //    lessons + resources), lalu rebuild dari payload.
      const oldModules = await pb
        .collection("modules")
        .getFullList<{ id: string }>({
          filter: `product = "${productPbId}"`,
          requestKey: null,
        });
      for (const m of oldModules) {
        await pb.collection("modules").delete(m.id);
      }

      // 3. Recreate modul → lesson → resource sesuai urutan di form
      for (let mIdx = 0; mIdx < p.modules.length; mIdx++) {
        const mod = p.modules[mIdx];
        const newModule = await pb.collection("modules").create({
          product: productPbId,
          title: mod.title,
          order: mIdx + 1,
        });

        for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
          const lesson = mod.lessons[lIdx];
          const newLesson = await pb.collection("lessons").create({
            module: newModule.id,
            title: lesson.title,
            duration: lesson.duration,
            video_url: lesson.videoUrl,
            description: lesson.description,
            order: lIdx + 1,
          });

          for (const res of lesson.resources) {
            // Kalau user upload file baru → kirim sebagai FormData
            // (PocketBase butuh multipart untuk simpan File ke field 'file')
            if (res._pendingFile) {
              const fd = new FormData();
              fd.append("lesson", newLesson.id);
              fd.append("name", res.name || res._pendingFile.name);
              fd.append("type", res.type);
              fd.append("size", res.size);
              fd.append("file", res._pendingFile);
              await pb.collection("resources").create(fd);
            } else {
              await pb.collection("resources").create({
                lesson: newLesson.id,
                name: res.name,
                type: res.type,
                size: res.size,
                url: res.url,
              });
            }
          }
        }
      }

      await fetchAll();
    },
    [fetchAll]
  );

  const removeProduct = useCallback(
    async (idOrSlug: string) => {
      const pb = getPB();
      const list = await pb.collection("products").getFullList<PBProduct>({
        filter: `slug = "${idOrSlug}"`,
        requestKey: null,
      });
      if (list[0]) await pb.collection("products").delete(list[0].id);
      await fetchAll();
    },
    [fetchAll]
  );

  // ─── User mutations ───────────────────────────────────────────────────────

  const upsertUser = useCallback(
    async (u: AdminUser, password?: string) => {
      const pb = getPB();
      // Update payload — JANGAN include role agar role existing tidak
      // ter-overwrite (super_admin yang ke-edit lewat halaman member tidak
      // ke-demote).
      const updatePayload: Record<string, unknown> = {
        name: u.name,
        email: u.email,
        status: u.status,
      };

      const existing = await pb
        .collection("users")
        .getFullList<PBUserRecord>({
          filter: `id = "${u.id}"`,
          requestKey: null,
        });

      let userId = u.id;
      if (existing.length > 0) {
        await pb.collection("users").update(u.id, updatePayload);
      } else {
        const pwd = password || "change-me-12345";
        const created = await pb.collection("users").create({
          ...updatePayload,
          role: "member", // Hanya saat CREATE — form ini khusus member
          password: pwd,
          passwordConfirm: pwd,
          emailVisibility: true,
        });
        userId = created.id;
      }

      // Sync permissions
      await syncPermissions(userId, u.permissions);
      await fetchAll();
    },
    [fetchAll]
  );

  const removeUser = useCallback(
    async (id: string) => {
      const pb = getPB();
      await pb.collection("users").delete(id);
      await fetchAll();
    },
    [fetchAll]
  );

  const setUserPermissions = useCallback(
    async (userId: string, productSlugs: string[]) => {
      await syncPermissions(userId, productSlugs);
      await fetchAll();
    },
    [fetchAll]
  );

  const value = useMemo<Ctx>(
    () => ({
      products,
      users,
      loading,
      error,
      reload: fetchAll,
      upsertProduct,
      removeProduct,
      upsertUser,
      removeUser,
      setUserPermissions,
    }),
    [
      products,
      users,
      loading,
      error,
      fetchAll,
      upsertProduct,
      removeProduct,
      upsertUser,
      removeUser,
      setUserPermissions,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

// Helper untuk sync permission user ↔ product slugs
async function syncPermissions(userId: string, productSlugs: string[]) {
  const pb = getPB();
  const products = await pb.collection("products").getFullList<PBProduct>({
    requestKey: null,
  });
  const slugToId = new Map(products.map((p) => [p.slug, p.id]));
  const targetIds = productSlugs
    .map((s) => slugToId.get(s))
    .filter((x): x is string => !!x);

  const existing = await pb
    .collection("permissions")
    .getFullList<PBPermission>({
      filter: `user = "${userId}"`,
      requestKey: null,
    });

  const existingIds = new Set(existing.map((p) => p.product));
  const targetSet = new Set(targetIds);

  // Remove permissions yang sudah tidak ada
  for (const p of existing) {
    if (!targetSet.has(p.product)) {
      await pb.collection("permissions").delete(p.id);
    }
  }
  // Add permissions baru
  for (const productId of targetIds) {
    if (!existingIds.has(productId)) {
      await pb.collection("permissions").create({
        user: userId,
        product: productId,
        status: "active",
        granted_at: new Date().toISOString(),
      });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Hooks

export function useDataStore(): Ctx {
  const ctx = useContext(StoreContext);
  if (!ctx)
    throw new Error("useDataStore must be used within DataStoreProvider");
  return ctx;
}

export function useProduct(idOrSlug: string) {
  const { products } = useDataStore();
  return products.find((p) => p.id === idOrSlug);
}

export function useUser(id: string) {
  const { users } = useDataStore();
  return users.find((u) => u.id === id);
}

/**
 * Load full curriculum tree (modules → lessons → resources) untuk sebuah
 * produk. Dipakai di halaman /learn untuk menampilkan video + materi.
 */
export function useProductCurriculum(productSlug: string | undefined) {
  const [data, setData] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productSlug) return;
    let cancelled = false;
    const pb = getPB();

    (async () => {
      setLoading(true);
      try {
        const productMatches = await pb
          .collection("products")
          .getFullList<PBProduct>({
            filter: `slug = "${productSlug}"`,
            requestKey: null,
          });
        const product = productMatches[0];
        if (!product) {
          setData([]);
          return;
        }

        const modules = await pb
          .collection("modules")
          .getFullList<{ id: string; title: string; order?: number }>({
            filter: `product = "${product.id}"`,
            sort: "order",
            requestKey: null,
          });

        if (modules.length === 0) {
          setData([]);
          return;
        }

        const moduleIdFilter = modules
          .map((m) => `module = "${m.id}"`)
          .join(" || ");
        const lessons = await pb
          .collection("lessons")
          .getFullList<{
            id: string;
            module: string;
            title: string;
            duration: string;
            video_url: string;
            description: string;
            order?: number;
          }>({
            filter: moduleIdFilter,
            sort: "order",
            requestKey: null,
          });

        let resources: {
          id: string;
          collectionId: string;
          lesson: string;
          name: string;
          type: string;
          size: string;
          url?: string;
          file?: string;
        }[] = [];
        if (lessons.length > 0) {
          const lessonIdFilter = lessons
            .map((l) => `lesson = "${l.id}"`)
            .join(" || ");
          resources = await pb
            .collection("resources")
            .getFullList({
              filter: lessonIdFilter,
              requestKey: null,
            });
        }

        const resourcesByLesson = new Map<string, Resource[]>();
        for (const r of resources) {
          const arr = resourcesByLesson.get(r.lesson) ?? [];
          // Kalau record punya file di PB Storage, build URL download-nya
          const fileUrl = r.file
            ? `${pb.baseUrl}/api/files/${r.collectionId}/${r.id}/${r.file}`
            : undefined;
          arr.push({
            name: r.name,
            type: r.type,
            size: r.size,
            url: r.url || fileUrl,
          });
          resourcesByLesson.set(r.lesson, arr);
        }

        const lessonsByModule = new Map<string, Lesson[]>();
        for (const l of lessons) {
          const arr = lessonsByModule.get(l.module) ?? [];
          arr.push({
            id: l.id,
            title: l.title,
            duration: l.duration,
            videoUrl: l.video_url,
            description: l.description,
            resources: resourcesByLesson.get(l.id) ?? [],
          });
          lessonsByModule.set(l.module, arr);
        }

        const result: Module[] = modules.map((m) => ({
          id: m.id,
          title: m.title,
          lessons: lessonsByModule.get(m.id) ?? [],
        }));

        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Gagal memuat kurikulum"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productSlug]);

  return { modules: data, loading, error };
}

export function makeId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}
