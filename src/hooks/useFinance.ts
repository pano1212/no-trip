import { useEffect, useMemo, useState } from "react";
import { createGroup, createPayment, removePayment, subscribeGroups, subscribePayments } from "../services/paymentService";
import { getTodayInputValue } from "../utils/date";
import { NewPayment, NewPaymentGroup, Payment, PaymentGroup } from "../types/finance";

export function useFinance() {
  const [groups, setGroups] = useState<PaymentGroup[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");

  useEffect(() => {
    const stopGroups = subscribeGroups(setGroups);
    const stopPayments = subscribePayments(setPayments);
    return () => {
      stopGroups();
      stopPayments();
    };
  }, []);

  useEffect(() => {
    if (!selectedGroupId && groups[0]) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  const selectedPayments = payments.filter((payment) => payment.groupId === selectedGroupId);
  const totalSaved = selectedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const allSaved = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remaining = Math.max((selectedGroup?.budget ?? 0) - totalSaved, 0);

  const groupedTotals = useMemo(
    () =>
      groups.map((group) => ({
        ...group,
        total: payments
          .filter((payment) => payment.groupId === group.id)
          .reduce((sum, payment) => sum + payment.amount, 0),
      })),
    [groups, payments],
  );

  const addGroup = async (group: NewPaymentGroup) => {
    await createGroup(group);
  };

  const addPayment = async (payment: NewPayment) => {
    await createPayment(payment);
  };

  return {
    groups,
    payments,
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
    removePayment,
    defaultPaymentDate: getTodayInputValue(),
  };
}
