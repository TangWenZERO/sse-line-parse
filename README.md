# sse-line-parser

A lightweight, zero-dependency SSE (Server-Sent Events) stream parser. It does one thing: parse a `ReadableStream` into structured event objects. No request management, no reconnection logic, no EventEmitter abstraction.

---

## Installation

```bash
pnpm add sse-line-parser
# or
npm install sse-line-parser
# or
yarn add sse-line-parser
```

---

## Quick Start

```ts
import parseSSEStream from "sse-line-parser";

const res = await fetch("/api/chat", { method: "POST", body: "..." });
const reader = res.body!.getReader();

await parseSSEStream({
  renderStream: reader,
  options: {
    onMessage(msg) {
      console.log(msg.event, msg.data);
    },
    onDone() {
      console.log("stream finished");
    },
    onError(err) {
      console.error(err);
    },
  },
});
```

---

## What It Parses

Each SSE event block is parsed into a `LineData` object:

```
id: 1
event: message
data: {"text":"hello world"}

```

```ts
{
  id: 1,
  event: "message",
  data: { text: "hello world" }  // auto JSON.parse if content starts with { or [
}
```

Multi-line `data` fields are joined with `\n` before parsing:

```
data: {"text":"hel
data: lo world"}

```

```ts
{
  data: {
    text: "hello world";
  }
}
```

`[DONE]` signals end of stream and stops processing immediately:

```
data: [DONE]
```

---

## API

### `parseSSEStream(props)`

| Field               | Type                                      | Description                               |
| ------------------- | ----------------------------------------- | ----------------------------------------- |
| `renderStream`      | `ReadableStreamDefaultReader<Uint8Array>` | Stream reader from `res.body.getReader()` |
| `options.onMessage` | `(msg: LineData) => void`                 | Called for each complete event            |
| `options.onDone`    | `() => void`                              | Called when stream ends normally          |
| `options.onError`   | `(err: Error) => void`                    | Called on parse errors                    |

### `LineData`

```ts
type LineData = {
  id?: number;
  event?: string;
  data: Record<string, any> | string | null;
  error?: string;
};
```

---

## Design Philosophy

This library handles **only stream parsing**. It will not:

- Wrap `fetch` or manage requests
- Handle reconnection or `retry` fields
- Maintain connection state
- Introduce class-based or reactive abstractions

If you need those features, build them on top — the parser itself stays simple and composable.

---

## Runtime Support

- Node.js >= 18
- Browser (native `ReadableStream`)
- Bun / Deno / Edge Runtime

---

## License

MIT
