"use client";

import { useState } from "react";
import Link from "next/link";
import { Role } from "@/types/user";
import { useAuth } from "@/context/auth-context";
import { ROUTES } from "@/lib/routes";
import { toast } from "sonner";
import { Menu, X, LogOut, User as UserIcon, Home, Briefcase, Heart, Building2 } from "lucide-react";

const NAV_LINKS: Record<Role, { href: string; label: string; icon: any }[]> = {
  recruiter: [
    { href: ROUTES.ADMIN.COMPANIES, label: "Companies", icon: Building2 },
    { href: ROUTES.ADMIN.JOBS, label: "Jobs", icon: Briefcase },
  ],
  student: [
    { href: ROUTES.FIND_JOBS, label: "Find Jobs", icon: Briefcase },
    { href: ROUTES.FAVORITE, label: "Favorites", icon: Heart },
  ],
};

const DEFAULT_ROLE: Role = "student";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setIsMenuOpen(false);
  };

  const role: Role = user?.role ?? DEFAULT_ROLE;
  const roleLinks = NAV_LINKS[role];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-[var(--z-navbar)] w-full bg-[#100818]/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-6 mx-auto max-w-7xl h-16">
        <Link href="/" className="group" onClick={() => setIsMenuOpen(false)}>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="p-1.5 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a5 5 0 1110 0 5 5 0 01-10 0z" />
              </svg>
            </span>
            Career<span className="text-primary font-extrabold italic">Pulse</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex font-medium items-center gap-8">
          <li>
            <Link href="/" className="hover:text-primary transition-colors duration-300">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              {roleLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={ROUTES.PROFILE} className="hover:text-primary transition-colors duration-300">Profile</Link>
              </li>
              <li className="ml-4">
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] cursor-pointer"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <div className="flex items-center gap-4 ml-4">
              <Link href={ROUTES.LOGIN} className="text-sm font-semibold hover:text-primary transition-colors">
                Login
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="px-6 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-64px)] bg-[#100818] backdrop-blur-2xl border-b border-white/10 animate-in slide-in-from-top duration-300 z-50">
          <div className="flex flex-col p-8 gap-8 overflow-y-auto h-full">
            <Link
              href="/"
              className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={20} /> Home
            </Link>

            {isAuthenticated ? (
              <>
                {roleLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon size={20} /> {link.label}
                  </Link>
                ))}
                <Link
                  href={ROUTES.PROFILE}
                  className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon size={20} /> Profile
                </Link>
                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-lg font-medium text-red-400 hover:text-red-300 transition-colors w-full text-left cursor-pointer"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4 pt-2">
                <Link
                  href={ROUTES.LOGIN}
                  className="flex items-center justify-center p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-lg font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="flex items-center justify-center p-3 rounded-xl bg-primary text-white text-lg font-bold shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
