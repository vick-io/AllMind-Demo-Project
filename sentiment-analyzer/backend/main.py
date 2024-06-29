from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
from bs4 import BeautifulSoup
import requests

app = FastAPI()

sentiment_pipeline = pipeline("sentiment-analysis")

class ArticleUrl(BaseModel):
    url: str

@app.post("/check_url")
async def check_url(article: ArticleUrl):
    try:
        response = requests.get(article.url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
        paragraphs = soup.find_all("p")
        text = " ".join([para.get_text() for para in paragraphs])
        
        if not text:
            raise HTTPException(status_code=400, detail="No text found in the article")
        
        return {"valid": True}
    except requests.exceptions.RequestException as e:
        return {"valid": False}

@app.post("/analyze")
async def analyze_article(article: ArticleUrl):
    try:
        response = requests.get(article.url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail="Error fetching the article")

    soup = BeautifulSoup(response.content, "html.parser")
    paragraphs = soup.find_all("p")
    text = " ".join([para.get_text() for para in paragraphs])
    
    if not text:
        raise HTTPException(status_code=400, detail="No text found in the article")
    
    tokens = sentiment_pipeline.tokenizer.tokenize(text)
    chunk_size = 450  # Smaller chunk size to ensure it never exceeds
    text_chunks = [sentiment_pipeline.tokenizer.convert_tokens_to_string(tokens[i:i + chunk_size]) for i in range(0, len(tokens), chunk_size)]
    
    sentiment_results = []
    for chunk in text_chunks:
        result = sentiment_pipeline(chunk)
        sentiment_results.extend(result)

    return {"sentiment": sentiment_results}
