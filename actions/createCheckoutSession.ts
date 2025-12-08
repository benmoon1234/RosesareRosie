"use server";

import { CartItem } from "@/store";
import { Address } from "@/sanity.types";
import { paystackRequest } from "@/lib/paystack";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address?: Address | null;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  try {
   const amount = items.reduce((sum, item) => {
  const price = item.product?.price ?? 0; // fallback to 0 if undefined
  return sum + price * item.quantity;
}, 0);

    const payload = {
      email: metadata.customerEmail,
      amount: Math.round(amount * 100), // kobo
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderNumber=${metadata.orderNumber}`,
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        clerkUserId: metadata.clerkUserId,
        address: metadata.address,
        items: items.map((i) => ({
          id: i.product._id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
      },
    };

    const response = await paystackRequest("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return response.data.authorization_url; // Paystack redirect URL
  } catch (error) {
    console.error("PAYSTACK ERROR:", error);
    throw error;
  }
}
