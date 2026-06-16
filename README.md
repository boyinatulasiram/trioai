# 🌐 TRiO AI — Think. Build. Create.

TRiO AI is a premium, modern AI productivity suite built using React 19, Vite, and Node.js. It features a high-end, Notion-inspired Light Mode glass workspace, offering three distinct AI assistants powered by **Groq** via a centralized backend proxy.

---

## 📐 Architecture & Flow

To guarantee safety and prevent API key leaks on the client side, TRiO AI separates the frontend interface from direct AI communication using a secure backend proxy.

```mermaid
graph TD
    User([User])
    subgraph Frontend [Client Workspace]
        UI[React UI]
        Hook[useGroqStream Hook]
    end
    subgraph Backend [Proxy API]
        Srv[Express Server]
        Key[process.env.GROQ_API_KEY]
    end
    Groq[Groq API Endpoint]
    Model[openai/gpt-oss-120b Model]

    User --> UI
    UI --> Hook
    Hook -->|POST /api/*| Srv
    Srv -->|API Request + Auth Header| Groq
    Key -.->|Auth injection| Srv
    Groq --> Model
    Model -->|SSE Stream Chunk| Srv
    Srv -->|Raw Bytes Stream| Hook
    Hook -->|Markdown Render| UI
```

---

## 🛠️ Functional Modules & Tasks

TRiO AI combines three specialized modules to cover engineering, brainstorming, and writing:

### 1. 🚀 MyStriver (AI Software Engineering Assistant)
A full-featured developer panel for optimizing, explaining, and drafting source code:
*   **Generate Code**: Code drafting based on natural language descriptions.
*   **Review Code**: Rigorous code reviews focusing on edge cases, security, and performance.
*   **Detect Bugs**: Identifies syntax/logical errors and offers fixed code.
*   **Complexity (Big O)**: Analyzes time/space complexity with optimization tips.
*   **Refactor**: Rewrites code using modern language standards.
*   **Explain**: Explains code logic step-by-step in plain language.
*   **Doc Gen**: Generates JSDoc comments, docstrings, and comprehensive comments.
*   **Unit Tests**: Generates unit tests using standard frameworks (Jest, PyTest, etc.).
*   **API Design**: Provides REST/GraphQL schema, validation, and endpoint guides.
*   **System Design**: Outlines database schemas, microservice maps, and scaling strategies.

### 2. 💬 ChatMini (General Conversational AI Assistant)
A Notion-style conversational interface for general reasoning, productivity, and Q&A:
*   **Multi-Turn Chats**: Retains conversation history for continuous contexts.
*   **Persistent Sessions**: Chat sessions are persisted in `localStorage`.
*   **Manage History**: Options to create, rename, and delete conversation threads.
*   **Suggestions**: Quick-start templates for Summarization, Learning, Reasoning, and Brainstorming.

### 3. ✍️ Writer (Creative Writing Studio)
An off-white, warm writing workspace designed for authors, screenwriters, and creative designers:
*   **Character Gen**: Outlines detailed profiles including motivations and backstory.
*   **Story Gen**: Generates stories with narrative pacing and hooks.
*   **World Builder**: Outlines geography, societies, history, and magic systems.
*   **Dialogue Gen**: Creates realistic conversations between characters.
*   **Chapter Gen**: Drafts a full narrative chapter.
*   **Fantasy & Sci-Fi Writing**: Genre-specific writing engines.
*   **Plot Generator**: Outputs exposition, climax, and card plot beats.
*   **Creative Assistant**: Expands, refines, and polishes draft revisions.

---

## 🔌 Backend APIs

The backend Express application listens on port `5000` and serves three SSE (Server-Sent Events) streaming endpoints. All endpoints run using the centralized `openai/gpt-oss-120b` model.

| Endpoint | Method | Payload Format | Description |
| :--- | :--- | :--- | :--- |
| `/api/mystriver` | `POST` | `{ messages: Array, temperature: 0.3 }` | Returns streamed code completions. |
| `/api/chatmini` | `POST` | `{ messages: Array, temperature: 0.7 }` | Returns streamed general conversation chunks. |
| `/api/writer` | `POST` | `{ messages: Array, temperature: 0.8 }` | Returns streamed creative writing chunks. |

---

## 🚀 Getting Started

### 1. Installation
Install project dependencies for both client and backend operations:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```

### 3. Spin Up the Backend Server
Run the Express proxy server:
```bash
npm run server
```
*Console output should verify:*
`TRiO AI Backend running on port 5000`
`Centralized Model Config: openai/gpt-oss-120b`

### 4. Spin Up the Frontend Client
In a separate terminal, launch the Vite dev server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.
