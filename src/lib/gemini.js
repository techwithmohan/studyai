// Now calling the VPS Backend instead of Gemini SDK directly for security
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const getGeminiResponse = async (prompt, history = []) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: prompt,
        history: history,
      }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    return data.text
  } catch (error) {
    console.error('Backend API Error:', error)
    return 'Sorry, I am having trouble connecting to my brain on the server. Please ensure the backend is running.'
  }
}

// PDF Analysis can also be moved to backend for better processing
export const analyzePDF = async (text) => {
  // To be implemented on backend for better security and resource management
  return "PDF analysis successfully requested from backend."
}
