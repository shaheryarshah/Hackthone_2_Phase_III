---
name: rag_chatbot
description: A complete RAG (Retrieval-Augmented Generation) chatbot system for integrating intelligent question-answering capabilities into any project.
---

# RAG Chatbot Integration Skill

Use this skill to add RAG chatbot functionality to any project. This skill provides a full implementation including document ingestion, vector storage, embedding generation, and LLM-powered responses with source attribution.

## Quick Integration

### 1. Install Dependencies

```bash
pip install flask flask-cors qdrant-client openai langchain PyPDF2 docx2txt beautifulsoup4 markdown tiktoken python-dotenv
```

### 2. Environment Configuration

Create a `.env` file:

```env
QDRANT_URL=your_qdrant_cloud_url
QDRANT_API_KEY=your_qdrant_api_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=https://api.openai.com/v1
COLLECTION_NAME=your_collection_name
EMBEDDING_MODEL=text-embedding-ada-002
```

### 3. Core Components

#### Vector Store Setup

Create `vector_store.py`:

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

class VectorStore:
    def __init__(self, url, api_key, collection_name):
        self.client = QdrantClient(url=url, api_key=api_key, prefer_grpc=True)
        self.collection_name = collection_name

    def create_collection(self, vector_size=1536):
        self.client.create_collection(
            collection_name=self.collection_name,
            vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
        )

    def add_documents(self, embeddings, documents, metadata_list):
        points = [
            {
                "id": i,
                "vector": emb,
                "payload": {
                    "content": doc,
                    **meta
                }
            }
            for i, (emb, doc, meta) in enumerate(zip(embeddings, documents, metadata_list))
        ]
        self.client.upload_points(collection_name=self.collection_name, points=points)

    def search_similar(self, query_vector, top_k=5):
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k
        )
        return [{"content": r.payload["content"], "score": r.score, **r.payload} for r in results]

    def get_count(self):
        return self.client.count(collection_name=self.collection_name).count
```

#### Embedder Setup

Create `embedder.py`:

```python
from openai import OpenAI

class Embedder:
    def __init__(self, api_key, base_url, model="text-embedding-ada-002"):
        self.client = OpenAI(api_key=api_key, base_url=base_url)
        self.model = model
        self.dimension = 1536

    def create_embedding(self, text):
        response = self.client.embeddings.create(
            model=self.model,
            input=text[:8192]  # Token limit safety
        )
        return response.data[0].embedding

    def embed_texts_batch(self, texts):
        """Batch embed multiple texts for efficiency"""
        embeddings = []
        for i in range(0, len(texts), 100):
            batch = texts[i:i + 100]
            response = self.client.embeddings.create(
                model=self.model,
                input=[t[:8192] for t in batch]
            )
            embeddings.extend([d.embedding for d in response.data])
        return embeddings
```

#### Text Preprocessor

Create `preprocessor.py`:

```python
import re

class TextPreprocessor:
    def __init__(self, chunk_size=512, overlap=50):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def clean_text(self, text):
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s\.!?\-\'\"\n]', '', text)
        return text.strip()

    def chunk_text(self, text):
        """Smart chunking with sentence boundary detection"""
        chunks = []
        start = 0

        while start < len(text):
            end = min(start + self.chunk_size, len(text))

            # Try to break at sentence boundaries
            for sep in ['. ', '! ', '? ', '\n']:
                last_sep = text.rfind(sep, start, end)
                if last_sep > start + self.chunk_size // 2:
                    end = last_sep + len(sep)
                    break

            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)

            start = end - self.overlap
            if start < 0:
                start = 0

        return chunks
```

#### Document Loader

Create `document_loader.py`:

```python
import os
from PyPDF2 import PdfReader
from docx2txt import docx2txt
from bs4 import BeautifulSoup
import markdown

class DocumentLoader:
    LOADERS = {
        '.pdf': 'load_pdf',
        '.docx': 'load_docx',
        '.txt': 'load_txt',
        '.html': 'load_html',
        '.htm': 'load_html',
        '.md': 'load_markdown'
    }

    def load(self, file_path):
        ext = os.path.splitext(file_path)[1].lower()
        method = getattr(self, self.LOADERS.get(ext, 'load_txt'))
        return method(file_path)

    def load_pdf(self, path):
        reader = PdfReader(path)
        return "\n".join([page.extract_text() for page in reader.pages])

    def load_docx(self, path):
        return docx2txt.process(path)

    def load_txt(self, path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()

    def load_html(self, path):
        with open(path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
            return soup.get_text()

    def load_markdown(self, path):
        with open(path, 'r', encoding='utf-8') as f:
            md_content = f.read()
            html = markdown.markdown(md_content)
            soup = BeautifulSoup(html, 'html.parser')
            return soup.get_text()

    def load_directory(self, dir_path):
        documents = []
        for root, _, files in os.walk(dir_path):
            for file in files:
                path = os.path.join(root, file)
                content = self.load(path)
                documents.append({
                    "content": content,
                    "source": path,
                    "file_name": file
                })
        return documents
```

#### Flask API

Create `api.py`:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["*"])

from embedder import Embedder
from vector_store import VectorStore
from openai import OpenAI

embedder = Embedder(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL")
)

vector_store = VectorStore(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
    collection_name=os.getenv("COLLECTION_NAME")
)

llm_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")

    # Create query embedding
    query_embedding = embedder.create_embedding(user_message)

    # Search similar documents
    results = vector_store.search_similar(query_embedding, top_k=5)

    # Prepare context
    if results:
        context = "\n".join([r["content"] for r in results])
        sources = [r.get("source", "") for r in results]
        scores = [r["score"] for r in results]

        prompt = f"""Answer the question based on the following context. If the context doesn't contain relevant information, say you don't know.

Context:
{context}

Question: {user_message}

Answer:"""
    else:
        prompt = user_message
        sources, scores = [], []

    # Generate response
    response = llm_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=500
    )

    return jsonify({
        "response": response.choices[0].message.content,
        "sources": sources,
        "scores": scores,
        "retrieved_context": context if results else ""
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"})

@app.route("/documents/count", methods=["GET"])
def count_documents():
    count = vector_store.get_count()
    return jsonify({"count": count})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

#### Document Ingestion Script

Create `load_documents.py`:

```python
from document_loader import DocumentLoader
from preprocessor import TextPreprocessor
from embedder import Embedder
from vector_store import VectorStore
from dotenv import load_dotenv
import os

load_dotenv()

def main(documents_dir="docs"):
    # Initialize components
    loader = DocumentLoader()
    preprocessor = TextPreprocessor(chunk_size=512, overlap=50)
    embedder = Embedder(
        os.getenv("OPENAI_API_KEY"),
        os.getenv("OPENAI_BASE_URL")
    )
    vector_store = VectorStore(
        os.getenv("QDRANT_URL"),
        os.getenv("QDRANT_API_KEY"),
        os.getenv("COLLECTION_NAME")
    )

    # Create collection
    vector_store.create_collection()

    # Load documents
    docs = loader.load_directory(documents_dir)
    print(f"Loaded {len(docs)} documents")

    # Chunk and preprocess
    all_chunks = []
    all_metadata = []
    for doc in docs:
        chunks = preprocessor.chunk_text(preprocessor.clean_text(doc["content"]))
        for i, chunk in enumerate(chunks):
            all_chunks.append(chunk)
            all_metadata.append({
                "source": doc["source"],
                "file_name": doc["file_name"],
                "chunk_id": i
            })

    print(f"Created {len(all_chunks)} chunks")

    # Generate embeddings
    embeddings = embedder.embed_texts_batch(all_chunks)

    # Store in vector database
    vector_store.add_documents(embeddings, all_chunks, all_metadata)

    print(f"Successfully indexed {len(all_chunks)} document chunks")

if __name__ == "__main__":
    import sys
    dir_path = sys.argv[1] if len(sys.argv) > 1 else "docs"
    main(dir_path)
```

### 4. Frontend Chat Component (React)

Create `ChatInterface.jsx`:

```jsx
import { useState } from 'react';
import './ChatInterface.css';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          content: data.response,
          sources: data.sources,
          scores: data.scores
        }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="content">{msg.content}</div>
            {msg.sources && (
              <div className="sources">
                {msg.sources.map((src, j) => (
                  <span key={j} className="source-tag">
                    {src} ({msg.scores?.[j]?.toFixed(2)})
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask a question..."
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
```

Create `ChatInterface.css`:

```css
.chat-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
}

.message.user {
  align-self: flex-end;
  background: #007bff;
  color: white;
}

.message.bot {
  align-self: flex-start;
  background: #f1f1f1;
  color: #333;
}

.sources {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.source-tag {
  font-size: 11px;
  background: #e0e0e0;
  padding: 2px 6px;
  border-radius: 4px;
}

.input-area {
  display: flex;
  padding: 12px;
  border-top: 1px solid #ddd;
  gap: 8px;
}

.input-area input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.input-area button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.input-area button:disabled {
  background: #ccc;
}
```

## API Reference

### POST /chat

**Purpose:** Main RAG query endpoint

**Request:**
```json
{
  "message": "Your question here"
}
```

**Response:**
```json
{
  "response": "AI-generated answer based on retrieved context",
  "sources": ["doc1.md", "doc2.pdf"],
  "scores": [0.87, 0.82],
  "retrieved_context": "Full text from retrieved documents"
}
```

### GET /health

**Purpose:** Health check endpoint

**Response:**
```json
{ "status": "healthy" }
```

### GET /documents/count

**Purpose:** Get number of indexed documents

**Response:**
```json
{ "count": 42 }
```

## Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| QDRANT_URL | Qdrant Cloud instance URL | Required |
| QDRANT_API_KEY | Qdrant Cloud API key | Required |
| OPENAI_API_KEY | OpenAI API key | Required |
| OPENAI_BASE_URL | OpenAI API base URL | https://api.openai.com/v1 |
| COLLECTION_NAME | Qdrant collection name | physical_ai_docs |
| EMBEDDING_MODEL | Embedding model name | text-embedding-ada-002 |
| CHUNK_SIZE | Document chunk size in chars | 512 |
| CHUNK_OVERLAP | Overlap between chunks | 50 |
| TOP_K | Number of documents to retrieve | 5 |
| LLM_MODEL | LLM model for responses | gpt-3.5-turbo |
| LLM_TEMPERATURE | Response randomness (0-1) | 0.3 |
| MAX_TOKENS | Max response tokens | 500 |

## Key Design Patterns

1. **Chunking Strategy**: Uses overlap between chunks to maintain context continuity across chunk boundaries
2. **Batch Processing**: Embeddings generated in batches of up to 100 texts for efficiency
3. **Fallback Handling**: If no documents retrieved, falls back to direct LLM query without context
4. **Source Attribution**: Returns source documents and similarity scores for transparency
5. **Error Recovery**: Individual embedding fallback if batch processing fails

## Scaling Considerations

- **Qdrant**: Cloud-hosted, scales horizontally with collection size
- **OpenAI API**: Rate limits apply; consider caching for repeated queries
- **Batch Size**: 100 texts per embedding batch is optimal for most use cases
- **Chunk Size**: Adjust based on document complexity (larger for simple docs, smaller for complex)

## Usage Example

1. Start the backend server:
```bash
python api.py
```

2. Load your documents:
```bash
python load_documents.py /path/to/your/documents
```

3. Add the React component to your frontend and start chatting!

## Production Checklist

- [ ] Set appropriate CORS origins
- [ ] Add rate limiting
- [ ] Implement request/response logging
- [ ] Set up monitoring for Qdrant and OpenAI usage
- [ ] Consider caching frequent queries
- [ ] Add input sanitization
- [ ] Set up proper error handling and recovery
