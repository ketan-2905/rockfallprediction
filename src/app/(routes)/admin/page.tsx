"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import { useUser } from "@/context/UserProvider";
import axios from "axios";

interface AdminLoginForm {
  username: string;
  password: string;
  mineId: string;
}

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const [mines, setMines] = useState<{ id: number; name: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginForm>();

  // Fetch mines for dropdown
  useEffect(() => {
    axiosClient.get("/mines").then((res) => {
      if (res.data) setMines(res.data);
    });
  }, []);

  const { setUser } = useUser(); // inside your component

  const onSubmit = async (data: AdminLoginForm) => {
    try {
      setErrorMsg("");

      const res = await axiosClient.post("/auth/admin-login", data);

      if (res.data?.success) {
        // Save admin info in context
        setUser(res.data.admin); // backend should return { id, username, name, role: "ADMIN", mineId }

        // Redirect to admin dashboard
        router.push("dashboard");
      } else {
        setErrorMsg(res.data.error || "Login failed");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.response?.data || err.message);
      } else {
        console.error(err);
      }
      setErrorMsg("Login failed. Please try again.");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

        {errorMsg && (
          <div className="mb-4 text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block font-semibold mb-2">Username</label>
            <input
              {...register("username", { required: "Username is required" })}
              className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold mb-2">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Mine selection */}
          <div>
            <label className="block font-semibold mb-2">Select Mine</label>
            <select
              {...register("mineId", {
                required: "Mine selection is required",
              })}
              className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Select a mine --</option>
              {mines.map((mine) => (
                <option key={mine.id} value={mine.id}>
                  {mine.name}
                </option>
              ))}
            </select>
            {errors.mineId && (
              <p className="text-red-400 text-sm mt-1">
                {errors.mineId.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
