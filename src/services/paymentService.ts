import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { readLocal, watchLocal, writeLocal } from "../lib/localStore";
import { Listener, NewPayment, NewPaymentGroup, Payment, PaymentGroup } from "../types/finance";

const localKey = {
  groups: "trip-finance-groups",
  payments: "trip-finance-payments",
};

export const subscribeGroups = (listener: Listener<PaymentGroup>) => {
  if (!db) return watchLocal<PaymentGroup>(localKey.groups, listener);

  const userId = auth?.currentUser?.uid || "";
  const groupsQuery = query(collection(db, "newtrip"), where("userId", "==", userId));
  return onSnapshot(groupsQuery, (snapshot) => {
    const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as PaymentGroup);
    items.sort((a, b) => {
      const tA = (a.createdAt as any)?.seconds || 0;
      const tB = (b.createdAt as any)?.seconds || 0;
      return tB - tA;
    });
    listener(items);
  });
};

export const subscribePayments = (listener: Listener<Payment>) => {
  if (!db) return watchLocal<Payment>(localKey.payments, listener);

  const userId = auth?.currentUser?.uid || "";
  const paymentsQuery = query(collection(db, "payments"), where("userId", "==", userId));
  return onSnapshot(paymentsQuery, (snapshot) => {
    const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Payment);
    items.sort((a, b) => {
      const tA = (a.createdAt as any)?.seconds || 0;
      const tB = (b.createdAt as any)?.seconds || 0;
      return tB - tA;
    });
    listener(items);
  });
};

export const createGroup = async (group: NewPaymentGroup) => {
  if (!db) {
    const groups = readLocal<PaymentGroup>(localKey.groups);
    const createdGroup = { ...group, id: crypto.randomUUID(), createdAt: Date.now() };
    writeLocal(localKey.groups, [createdGroup, ...groups]);
    return createdGroup;
  }

  const userId = auth?.currentUser?.uid || "";
  const groupRef = await addDoc(collection(db, "newtrip"), {
    ...group,
    userId,
    createdAt: serverTimestamp(),
  });
  return { ...group, id: groupRef.id, userId };
};

export const createPayment = async (payment: NewPayment) => {
  if (!db) {
    const payments = readLocal<Payment>(localKey.payments);
    writeLocal(localKey.payments, [{ ...payment, id: crypto.randomUUID(), createdAt: Date.now() }, ...payments]);
    return;
  }

  const userId = auth?.currentUser?.uid || "";
  await addDoc(collection(db, "payments"), {
    ...payment,
    userId,
    createdAt: serverTimestamp(),
  });
};

export const removePayment = async (paymentId: string) => {
  if (!db) {
    writeLocal(
      localKey.payments,
      readLocal<Payment>(localKey.payments).filter((payment) => payment.id !== paymentId),
    );
    return;
  }

  await deleteDoc(doc(db, "payments", paymentId));
};
