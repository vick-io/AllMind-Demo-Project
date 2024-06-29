// src/pages/api/check_url.ts

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return res.status(200).json({ valid: true });
    }
    return res.status(200).json({ valid: false });
  } catch (error) {
    return res.status(200).json({ valid: false });
  }
}
