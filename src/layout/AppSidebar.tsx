"use client";
import { motion } from "framer-motion";
import { Sparkles, Orbit, Rocket, BrushCleaning, Phone } from "lucide-react"; // Add this at the top
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  GridIcon,
  Hotel,
  Car,
  Users,
  Wallet,
  Settings,
  ChevronDownIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [
      { name: "Dashboard", path: "/" },
      { name: "Home Banner", path: "/dashboard/homebanner" },

    ],
  },
  {
    icon: <Hotel />,
    name: "Hotels",
    subItems: [
      { name: "All Hotels", path: "/hotel" },
      { name: "Add Hotel", path: "/hotel/add" },
    ],
  },
   {
    icon: <Phone />,
    name: "Inquiries",
 path:"/inquiries"
  },

  {
    icon: <BrushCleaning />,
    name: "Cleaning",
    subItems: [
      { name: "Cleaning HomeBanner", path: "/cleaning/banner" },
      { name: "All Services", path: "/cleaning" },
      { name: "Add Service", path: "/cleaning/add" },
    ],
  },
  {
    icon: <Car />,
    name: "Rides",
    subItems: [
      { name: "All Rides", path: "/admin/rides" },
      { name: "Drivers", path: "/admin/rides/drivers" },
    ],
  },
  {
    icon: <Users />,
    name: "Users",
    path: "/admin/users",
  },
  {
    icon: <Wallet />,
    name: "Payments",
    path: "/admin/payments",
  },
  {
    icon: <Settings />,
    name: "Settings",
    path: "/admin/settings",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const router = useRouter()
  const [openSubmenu, setOpenSubmenu] = useState<{ index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => pathname?.startsWith(path),
    [pathname]
  );

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { index }));
  };

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `submenu-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  return (
    <aside
      className={`fixed  pl-5  top-0 left-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 h-screen border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out z-50
        ${isExpanded || isMobileOpen
          ? "w-[280px]"
          : isHovered
            ? "w-[280px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >


        <Link href="/" className="relative flex items-center gap-3 cursor-pointer group">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              {/* Main Logo Text */}
              <motion.div
                className="relative flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 250, damping: 12 }}
              >
                {/* Floating Icons */}
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-sky-400"
                >
                  <Sparkles size={18} />
                </motion.span>

                {/* Animated Text */}
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  whileHover={{ color: "#0284c7" }}
                  className="text-2xl font-extrabold text-blue-700 tracking-wide relative"
                >
                  Multiserv
                  {/* Glow effect */}
                  {/* <span className="absolute inset-0 blur-md opacity-30 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg -z-10"></span> */}
                </motion.span>

                {/* Rotating Icon */}
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="text-sky-400"
                >
                  <Orbit size={18} />
                </motion.span>
              </motion.div>

              {/* Extra Decorative Floating Icon */}
              <motion.div
                animate={{ x: [0, 5, 0], y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-[-8px] right-[-10px] text-blue-400 opacity-60"
              >
                <Rocket size={14} />
              </motion.div>
            </>
          ) : (
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className="flex items-start justify-center bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg p-2"
            >
              <Sparkles className="text-white" size={22} />
            </motion.div>
          )}
        </Link>

      </div>

      {/* Menu */}
      <div className="flex flex-col overflow-y-auto no-scrollbar duration-300  ease-linear">
        <nav className="mb-6">
          <h2
            className={`mb-4 uppercase flex text-gray-400`}
          >
            Menu
          </h2>

          <ul className="flex flex-col gap-3">
            {navItems.map((nav, index) => (
              <li key={nav.name}>
                {nav.subItems ? (
                  <>
                    <button
                      onClick={() => handleSubmenuToggle(index)}
                      className={`menu-item group flex items-center gap-3 rounded-lg transition-all duration-200 
    ${openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"} 
    `}
                    >
                      <span>{nav.icon}</span>
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span className="menu-item-text">{nav.name}</span>
                      )}
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <ChevronDownIcon
                          className={`ml-auto w-5 h-5 transition-transform ${openSubmenu?.index === index ? "rotate-180" : ""
                            }`}
                        />
                      )}
                    </button>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <div
                        ref={(el) => {
                          subMenuRefs.current[`submenu-${index}`] = el;
                        }}
                        className="overflow-hidden transition-all duration-300"
                        style={{
                          height:
                            openSubmenu?.index === index
                              ? `${subMenuHeight[`submenu-${index}`]}px`
                              : "0px",
                        }}
                      >
                        <ul className="mt-2 ml-9 space-y-1">
                          {nav.subItems.map((sub) => (
                            <li key={sub.name} onClick={() => router.push(sub.path)}>
                              <Link
                                href={nav.path || "#"}
                                className={`menu-item group flex items-center gap-3 rounded-lg transition-all duration-200 
    ${isActive(sub.path || "") ? "menu-item-active" : "menu-item-inactive"} 
    ${!isExpanded && !isHovered
                                    ? "lg:justify-center px-0"
                                    : "lg:justify-start px-3"
                                  }`}
                              >

                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={nav.path || "#"}
                    className={`menu-item ${isActive(nav.path || "")
                      ? "menu-item-active"
                      : "menu-item-inactive"
                      }`}
                  >
                    <span className="p-0">{nav.icon}</span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
