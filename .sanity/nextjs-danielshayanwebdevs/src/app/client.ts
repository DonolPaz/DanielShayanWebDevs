import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "lum7jfxh",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});