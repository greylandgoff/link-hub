import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig } from "@neondatabase/serverless";
import ws from 'ws';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Configure neon for serverless
neonConfig.fetchConnectionCache = true;

// Configure WebSocket for Node.js environment
if (typeof global !== 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

export const db = drizzle(process.env.DATABASE_URL!, { schema });