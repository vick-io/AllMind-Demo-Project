import axios from "axios";

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const apiKey = process.env.NEXT_PUBLIC_NEWSAPI_KEY;
  const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query
  )}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    res.status(200).json({ articles: response.data.articles });
  } catch (error) {
    res.status(500).json({ error: "Error fetching articles from NewsAPI" });
  }
}
