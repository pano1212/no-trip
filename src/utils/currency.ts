export const currency = {
  format: (amount: number, currencyCode?: string) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: (currencyCode || "USD").toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
  },
};