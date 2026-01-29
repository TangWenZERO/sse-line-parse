// Define the structure for parsed Server-Sent Event (SSE) line data
export type LineData = {
  id?: number;
  event?: string;
  data: Record<string, any> | string | null;
  error?: string;
};

// Global state variables to maintain parsing context across multiple lines
let lineData: LineData = { data: null }; // Stores event metadata (id, event type)
let dataBuffer: string[] = []; // Accumulates multi-line data segments

/**
 * Parses a single line of Server-Sent Events (SSE) protocol
 *
 * Handles SSE fields: data, event, id, and comments.
 * Returns complete event data when an empty line is encountered,
 * otherwise updates internal state and returns null.
 */
export function parseLine(line: string): LineData | null {
  // Empty line indicates the end of an event - process and return accumulated data
  if (line === "") {
    if (dataBuffer.length === 0) return null;

    const raw = dataBuffer.join("\n");

    // Initialize data as raw string, attempt JSON parsing if it looks like JSON
    let data: any = raw;
    const first = raw[0];
    if (first === "{" || first === "[") {
      try {
        data = JSON.parse(raw);
      } catch {
        data = raw;
      }
    }

    // Create result with accumulated event data
    const result: LineData = {
      id: lineData.id,
      event: lineData.event,
      data,
    };

    // Reset state for next event
    lineData = { data: null };
    dataBuffer.length = 0;
    return result;
  }

  // Skip comment lines (start with ':')
  if (line.startsWith(":")) return null;

  // Parse field-value pairs (format: "field: value")
  const colon = line.indexOf(":");
  let field = "";
  let value = "";

  if (colon === -1) {
    field = line;
  } else {
    field = line.slice(0, colon);
    value = line.slice(colon + 1);
    if (value.startsWith(" ")) value = value.slice(1);
  }

  // Update internal state based on field type
  switch (field) {
    case "id":
      lineData.id = Number(value);
      break;
    case "event":
      lineData.event = value;
      break;
    case "data":
      // Multi-line data segments are appended to buffer
      dataBuffer.push(value);
      break;
    default:
      // Ignore unknown fields
      break;
  }

  return null;
}
