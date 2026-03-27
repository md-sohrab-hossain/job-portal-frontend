"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@mantine/hooks";
import { useSyncExternalStore } from "react";

type Role = "recruiter" | "student";

interface UserData {
  data: {
    id: string;
    role: Role;
  };
}

const NAV_LINKS: Record<Role, { href: string; label: string }[]> = {
  recruiter: [
    { href: "/dashboard/companies", label: "Companies" },
    { href: "/dashboard/jobs", label: "Jobs" },
  ],
  student: [
    { href: "/findjobs", label: "Find Jobs" },
    { href: "/favorite", label: "Favorites" },
  ],
};

const DEFAULT_ROLE: Role = "student";

const useIsClientMounted = () =>
  useSyncExternalStore(
    () => () => {}, // no external store to subscribe to
    () => true, // client snapshot → mounted
    () => false, // server snapshot → not mounted
  );

const NavLink = ({ href, label }: { href: string; label: string }) => (
  <li>
    <Link
      href={href}
      className="hover:text-yellow-400 transition-colors duration-300"
    >
      {label}
    </Link>
  </li>
);

const NavButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <li>
    <button
      onClick={onClick}
      className="hover:text-yellow-400 transition-colors duration-300 cursor-pointer"
    >
      {label}
    </button>
  </li>
);

const Navbar = () => {
  const router = useRouter();
  const mounted = useIsClientMounted();
  const [user, setUser] = useLocalStorage<UserData | null>({
    key: "userData",
    defaultValue: null,
  });

  const handleLogout = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
      cache: "no-cache",
    });
    setUser(null);
    router.push("/login");
  };

  const isLoggedIn = mounted && Boolean(user?.data);
  const role: Role = user?.data?.role ?? DEFAULT_ROLE;
  const roleLinks = NAV_LINKS[role];

  return (
    <nav className="text-white bg-primaryColor">
      <div className="flex items-center justify-between px-5 mx-auto max-w-7xl h-16">
        <Link href="/">
          <h1 className="text-2xl font-bold">
            Code <span className="text-yellow-400">Scrapper</span>
          </h1>
        </Link>

        <ul className="flex font-medium items-center gap-5">
          <NavLink href="/" label="Home" />

          {!mounted ? (
            <li
              className="w-32 h-4 bg-white/10 rounded animate-pulse"
              aria-hidden
            />
          ) : isLoggedIn ? (
            <>
              {roleLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
              <NavLink href="/profile" label="Profile" />
              <NavButton label="Logout" onClick={handleLogout} />
            </>
          ) : (
            <>
              <NavLink href="/login" label="Login" />
              <NavLink href="/register" label="Signup" />
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
