import { buildSearchIndex } from "@/lib/search";

// Emitted as a static file (/search-index.json) at build; fetched lazily the first time search opens.
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchIndex());
}
