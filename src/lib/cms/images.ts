// CMS image storage: frontend-only stage.
//
// Uploaded image files persist in this browser's IndexedDB ("mph-cms-images")
// as blobs, keyed by id. Seeded images keep their original remote URL in
// `CmsImage.src` until an admin replaces them with an upload. The interface
// mirrors the future storage backend so the adapter can be swapped without
// touching editors or views.

export interface StoredImage {
  key: string;
  blob: Blob;
  type: string;
  name: string;
}

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";
export const IMAGE_MAX_BYTES = 2 * 1024 * 1024;
export const IMAGE_TYPES_LABEL = "PNG, JPEG or WebP up to 2 MB";

const DB_NAME = "mph-cms-images";
const STORE = "images";

function isStorageAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}

function withDb<TResult>(
  action: (
    db: IDBDatabase,
    resolve: (value: TResult) => void,
    reject: (reason: unknown) => void,
  ) => void,
): Promise<TResult> {
  return new Promise<TResult>((resolve, reject) => {
    if (!isStorageAvailable()) {
      reject(new Error("Image storage is not available in this browser."));
      return;
    }
    const open = indexedDB.open(DB_NAME, 1);
    open.onupgradeneeded = () => {
      if (!open.result.objectStoreNames.contains(STORE)) {
        open.result.createObjectStore(STORE, { keyPath: "key" });
      }
    };
    open.onsuccess = () => {
      try {
        action(open.result, resolve, reject);
      } catch (error) {
        reject(error);
      } finally {
        open.result.close();
      }
    };
    open.onerror = () => reject(new Error("Image storage is unavailable."));
  });
}

/** Raised by a selected file that fails type or size validation. */
export class ImageFileError extends Error {}

/** Validates a selected image file against the accepted types and size cap. */
export function validateImageFile(file: File): void {
  if (!IMAGE_ACCEPT.split(",").includes(file.type)) {
    throw new Error("Choose a PNG, JPEG or WebP image.");
  }
  if (file.size > IMAGE_MAX_BYTES) {
    throw new Error("Image must be 2 MB or smaller.");
  }
}

/** Saves an uploaded image and returns the id it can be referenced by. */
export async function putImage(file: File, idFallback = "img"): Promise<string> {
  validateImageFile(file);
  return withDb<string>((db, resolve, reject) => {
    const id = computeKey(idFallback);
    if (id === "error") {
      reject(new Error("Image id could not be generated."));
      return;
    }
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({
      key: id,
      blob: file,
      type: file.type,
      name: file.name,
      createdAt: Date.now(),
    });
    tx.oncomplete = () => resolve(id);
    tx.onerror = () => reject(new Error("The image could not be stored."));
    tx.onabort = () => reject(new Error("The image could not be stored."));
  });
}

function computeKey(idFallback: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${idFallback}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${idFallback}-${Math.floor(Math.random() * 1e8)}`;
}

/** Per-object URLs for stored images, resolved lazily and cached per key. */
const objectUrlCache = new Map<string, string>();

export async function getImageUrl(key: string): Promise<string> {
  const cached = objectUrlCache.get(key);
  if (cached) return cached;
  const blob = await getImageBlob(key);
  if (!blob) throw new Error("Stored image not found.");
  const url = URL.createObjectURL(blob);
  objectUrlCache.set(key, url);
  return url;
}

export async function getImageBlob(key: string): Promise<Blob | null> {
  return withDb<Blob | null>((db, resolve, reject) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
    request.onsuccess = () => {
      const record = request.result as StoredImage | undefined;
      resolve(record ? record.blob : null);
    };
    request.onerror = () => reject(new Error("Stored image could not be read."));
  });
}

/** Drops a stored image and releases any live preview URL. */
export async function deleteImage(key: string): Promise<void> {
  if (objectUrlCache.has(key)) {
    URL.revokeObjectURL(objectUrlCache.get(key) as string);
    objectUrlCache.delete(key);
  }
  await withDb<void>((db, resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(new Error("Stored image could not be removed."));
  });
}

/**
 * Deletes stored uploads that are no longer referenced by a saved section.
 * `oldValue` and `newValue` are scanned for CmsImage keys; keys present in the
 * previous state but absent from the new one are removed.
 */
export function collectImageKeys(value: unknown, into: Set<string>): void {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const entry of value) collectImageKeys(entry, into);
    return;
  }
  const record = value as Record<string, unknown>;
  if ("key" in record && "src" in record && "alt" in record && typeof record.key === "string") {
    into.add(record.key);
    return;
  }
  for (const child of Object.values(record)) {
    if (child && typeof child === "object") collectImageKeys(child, into);
  }
}

export async function gcImages(oldValue: unknown, newValue: unknown): Promise<void> {
  const oldKeys = new Set<string>();
  const newKeys = new Set<string>();
  collectImageKeys(oldValue, oldKeys);
  collectImageKeys(newValue, newKeys);
  await Promise.all(
    [...oldKeys].filter((key) => key !== "" && !newKeys.has(key)).map((key) => deleteImage(key)),
  );
}
