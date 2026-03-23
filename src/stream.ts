import type { LineData, SSEProps } from "./types";
import { parseLine, createParseState } from "./parseLine";

// Queue to store parsed line data
export async function parseSSEStream<T = any>({
  renderStream,
  options,
}: SSEProps) {
  const decoder = new TextDecoder();
  const state = createParseState();
  while (true) {
    try {
      const { value, done } = await renderStream.read();
      if (done) break;

      // Decode and split text into lines
      const text = decoder.decode(value);
      const lines = text.split("\n");
      for (const line of lines) {
        const lineVal = line.trimEnd();

        let msg;
        try {
          msg = parseLine(lineVal, state);
          // Check for DONE flag and terminate if found
          if (msg && msg.data === "[DONE]") {
            return;
          }
        } catch (error) {
          if (options.onError) {
            options.onError(new Error(`Failed to parse line: ${lineVal}`));
          }
          continue;
        }

        // Process non-null messages
        if (msg && msg.data != null) {
          options.onMessage(msg);
        }
      }
    } catch (error) {
      console.error("Error reading stream:", error);
      if (options.onError) {
        options.onError(error as Error);
      }
      break;
    }
  }
  // Call completion handler if provided
  if (options.onDone) {
    options.onDone();
  }
}
