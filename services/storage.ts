const DB_NAME = 'CondorAgentsDB';
const STORE_NAME = 'avatars';
const DB_VERSION = 1;

// Apre (o crea) il database IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // Verifica supporto
    if (!('indexedDB' in window)) {
      reject(new Error("IndexedDB not supported"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Salva un avatar nel DB
export const saveAvatarToDB = async (id: string, data: string): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(data, id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Error saving to IndexedDB:", err);
    // Fallback silenzioso per non rompere l'app
  }
};

// Recupera un avatar dal DB
export const getAvatarFromDB = async (id: string): Promise<string | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Error reading from IndexedDB:", err);
    return null;
  }
};

// Utility per pulire vecchie chiavi localStorage che intasano la memoria
export const clearLegacyLocalStorageAvatars = (id: string) => {
  try {
    const key = `condor_avatar_v2_${id}`;
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  } catch (e) {
    // Ignora errori su localStorage
  }
};