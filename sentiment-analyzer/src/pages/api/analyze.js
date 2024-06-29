import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await axios.post("http://127.0.0.1:8000/analyze", { url });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error analyzing the article" });
  }
}
