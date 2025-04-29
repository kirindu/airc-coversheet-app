export default function useFormatCurrency() {
  const formattingCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };
  return {
    formattingCurrency,
  };
}
