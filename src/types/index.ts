export type PSUnit = {
  id: string;
  name: string;
  type: "PS3" | "PS4" | "PS5";
  hourly_rate: number;
  status: "available" | "in_use";
  created_at: string;
};

export type Transaction = {
  id: string;
  ps_id: string;
  cashier_id: string;
  start_time: string;
  end_time: string | null;
  status: "active" | "completed" | "cancelled";
  ps_total: number;
  items_total: number;
  total_price: number;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  created_at: string;
};

export type TransactionItem = {
  id: string;
  transaction_id: string;
  product_id: string | null;
  product_name: string;
  price: number;
  qty: number;
  subtotal: number;
  created_at: string;
};