/* eslint-disable @typescript-eslint/no-explicit-any */
export const detectPriceAnomaly = (
  item: any,
  previousPrice: number,
): boolean => {
  const diff = item.UnitPrice - previousPrice;

  const percentage = (diff / previousPrice) * 100;

  if (percentage > 30) {
    return true;
  }

  return false;
};
