import { NextRequest } from "next/server";
import { paystackRequest } from "@/lib/paystack";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");

  const data = await paystackRequest(`/transaction/verify/${reference}`, {
    method: "GET",
  });

  return Response.json({
    success: true,
    message: "Payment verified",
    data: data.data,
  });
}
