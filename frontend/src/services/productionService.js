const API_BASE_URL = "http://127.0.0.1:8000";

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