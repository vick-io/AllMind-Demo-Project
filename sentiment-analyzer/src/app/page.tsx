"use client";

import { useState } from "react";
import axios from "axios";

interface Article {
  url: string;
  title: string;
  description: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/search?query=${searchTerm}`);
      const filteredArticles: Article[] = [];
      for (const article of response.data.articles) {
        if (article.title !== "[Removed]") {
          const checkResponse = await axios.post("/api/check_url", {
            url: article.url,
          });
          if (checkResponse.data.valid) {
            filteredArticles.push(article);
          }
        }
        if (filteredArticles.length >= 15) break;
      }
      setArticles(filteredArticles);
    } catch (err) {
      setError("Error fetching search results");
    }
  };

  const handleAnalyze = async (url: string) => {
    setSelectedArticle(url);
    try {
      const response = await axios.post("/api/analyze", { url });
      setSentiment(response.data.sentiment);
      setError(null);
    } catch (err) {
      setError("Error analyzing the article");
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h1>Stock Sentiment Analyzer</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a stock..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <ul className="article-list">
          {articles.map((article) => (
            <li
              key={article.url}
              className="article-item"
              onClick={() => handleAnalyze(article.url)}
            >
              <h2>{article.title}</h2>
              <p>{article.description}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="content">
        {error && <div className="error">{error}</div>}
        {selectedArticle && !error && (
          <div className="sentiment-result">
            <h2>Sentiment Analysis</h2>
            {sentiment.length > 0 ? (
              <ul>
                {sentiment.map((item, index) => (
                  <li key={index}>
                    <strong>{item.label}</strong>: {item.score.toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No sentiment data available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
