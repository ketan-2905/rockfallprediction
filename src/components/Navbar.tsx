// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { Menu, X } from "lucide-react"; // icons

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <header className="sticky top-0 left-0 right-0 z-[1001] bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
//       {/* Top info bar */}
//       <div className="px-4 py-2 flex items-center justify-between">
//         <span className="text-gray-300 text-sm font-medium">
//           Rockfall Prediction
//         </span>

//         {/* Desktop Menu */}
//         <nav className="hidden md:block">
//           <ul className="flex items-center gap-6 text-sm font-medium text-gray-300">
//             <li>
//               <Link href="/dashboard" className="hover:text-white transition-colors">
//                 Dashboard
//               </Link>
//             </li>
//             <li>
//               <Link href="/map" className="hover:text-white transition-colors">
//                 Map
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/miner"
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//               >
//                 Miner
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/admin"
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//               >
//                 Admin
//               </Link>
//             </li>
//           </ul>
//         </nav>

//         {/* Mobile Menu Button */}
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="md:hidden text-gray-300 hover:text-white"
//         >
//           {isOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Dropdown */}
//       {isOpen && (
//         <nav className="md:hidden bg-gray-800 border-t border-gray-700">
//           <ul className="flex flex-col p-4 gap-4 text-sm font-medium text-gray-300">
//             <li>
//               <Link
//                 href="/dashboard"
//                 className="block hover:text-white transition-colors"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Dashboard
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/map"
//                 className="block hover:text-white transition-colors"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Map
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/miner"
//                 className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Miner
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/admin"
//                 className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Admin
//               </Link>
//             </li>
//           </ul>
//         </nav>
//       )}
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-[1001] bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 p-2">
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="text-gray-300 text-sm font-medium">
          Rockfall Prediction
        </span>

        {/* Desktop Menu */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-medium text-gray-300">
            {user ? (
              <>
                {/* Common Dashboard */}
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>

                {/* Role-specific Links */}
                {user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? (
                  <li>
                    <Link
                      href="/map"
                      className="hover:text-white transition-colors"
                    >
                      Map
                    </Link>
                  </li>
                ) : null}

                {user.role === "MINER" ? (
                  <li>
                    <Link
                      href="/miner/tasks"
                      className="hover:text-white transition-colors"
                    >
                      Tasks
                    </Link>
                  </li>
                ) : null}

                {/* Username + Logout */}
                <li className="ml-4 text-gray-200">{user.username}</li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Show login buttons if nobody is logged in */}
                <li>
                  <Link
                    href="/admin"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Admin Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/miner
              "
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Miner Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-300 hover:text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <nav className="md:hidden bg-gray-800 border-t border-gray-700">
          <ul className="flex flex-col p-4 gap-4 text-sm font-medium text-gray-300">
            {user ? (
              <>
                <li>
                  <Link
                    href="/dashboard"
                    className="block hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>

                {user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? (
                  <li>
                    <Link
                      href="/map"
                      className="block hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Map
                    </Link>
                  </li>
                ) : null}

                {user.role === "MINER" ? (
                  <li>
                    <Link
                      href="/miner/tasks"
                      className="block hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Tasks
                    </Link>
                  </li>
                ) : null}

                <li className="text-gray-200">{user.username}</li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/admin
                    "
                    className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/miner/login"
                    className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    Miner Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
