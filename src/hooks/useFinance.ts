import { useEffect, useMemo, useState } from "react";
import {
  createGroup,
  createPayment,
  removeGroup as removeGroupFromStore,
  removePayment,
  subscribeGroups,
  subscribePayments,
  updateGroup as updateGroupInStore,
} from "../services/paymentService";
import { getLocalTimeInputValue, getTodayInputValue } from "../utils/date";
import { isActivePaymentGroup, NewPayment, NewPaymentGroup, Payment, PaymentGroup } from "../types/finance";

export function useFinance(userId: string) {
  const [groups, setGroups] = useState<PaymentGroup[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");

  useEffect(() => {
    if (!userId) return;
    const stopGroups = subscribeGroups(userId, setGroups);
    const stopPayments = subscribePayments(userId, setPayments);
    return () => {
      stopGroups();
      stopPayments();
    };
  }, [userId]);

  const activeGroups = useMemo(() => groups.filter(isActivePaymentGroup), [groups]);

  useEffect(() => {
    if (!activeGroups.length) {
      if (selectedGroupId) setSelectedGroupId("");
      return;
    }
    if (!selectedGroupId || !activeGroups.some((group) => group.id === selectedGroupId)) {
      setSelectedGroupId(activeGroups[0].id);
    }
  }, [activeGroups, selectedGroupId]);

  // Ignore orphan/test payments whose groupId was removed or no longer exists.
  const validPayments = useMemo(() => {
    const groupIds = new Set(activeGroups.map((group) => group.id));
    return payments.filter(
      (payment) => Boolean(payment.groupId) && groupIds.has(payment.groupId),
    );
  }, [activeGroups, payments]);

  const selectedGroup = activeGroups.find((group) => group.id === selectedGroupId);
  const selectedPayments = validPayments.filter((payment) => payment.groupId === selectedGroupId);
  const totalSaved = selectedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const allSaved = validPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const remaining = (selectedGroup?.budget ?? 0) - totalSaved;

  const groupedTotals = useMemo(
    () =>
      activeGroups.map((group) => ({
        ...group,
        total: validPayments
          .filter((payment) => payment.groupId === group.id)
          .reduce((sum, payment) => sum + payment.amount, 0),
      })),
    [activeGroups, validPayments],
  );

  const addGroup = async (group: NewPaymentGroup) => {
    await createGroup({ ...group, status: group.status ?? "active" });
  };

  const addPayment = async (payment: NewPayment) => {
    await createPayment(payment);
  };

  const removeGroup = async (groupId: string) => {
    await removeGroupFromStore(groupId);
    if (selectedGroupId === groupId) {
      const remaining = activeGroups.filter((group) => group.id !== groupId);
      setSelectedGroupId(remaining[0]?.id ?? "");
    }
  };

  const updateGroup = async (groupId: string, updates: Partial<NewPaymentGroup>) => {
    await updateGroupInStore(groupId, updates);
  };

  return {
    groups: activeGroups,
    payments: validPayments,
    groupedTotals,
    selectedGroup,
    selectedGroupId,
    selectedPayments,
    totalSaved,
    allSaved,
    remaining,
    setSelectedGroupId,
    addGroup,
    addPayment,
    removeGroup,
    updateGroup,
    removePayment,
    defaultPaymentDate: getTodayInputValue(),
    defaultPaymentTime: getLocalTimeInputValue(),
  };
}
