export const currency = {
  format: (amount: number, currencyCode?: string) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: (currencyCode || "USD").toUpperCase(),
      }).format(amount);
    } catch {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    }
  },
};
