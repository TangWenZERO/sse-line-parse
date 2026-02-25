# SSE Stream Parser

A **lightweight, pure, production-ready SSE (Server-Sent Events) stream parser**, implemented based on the standard SSE protocol. It is independent of specific application scenarios and can be widely used in various SSE data stream parsing tasks. It does not involve request management or connection interruption, focusing solely on doing one thing: **parsing streams cleanly**.

---

## ✨ Features

- ✅ **Pure SSE stream parsing**, no concern for request lifecycle
- ✅ Supports standard `data:` protocol format, compatible with all SSE-based services
- ✅ Built-in `[DONE]` early identification and quick skipping
- ✅ Low GC pressure, avoiding unnecessary object creation
- ✅ Runs on **Node.js ≥ 18** (native `fetch` + `ReadableStream`)
- ✅ Native TypeScript support with clear types

---

## 📦 Installation

```bash
pnpm add sse-line-parser
# or
npm install sse-line-parser
# or
yarn add sse-line-parser
```

---

## 🧠 Design Philosophy

> **Parse streams only, no control logic**

This plugin will **NOT**:

- ❌ Manage request interruption/abort
- ❌ Wrap fetch
- ❌ Maintain connection status
- ❌ Introduce EventEmitter/Rx/class abstractions

This plugin is **only responsible for**:

- ✔ Parse `ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>`
- ✔ Split SSE lines
- ✔ Parse `data:` content
- ✔ Identify `[DONE]`

---

## 🚀 Basic Usage

### 1️⃣ Basic Example (Node.js / Edge)

```ts
import { parseSSEStream } from "sse-line-parser";

const res = await fetch(url, options);

if (!res.body) return;

const reader = res.body.getReader();

await parseSSEStream({
  renderStream: reader,
  options: {
    onMessage(data) {
      // data is the parsed SSE message
      console.log(data);
    },
    onDone() {
      console.log("stream finished");
    },
    onError(err) {
      console.error("Error reading stream:", err);
    },
  },
});
```

---

## 🔍 `[DONE]` Processing Logic

Plugin internally optimizes for the following case:

```txt
data: [DONE]
```

- Early identification of `[DONE]`
- **Skip JSON.parse**
- Immediately trigger `onDone`
- Subsequent data is skipped directly

Avoid meaningless parsing and exception catching.

---

## ⚙️ API Documentation

### `parseSSEStream(options)`

#### Parameters

| Parameter           | Type                                      | Description                                    |
| ------------------- | ----------------------------------------- | ---------------------------------------------- |
| `renderStream`      | `ReadableStreamDefaultReader<Uint8Array>` | Reader for SSE response body                   |
| `options`           | `StreamOptions`                           | Options object containing callbacks            |
| `options.onMessage` | `(data: T) => void`                       | Callback for each message                      |
| `options.onDone`    | `() => void`                              | Triggered when `[DONE]` is received (optional) |
| `options.onError`   | `(err: Error) => void`                    | Parsing error callback (optional)              |

---

## 🌍 Runtime Environment

- Node.js **>= 18**
- Bun / Deno / Edge Runtime
- Browser (requires `ReadableStream` support)

---

## 🧱 Use Cases

- SSE for AI services like OpenAI/Claude/Gemini
- Real-time data push services
- Real-time updates for stock quotes, weather data, etc.
- Real-time log stream monitoring
- Custom SSE services
- Streaming consumption on Web/Node/Edge
- Infrastructure / SDK / Middleware layers

---

## 📜 License

MIT
