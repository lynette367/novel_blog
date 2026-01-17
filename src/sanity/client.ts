import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "lke4t7vu",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});








