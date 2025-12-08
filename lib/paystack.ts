export const paystackBaseUrl = "https://api.paystack.co";

export async function paystackRequest(path: string, options: RequestInit) {
  const res = await fetch(`${paystackBaseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Paystack Error");

  return data;
}
