"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "@/lib/axiosClient";
import axios from "axios";

interface MineForm {
  name: string;
  description?: string;
  location: string;
  lat: string;
  lng: string;
}

interface AdminForm {
  username: string;
  password: string;
  name: string;
  phoneNo?: string;
  mineId: string;
}

interface MinerForm {
  username: string;
  password: string;
  name: string;
  phoneNo?: string;
  managedBy: string;
}

const SuperAdminDashboard: React.FC = () => {
  const [mines, setMines] = useState<{ id: number; name: string }[]>([]);
  const [admins, setAdmins] = useState<{ id: number; name: string }[]>([]);
  const [miners, setMiners] = useState<{ id: number; name: string }[]>([]);
  const [activeTab, setActiveTab] = useState("mine");

  // Fetch existing mines and admins for selects
  useEffect(() => {
    axiosClient.get("/mines").then((res) => setMines(res.data || []));
    axiosClient.get("/user/admin").then((res) => setAdmins(res.data || []));
    axiosClient.get("/user/miner").then((res) => setMiners(res.data || []));
  }, []);

  // Forms
  const mineForm = useForm<MineForm>();
  const adminForm = useForm<AdminForm>();
  const minerForm = useForm<MinerForm>();

  // Handlers
const createMine = async (data: MineForm) => {
  try {
    await axiosClient.post("/mine/create", data, {
      headers: { "x-user-id": "1" }, // Replace with actual SUPER_ADMIN id
    });
    alert("Mine created!");
    mineForm.reset();
  } catch (err) {
    if (axios.isAxiosError(err)) {
      alert(err.response?.data?.error || "Failed to create mine");
    } else {
      alert("Failed to create mine");
    }
  }
};

const createAdmin = async (data: AdminForm) => {
  try {
    await axiosClient.post("/user/admin/create", data, {
      headers: { "x-user-id": "1" },
    });
    alert("Admin created!");
    adminForm.reset();
  } catch (err) {
    if (axios.isAxiosError(err)) {
      alert(err.response?.data?.error || "Failed to create admin");
    } else {
      alert("Failed to create admin");
    }
  }
};

const createMiner = async (data: MinerForm) => {
  try {
    await axiosClient.post("/user/miner/create", data, {
      headers: { "x-user-id": "1" },
    });
    alert("Miner created!");
    minerForm.reset();
  } catch (err) {
    if (axios.isAxiosError(err)) {
      alert(err.response?.data?.error || "Failed to create miner");
    } else {
      alert("Failed to create miner");
    }
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            SUPER ADMIN DASHBOARD
          </h1>
          <p className="text-gray-400">Manage mines, admins, and miners from a single interface</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            {[
              { id: "mine", label: "Create Mine" },
              { id: "admin", label: "Create Admin" },
              { id: "miner", label: "Create Miner" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Create Mine Form */}
          {activeTab === "mine" && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <span className="bg-blue-600 p-2 rounded-md mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </span>
                Create New Mine
              </h2>
              <form onSubmit={mineForm.handleSubmit(createMine)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Mine Name</label>
                    <input
                      {...mineForm.register("name", { required: "Name required" })}
                      placeholder="Enter mine name"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    <input
                      {...mineForm.register("location", { required: "Location required" })}
                      placeholder="Enter location"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <input
                    {...mineForm.register("description")}
                    placeholder="Enter description (optional)"
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Latitude</label>
                    <input
                      {...mineForm.register("lat", { required: "Latitude required" })}
                      placeholder="Enter latitude"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Longitude</label>
                    <input
                      {...mineForm.register("lng", { required: "Longitude required" })}
                      placeholder="Enter longitude"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Create Mine
                </button>
              </form>
            </div>
          )}

          {/* Create Admin Form */}
          {activeTab === "admin" && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <span className="bg-green-600 p-2 rounded-md mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                Create New Admin
              </h2>
              <form onSubmit={adminForm.handleSubmit(createAdmin)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                    <input
                      {...adminForm.register("username", { required: "Username required" })}
                      placeholder="Enter username"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <input
                      type="password"
                      {...adminForm.register("password", { required: "Password required" })}
                      placeholder="Enter password"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input
                      {...adminForm.register("name", { required: "Name required" })}
                      placeholder="Enter full name"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number (Optional)</label>
                    <input
                      {...adminForm.register("phoneNo")}
                      placeholder="Enter phone number"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Assign Mine</label>
                  <select
                    {...adminForm.register("mineId", { required: "Mine required" })}
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Select a mine</option>
                    {mines.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-green-600 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Create Admin
                </button>
              </form>
            </div>
          )}

          {/* Create Miner Form */}
          {activeTab === "miner" && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <span className="bg-yellow-600 p-2 rounded-md mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </span>
                Create New Miner
              </h2>
              <form onSubmit={minerForm.handleSubmit(createMiner)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                    <input
                      {...minerForm.register("username", { required: "Username required" })}
                      placeholder="Enter username"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <input
                      type="password"
                      {...minerForm.register("password", { required: "Password required" })}
                      placeholder="Enter password"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input
                      {...minerForm.register("name", { required: "Name required" })}
                      placeholder="Enter full name"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number (Optional)</label>
                    <input
                      {...minerForm.register("phoneNo")}
                      placeholder="Enter phone number"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Assign Admin</label>
                  <select
                    {...minerForm.register("managedBy", { required: "Admin required" })}
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Select an admin</option>
                    {admins.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-yellow-600 rounded-lg font-medium hover:bg-yellow-700 transition flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Create Miner
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-gray-800 rounded-xl p-5 flex items-center">
            <div className="bg-blue-600 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold">{mines.length}</h3>
              <p className="text-gray-400">Total Mines</p>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-5 flex items-center">
            <div className="bg-green-600 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold">{admins.length}</h3>
              <p className="text-gray-400">Total Admins</p>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-5 flex items-center">
            <div className="bg-yellow-600 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold">{miners.length}</h3>
              <p className="text-gray-400">Total Miners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;