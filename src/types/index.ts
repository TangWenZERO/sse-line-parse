/**
 * A simple parser for Server-Sent Events (SSE) streams
 */

// Structure for a complete Server-Sent Event message
export type SSEMessage = {
  event?: string; // Event type
  data: string; // Message data
  id?: string; // Event ID
  retry?: number; // Reconnection time
};

// Structure for parsed SSE line data
export type LineData = {
  id?: number; // Line identifier
  event?: string; // Event type
  data: Record<string, any> | string | null; // Data payload
  error?: string; // Error message
};

// Options for handling stream events
export type StreamOptions<T = any> = {
  onMessage: (data: T) => void; // Handle incoming messages
  onDone?: () => void; // Called when stream completes
  onError?: (err: Error) => void; // Handle errors
};

// Properties for SSE stream processing
export type SSEProps = {
  renderStream: ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>; // Stream reader
  options: StreamOptions; // Event handlers
};
