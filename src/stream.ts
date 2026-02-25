import type { LineData, SSEProps } from "./types";
import { parseLine } from "./parseLine";

let buffer = "";
// Queue to store parsed line data
const queue = [] as LineData[];
export async function parseSSEStream<T = any>({
  renderStream,
  options,
}: SSEProps) {
  const decoder = new TextDecoder();
  while (true) {
    try {
      const { value, done } = await renderStream.read();
      if (done) break;

      // Decode and split text into lines
      buffer += decoder.decode(value, { stream: true });

      if(!buffer.includes("\n\n")){
        continue;
      }
      const lines = buffer.split("\n");
      for (const line of lines) {
        buffer = "";
        const lineVal = line.trimEnd();
        let msg;
        try {
          msg = parseLine(lineVal);
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
          queue.push(msg);
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
