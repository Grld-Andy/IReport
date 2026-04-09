// import { initializePayment } from "@/services/payment/payment";
// import { useState } from "react";

// export default function PaymentPage() {
//   const [email, setEmail] = useState("");
//   const [amount, setAmount] = useState<number>(0);
//   const [channel, setChannel] = useState("mobile_money");
//   const [loading, setLoading] = useState(false);

//   const handlePayment = async () => {
//     if (!email) {
//       alert("Please fill all fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await initializePayment(email, channel);

//       if (res.status) {
//         console.log("response from init pay: ", res);
//         window.location.href = res.data.authorization_url;
//       } else {
//         alert("Payment initialization failed");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           Make Payment
//         </h2>

//         <div className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <input
//             type="number"
//             placeholder="Amount (GHS)"
//             className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={amount}
//             onChange={(e) => setAmount(Number(e.target.value))}
//           />

//           <select
//             className="w-full border rounded-lg p-3"
//             value={channel}
//             onChange={(e) => setChannel(e.target.value)}
//           >
//             <option value="mobile_money">Mobile Money</option>
//             <option value="card">Card</option>
//           </select>

//           <button
//             onClick={handlePayment}
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
//           >
//             {loading ? "Processing..." : "Pay Now"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }