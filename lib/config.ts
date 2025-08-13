
const raw =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const BASE_URL =
  (raw && raw.replace(/\/+$/, "")) || "https://api-drakorid.vee666.my.id";