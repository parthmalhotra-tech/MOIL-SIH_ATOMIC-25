const API_BASE_URL = "http://127.0.0.1:8000";

export async function getAIRecommendations() {
  const response = await fetch(`${API_BASE_URL}/ai/recommendations`);

  if (!response.ok) {
    throw new Error(
      `AI recommendations request failed: ${response.status}`
    );
  }

  return response.json();
}

export async function askAI(message) {
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`AI chat request failed: ${response.status}`);
  }

  return response.json();
}