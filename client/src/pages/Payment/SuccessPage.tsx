import { verifyPayment } from "@/services/payment/payment";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SuccessPage() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      const reference = params.get("reference");

      if (!reference) {
        setStatus("Invalid payment reference");
        return;
      }

      try {
        const res = await verifyPayment(reference);

        if (res.status && res.data.status === "success") {
          setStatus("✅ Payment successful!");
        } else {
          setStatus("❌ Payment failed");
        }
      } catch {
        setStatus("Error verifying payment");
      }
    };

    verify();
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold">{status}</h1>
      </div>
    </div>
  );
}