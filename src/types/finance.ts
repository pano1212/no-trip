export type PaymentGroupType = "month" | "trip";

export type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  color: string;
}

export type PaymentGroup = {
  id: string;
  type: PaymentGroupType;
  name: string;
  budget: number;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  currency?: string;
  userId?: string;
  createdAt?: unknown;
};

export type Payment = {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  category?: string;
  currency?: string;
  paidBy: string;
  date?: string;
  note: string;
  userId?: string;
  createdAt?: unknown;
};

export type PaymentGroupWithTotal = PaymentGroup & {
  total: number;
};

export type NewPaymentGroup = Omit<PaymentGroup, "id" | "createdAt">;
export type NewPayment = Omit<Payment, "id" | "createdAt">;

export type Listener<T> = (items: T[]) => void;
