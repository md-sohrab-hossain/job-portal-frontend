"use client";

import { useState, useCallback, memo } from "react";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const SkillInput = memo(
  ({
    value = [],
    onChange,
    error,
  }: {
    value: string[];
    onChange: (skills: string[]) => void;
    error?: string;
  }) => {
    const [input, setInput] = useState("");

    const addSkill = useCallback(
      (skill: string) => {
        const trimmed = skill.trim();
        if (trimmed && !value.includes(trimmed)) {
          onChange([...value, trimmed]);
        }
        setInput("");
      },
      [value, onChange],
    );

    const removeSkill = useCallback(
      (skill: string) => {
        onChange(value.filter((s) => s !== skill));
      },
      [value, onChange],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
          e.preventDefault();
          addSkill(input);
        } else if (e.key === "Backspace" && !input && value.length > 0) {
          removeSkill(value[value.length - 1]);
        }
      },
      [input, addSkill, removeSkill, value],
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
      [],
    );

    const handleBlur = useCallback(() => {
      if (input.trim()) addSkill(input);
    }, [input, addSkill]);

    return (
      <div className="space-y-1">
        <Label className="text-sm text-gray-600 font-medium">
          Profile Skills
        </Label>
        <div
          className={`flex flex-wrap gap-2 min-h-10.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ${
            error ? "border-red-500" : "focus-within:border-yellow-400"
          }`}
        >
          {value.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-400/80 text-black text-xs rounded-md"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-red-600 cursor-pointer"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={value.length === 0 ? "Type skill and press Enter" : ""}
            className="flex-1 min-w-30 outline-none bg-transparent text-sm"
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

SkillInput.displayName = "SkillInput";

export { SkillInput };
