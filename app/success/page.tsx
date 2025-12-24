"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const query = useSearchParams();
  const reference = query.get("reference");
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    async function verify() {
      const res = await fetch("/api/verify?reference=" + reference);
      const data = await res.json();
      setStatus(data.message);
    }
    verify();
  }, [reference]);

  return <div>{status}</div>;
}
