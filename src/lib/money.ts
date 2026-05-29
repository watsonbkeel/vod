export function formatMoney(amountCents: number, currencyPrefix = "HK$") {
  const amount = amountCents / 100;
  const formattedAmount = amount.toLocaleString("zh-CN", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  const separator = currencyPrefix && /[A-Za-z0-9]$/.test(currencyPrefix) ? " " : "";

  return `${currencyPrefix}${separator}${formattedAmount}`;
}
