"use client";

import { Eye, EyeOff } from "lucide-react";

interface PasswordToggleProps {
  show: boolean;
  toggle: () => void;
}

const PasswordToggle = ({ show, toggle }: PasswordToggleProps) => (
  <button
    type="button"
    onClick={toggle}
    className="text-gray-500 hover:text-gray-700 cursor-pointer"
  >
    {show ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
);

export default PasswordToggle;
