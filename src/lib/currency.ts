export interface CurrencySymbol {
  code: string;
  name: string;
  symbol: string;
}

export const getCurrencySymbol = async (
  currencyCode: string
): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.frankfurter.dev/v2/currency/${currencyCode}`
    );

    if (!response.ok) {
      return currencyCode;
    }

    const data = await response.json();

    return data.symbol || currencyCode;
  } catch (error) {
    console.error("Failed to fetch currency symbol:", error);
    return currencyCode;
  }
};