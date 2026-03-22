import Link from "next/link";

function Navbar() {
  return (
    <div className="text-white">
      <div className="flex items-center justify-between px-5 mx-auto max-w-7xl h-16">
        <div className="">
          <Link href="/">
            <h1 className="text-2xl font-bold">
              Code <span className="text-yellow-400">Scrapper</span>
            </h1>
          </Link>
        </div>

        <ul className="flex font-medium items-center gap-5">
          <li className="hover:text-yellow-400 duration-300 cursor-pointer">
            <Link href="/">Home</Link>
          </li>

          <li className="hover:text-yellow-400 duration-300 cursor-pointer">
            <Link href="/dashboard/companies">Companies</Link>
          </li>
          <li className="hover:text-yellow-400 duration-300 cursor-pointer">
            <Link href="/dashboard/jobs">Jobs</Link>
          </li>
          <li className="hover:text-yellow-400 duration-300 cursor-pointer">
            <Link href="/findjobs">Find Jobs</Link>
          </li>
          <li className="hover:text-yellow-400 duration-300 cursor-pointer">
            <Link href="/favorite">Favorites</Link>
          </li>
          <li className="hover:text-yellow-400 duration-300 cursor-pointer">
            <Link href="/profile">Profile</Link>
          </li>
          <li className="hover:text-yellow-400 duration-300 cursor-pointer">
            Logout
          </li>

          <li className="hover:text-yellow-400 duration-300 cursor-pointer">
            <Link href="/login">login</Link>
          </li>
          <li className="hover:text-yellow-400 duration-300 cursor-pointer">
            <Link href="/register">Signup</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
