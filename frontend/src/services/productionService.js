const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getProductionForecast() {
  const response = await fetch(
    `${API_BASE_URL}/production/forecast`
  );

  if (!response.ok) {
    throw new Error(
      `Production API failed with status ${response.status}`
    );
  }

  return response.json();
}