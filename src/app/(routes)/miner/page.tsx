// "use client";

// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import axiosClient from "@/lib/axiosClient";

// interface MinerLoginForm {
//   mineId: string;
//   phone: string;
//   otp?: string;
// }

// const MinerLogin: React.FC = () => {
//   const router = useRouter();
//   const [step, setStep] = useState<"phone" | "otp">("phone");
//   const [cooldown, setCooldown] = useState<number>(0);
//   const [mines, setMines] = useState<{ id: number; name: string; location: string }[]>([]);
//   const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
//     useForm<MinerLoginForm>();
//   const phone = watch("phone");

//   // Fetch mines
// useEffect(() => {
//   axiosClient.get("/mines").then((res) => {
//     if (res.data) setMines(res.data);
//   });
// }, []);

//   // Cooldown timer for resend OTP
//   useEffect(() => {
//     if (cooldown > 0) {
//       const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [cooldown]);

//   const sendOtp = async (data: MinerLoginForm) => {
//     try {
//       const phoneNumber = `+91${data.phone}`;
//       await axios.post("/api/auth/send-otp", { phone: phoneNumber });
//       setStep("otp");
//       setCooldown(30);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send OTP");
//     }
//   };

//   const verifyOtp = async (data: MinerLoginForm) => {
//     try {
//       const phoneNumber = `+91${data.phone}`;
//       const res = await axios.post("/api/auth/verify-otp", {
//         phone: phoneNumber,
//         otp: data.otp,
//         mineId: Number(data.mineId),
//       });

//       if (res.data.success) {
//         router.push("/miner/dashboard");
//       } else {
//         alert(res.data.error || "OTP verification failed");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("OTP verification failed");
//     }
//   };

//   return (
//     <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center px-4">
//       <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-6 text-center">Miner Login</h1>

//         <form onSubmit={handleSubmit(step === "phone" ? sendOtp : verifyOtp)} className="space-y-6">
//           {/* Mine selection */}
//           {step === "phone" && (
//             <div>
//               <label className="block font-semibold mb-2">Select Mine</label>
//               <select
//                 {...register("mineId", { required: "Mine is required" })}
//                 className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//               >
//                 <option value="">-- Select a mine --</option>
//                 {mines.map((m) => (
//                   <option key={m.id} value={m.id}>
//                     {m.name} ({m.location})
//                   </option>
//                 ))}
//               </select>
//               {errors.mineId && (
//                 <p className="text-red-400 text-sm mt-1">{errors.mineId.message}</p>
//               )}
//             </div>
//           )}

//           {/* Phone input */}
//           {step === "phone" && (
//             <div>
//               <label className="block font-semibold mb-2">Phone Number</label>
//               <div className="flex items-center">
//                 <span className="bg-gray-700 px-3 py-2 rounded-l">+91</span>
//                 <input
//                   type="text"
//                   {...register("phone", { required: "Phone number is required" })}
//                   className="flex-1 p-2 rounded-r bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//                   placeholder="Enter your phone number"
//                 />
//               </div>
//               {errors.phone && (
//                 <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
//               )}
//             </div>
//           )}

//           {/* OTP input */}
//           {step === "otp" && (
//             <div>
//               <label className="block font-semibold mb-2">Enter OTP</label>
//               <input
//                 type="text"
//                 {...register("otp", { required: "OTP is required" })}
//                 className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//                 placeholder="Enter OTP"
//               />
//               {errors.otp && (
//                 <p className="text-red-400 text-sm mt-1">{errors.otp.message}</p>
//               )}

//               <button
//                 type="button"
//                 onClick={() => sendOtp({ phone, mineId: watch("mineId") } as MinerLoginForm)}
//                 disabled={cooldown > 0}
//                 className="mt-3 text-blue-400 hover:text-blue-500 text-sm"
//               >
//                 {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
//               </button>
//             </div>
//           )}

//           {/* Submit button */}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
//           >
//             {isSubmitting ? "Processing..." : step === "phone" ? "Send OTP" : "Verify OTP"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MinerLogin;

"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import { useUser } from "@/context/UserProvider";

interface MinerLoginForm {
  mineId: string;
  phone: string;
  otp?: string;
}

const MinerLogin: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [cooldown, setCooldown] = useState<number>(0);
  const [mines, setMines] = useState<
    { id: number; name: string; location: string }[]
  >([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MinerLoginForm>();
  const phone = watch("phone");

  // Fetch mines once
  useEffect(() => {
    axiosClient
      .get("/mines")
      .then((res) => setMines(res.data || []))
      .catch((err) => console.error("Failed to fetch mines:", err));
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Send OTP
  const sendOtp = async (data: MinerLoginForm) => {
    try {
      if (!data.mineId) return alert("Please select a mine");
      
      const phoneNumber = `+91${data.phone}`;
      await axiosClient.post("/auth/send-otp", { phone: phoneNumber });
      setStep("otp");
      setCooldown(30);
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    }
  };

  const { setUser } = useUser();

  // Verify OTP
  const verifyOtp = async (data: MinerLoginForm) => {
    try {
      const phoneNumber = `+91${data.phone}`;
      const res = await axiosClient.post("/auth/verify-otp", {
        phone: phoneNumber,
        otp: data.otp,
        mineId: Number(data.mineId),
      });

      if (res.data.success) {
        // Save the user info in context
        setUser(res.data.user); // backend should return { id, username, name, role, mineId }

        // Redirect to homepage
        router.push("/");
      } else {
        alert(res.data.error || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("OTP verification failed");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Miner Login</h1>

        <form
          onSubmit={handleSubmit(step === "phone" ? sendOtp : verifyOtp)}
          className="space-y-6"
        >
          {/* Mine selection */}
          {step === "phone" && (
            <div>
              <label className="block font-semibold mb-2">Select Mine</label>
              <select
                {...register("mineId", { required: "Mine is required" })}
                className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- Select a mine --</option>
                {mines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.location})
                  </option>
                ))}
              </select>
              {errors.mineId && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.mineId.message}
                </p>
              )}
            </div>
          )}

          {/* Phone input */}
          {step === "phone" && (
            <div>
              <label className="block font-semibold mb-2">Phone Number</label>
              <div className="flex items-center">
                <span className="bg-gray-700 px-3 py-2 rounded-l">+91</span>
                <input
                  type="text"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className="flex-1 p-2 rounded-r bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          )}

          {/* OTP input */}
          {step === "otp" && (
            <div>
              <label className="block font-semibold mb-2">Enter OTP</label>
              <input
                type="text"
                {...register("otp", { required: "OTP is required" })}
                className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter OTP"
              />
              {errors.otp && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.otp.message}
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  sendOtp({ phone, mineId: watch("mineId") } as MinerLoginForm)
                }
                disabled={cooldown > 0}
                className="mt-3 text-blue-400 hover:text-blue-500 text-sm"
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
          >
            {isSubmitting
              ? "Processing..."
              : step === "phone"
              ? "Send OTP"
              : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MinerLogin;
