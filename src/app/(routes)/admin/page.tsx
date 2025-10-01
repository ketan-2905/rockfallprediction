// "use client";

// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import axiosClient from "@/lib/axiosClient";
// import { useUser } from "@/context/UserProvider";
// import axios from "axios";

// interface AdminLoginForm {
//   username: string;
//   password: string;
//   mineId: string;
// }

// const AdminLogin: React.FC = () => {
//   const router = useRouter();
//   const [mines, setMines] = useState<{ id: number; name: string }[]>([]);
//   const [errorMsg, setErrorMsg] = useState<string>("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<AdminLoginForm>();

//   // Fetch mines for dropdown
//   useEffect(() => {
//     axiosClient.get("/mines").then((res) => {
//       if (res.data) setMines(res.data);
//     });
//   }, []);

//   const { setUser } = useUser(); // inside your component

//   const onSubmit = async (data: AdminLoginForm) => {
//     try {
//       setErrorMsg("");

//       const res = await axiosClient.post("/auth/admin-login", data);

//       if (res.data?.success) {
//         // Save admin info in context
//         setUser(res.data.admin); // backend should return { id, username, name, role: "ADMIN", mineId }

//         // Redirect to admin dashboard
//         router.push("dashboard");
//       } else {
//         setErrorMsg(res.data.error || "Login failed");
//       }
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         console.error("Axios error:", err.response?.data || err.message);
//       } else {
//         console.error(err);
//       }
//       setErrorMsg("Login failed. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center px-4">
//       <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

//         {errorMsg && (
//           <div className="mb-4 text-red-400 text-sm text-center">
//             {errorMsg}
//           </div>
//         )}

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Username */}
//           <div>
//             <label className="block font-semibold mb-2">Username</label>
//             <input
//               {...register("username", { required: "Username is required" })}
//               className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="Enter your username"
//             />
//             {errors.username && (
//               <p className="text-red-400 text-sm mt-1">
//                 {errors.username.message}
//               </p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block font-semibold mb-2">Password</label>
//             <input
//               type="password"
//               {...register("password", { required: "Password is required" })}
//               className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="Enter your password"
//             />
//             {errors.password && (
//               <p className="text-red-400 text-sm mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Mine selection */}
//           <div>
//             <label className="block font-semibold mb-2">Select Mine</label>
//             <select
//               {...register("mineId", {
//                 required: "Mine selection is required",
//               })}
//               className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//             >
//               <option value="">-- Select a mine --</option>
//               {mines.map((mine) => (
//                 <option key={mine.id} value={mine.id}>
//                   {mine.name}
//                 </option>
//               ))}
//             </select>
//             {errors.mineId && (
//               <p className="text-red-400 text-sm mt-1">
//                 {errors.mineId.message}
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
//           >
//             {isSubmitting ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;

// "use client";

// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import axiosClient from "@/lib/axiosClient";
// import { useUser } from "@/context/UserProvider";
// import axios from "axios";

// interface AdminLoginForm {
//   username: string;
//   password: string;
//   mineId: string;
//   lat1: string;
//   lon1: string;
//   lat2: string;
//   lon2: string;
// }

// const AdminLogin: React.FC = () => {
//   const router = useRouter();
//   const [mines, setMines] = useState<{ id: number; name: string }[]>([]);
//   const [errorMsg, setErrorMsg] = useState<string>("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<AdminLoginForm>();

//   // Fetch mines for dropdown
//   useEffect(() => {
//     axiosClient.get("/mines").then((res) => {
//       if (res.data) setMines(res.data);
//     });
//   }, []);

//   const { setUser } = useUser();

//   const onSubmit = async (data: AdminLoginForm) => {
//     try {
//       setErrorMsg("");

//       // 👉 Mock bounding box (not sent to backend)
//       console.log("Mine Area Bounding Box:");
//       console.log("Top-Left:", data.lat1, data.lon1);
//       console.log("Bottom-Right:", data.lat2, data.lon2);

//       const res = await axiosClient.post("/auth/admin-login", {
//         username: data.username,
//         password: data.password,
//         mineId: data.mineId,
//       });

//       if (res.data?.success) {
//         setUser(res.data.admin);
//         router.push("/dashboard");
//       } else {
//         setErrorMsg(res.data.error || "Login failed");
//       }
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         console.error("Axios error:", err.response?.data || err.message);
//       } else {
//         console.error(err);
//       }
//       setErrorMsg("Login failed. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
//       <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

//         {errorMsg && (
//           <div className="mb-4 text-red-400 text-sm text-center">
//             {errorMsg}
//           </div>
//         )}

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Username */}
//           <div>
//             <label className="block font-semibold mb-2">Username</label>
//             <input
//               {...register("username", { required: "Username is required" })}
//               className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="Enter your username"
//             />
//             {errors.username && (
//               <p className="text-red-400 text-sm mt-1">
//                 {errors.username.message}
//               </p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block font-semibold mb-2">Password</label>
//             <input
//               type="password"
//               {...register("password", { required: "Password is required" })}
//               className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="Enter your password"
//             />
//             {errors.password && (
//               <p className="text-red-400 text-sm mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Mine selection */}
//           <div>
//             <label className="block font-semibold mb-2">Select Mine</label>
//             <select
//               {...register("mineId", {
//                 required: "Mine selection is required",
//               })}
//               className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//             >
//               <option value="">-- Select a mine --</option>
//               {mines.map((mine) => (
//                 <option key={mine.id} value={mine.id}>
//                   {mine.name}
//                 </option>
//               ))}
//             </select>
//             {errors.mineId && (
//               <p className="text-red-400 text-sm mt-1">
//                 {errors.mineId.message}
//               </p>
//             )}
//           </div>

//           {/* Bounding Box - Top Left */}
//           <div>
//             <label className="block font-semibold mb-2">Top-Left Latitude</label>
//             <input
//               type="text"
//               {...register("lat1", { required: "Top-left latitude is required" })}
//               className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="e.g. -23.4567"
//             />
//             {errors.lat1 && (
//               <p className="text-red-400 text-sm mt-1">{errors.lat1.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">Top-Left Longitude</label>
//             <input
//               type="text"
//               {...register("lon1", { required: "Top-left longitude is required" })}
//               className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="e.g. 145.6789"
//             />
//             {errors.lon1 && (
//               <p className="text-red-400 text-sm mt-1">{errors.lon1.message}</p>
//             )}
//           </div>

//           {/* Bounding Box - Bottom Right */}
//           <div>
//             <label className="block font-semibold mb-2">Bottom-Right Latitude</label>
//             <input
//               type="text"
//               {...register("lat2", { required: "Bottom-right latitude is required" })}
//               className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="e.g. -23.5567"
//             />
//             {errors.lat2 && (
//               <p className="text-red-400 text-sm mt-1">{errors.lat2.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block font-semibold mb-2">Bottom-Right Longitude</label>
//             <input
//               type="text"
//               {...register("lon2", { required: "Bottom-right longitude is required" })}
//               className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="e.g. 145.7789"
//             />
//             {errors.lon2 && (
//               <p className="text-red-400 text-sm mt-1">{errors.lon2.message}</p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
//           >
//             {isSubmitting ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;

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
  // Coordinates
  lat1: string;
  lon1: string;
  lat2: string;
  lon2: string;
  // Drone images will be handled separately
}

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const [mines, setMines] = useState<{ id: number; name: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [useDroneImages, setUseDroneImages] = useState(false);
  const [droneImages, setDroneImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginForm>();

  const { setUser } = useUser();

  // Fetch mines for dropdown
  useEffect(() => {
    axiosClient.get("/mines").then((res) => {
      if (res.data) setMines(res.data);
    });
  }, []);

  const onSubmit = async (data: AdminLoginForm) => {
    try {
      setErrorMsg("");

      if (useDroneImages) {
        console.log("Drone images uploaded:", droneImages);
      } else {
        console.log("Mine Area Bounding Box:");
        console.log("Top-Left:", data.lat1, data.lon1);
        console.log("Bottom-Right:", data.lat2, data.lon2);
      }

      const res = await axiosClient.post("/auth/admin-login", {
        username: data.username,
        password: data.password,
        mineId: data.mineId,
      });

      if (res.data?.success) {
        setUser(res.data.admin);
        router.push("/dashboard");
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

  const handleDroneUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setDroneImages((prev) => [...prev, ...filesArray].slice(0, 200)); // max 200 images
  };

  const removeDroneImage = (index: number) => {
    setDroneImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md overflow-y-auto max-h-[90vh]">
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

          {/* Option Toggle: Coordinates vs Drone Images */}
          {/* <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={useDroneImages}
              onChange={() => setUseDroneImages((prev) => !prev)}
              className="accent-blue-500"
            />
            <span>Use Drone Images instead of coordinates</span>
          </div> */}

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Coordinates</span>

            <button
              type="button"
              onClick={() => setUseDroneImages((prev) => !prev)}
              className={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none ${
                useDroneImages ? "bg-blue-600" : "bg-gray-400"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${
                  useDroneImages ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <span className="text-sm font-medium">Drone Images</span>
          </div>

          {!useDroneImages && (
            <>
              {/* Coordinates Inputs */}
              <div>
                <label className="block font-semibold mb-2">
                  Top-Left Latitude
                </label>
                <input
                  type="text"
                  {...register("lat1", {
                    required: "Top-left latitude is required",
                  })}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. -23.4567"
                />
                {errors.lat1 && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.lat1.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Top-Left Longitude
                </label>
                <input
                  type="text"
                  {...register("lon1", {
                    required: "Top-left longitude is required",
                  })}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 145.6789"
                />
                {errors.lon1 && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.lon1.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Bottom-Right Latitude
                </label>
                <input
                  type="text"
                  {...register("lat2", {
                    required: "Bottom-right latitude is required",
                  })}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. -23.5567"
                />
                {errors.lat2 && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.lat2.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Bottom-Right Longitude
                </label>
                <input
                  type="text"
                  {...register("lon2", {
                    required: "Bottom-right longitude is required",
                  })}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 145.7789"
                />
                {errors.lon2 && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.lon2.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* {useDroneImages && (
            <>
              <div>
                <label className="block font-semibold mb-2">Upload Drone Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleDroneUpload}
                  className="w-full p-2 rounded bg-gray-700 text-white outline-none"
                />
              </div>

              {droneImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2 max-h-60 overflow-y-auto border p-2 rounded bg-gray-700">
                  {droneImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeDroneImage(index)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )} */}

          {useDroneImages && (
            <>
              <div>
                <label className="block font-semibold mb-2">
                  Upload Drone Images
                </label>

                {/* Drag & Drop Area */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const droppedFiles = Array.from(
                      e.dataTransfer.files
                    ).filter((file) => file.type.startsWith("image/"));
                    setDroneImages((prev) =>
                      [...prev, ...droppedFiles].slice(0, 200)
                    );
                  }}
                  className="w-full p-6 rounded border-2 border-dashed border-gray-500 bg-gray-800 text-center cursor-pointer hover:border-blue-500 transition"
                  onClick={() =>
                    document.getElementById("drone-upload-input")?.click()
                  }
                >
                  <p className="text-gray-400">
                    Drag & drop images here, or click to select
                  </p>
                  <input
                    id="drone-upload-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleDroneUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Uploaded Images Preview */}
              {droneImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2 max-h-60 overflow-y-auto border-2 border-dashed border-gray-500 p-2 rounded bg-gray-700">
                  {droneImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Drone preview"
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeDroneImage(index)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-800 shadow-md rounded-xl p-6 text-center text-white">
          <h2 className="text-xl font-semibold  mb-4">Demo Credentials</h2>
          <p className="">
            <span className="font-medium">Username:</span> Admin_2
          </p>
          <p className=" mt-2">
            <span className="font-medium">Password:</span> pass@123
          </p>
          <p className=" mt-2">
            <span className="font-medium">Select Mine:</span>
            Chandrapur Ridge Mine
          </p>
          <p className="mt-2">
            <span className="font-medium">Top-Left Latitude:</span> -19.9500
          </p>
          <p className="mt-2">
            <span className="font-medium">Top-Left Longitude:</span> 79.2500
          </p>
          <p className="mt-2">
            <span className="font-medium">Bottom-Right Latitude:</span> -20.0500
          </p>
          <p className="mt-2">
            <span className="font-medium">Bottom-Right Longitude:</span> 79.3500
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
