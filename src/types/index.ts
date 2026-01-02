export type StockType = "STOK_FISIK" | "NON_STOK" | "JASA";
export type PriceType = "FIXED" | "FLEXIBLE";
export type ModifierSelectionType = "SINGLE" | "MULTIPLE";

export interface ModifierItem {
  id: string;
  name: string;
  price_adjust: number;
  available: boolean;
  group_id: string;
}

export interface ModifierGroup {
  id: string;
  name: string;
  type: ModifierSelectionType;
  required: boolean;
  min_select: number;
  max_select: number;
  items: ModifierItem[];
}

export interface Product {
  id: string; // ID unik produk
  name: string; // Nama produk
  price: number; // Harga satuan
  image: string; // URL gambar
  category: string; // Kategori produk
  stock: number; // Jumlah stok
  stockType: StockType; // Tipe stok
  available: boolean; // Status ketersediaan
  priceType?: PriceType; // Harga tetap/fleksibel
  modifierGroupIds?: string[]; // ID grup modifier
}

export interface SelectedModifier {
  id: string;
  name: string;
  price: number;
}

export interface CartItem extends Product {
  qty: number; // Kuantitas di keranjang
  note?: string; // Catatan khusus
  selectedModifiers?: SelectedModifier[]; // Modifier terpilih
  modifierTotal?: number; // Total harga modifier
}

export interface TransactionRecord {
  id: string;
  timestamp: string;
  subtotal: number;
  tax: number;
  total: number;
  cashReceived: number;
  change: number;
  orderType: string; // "Dine In" | "Take Away"
  tableNumber: string;
  cashier: string;
  paymentMethod?: string;
  items?: CartItem[];
  donation?: number;
}
