export const JOB_FORM_FIELDS = [
  {
    name: "title",
    label: "Job Title",
    placeholder: "e.g. Frontend Developer",
    type: "text",
    required: true,
  },
  {
    name: "description",
    label: "Job Description",
    placeholder: "Describe the role and responsibilities...",
    type: "textarea",
    required: true,
  },
  {
    name: "requirements",
    label: "Requirements",
    placeholder: "React, TypeScript, Tailwind (comma separated)",
    type: "text",
    required: true,
  },
  {
    name: "salary",
    label: "Salary (Monthly)",
    placeholder: "e.g. 50000",
    type: "number",
    required: true,
  },
  {
    name: "location",
    label: "Location",
    placeholder: "e.g. Dhaka, Remote",
    type: "text",
    required: true,
  },
  {
    name: "position",
    label: "Open Positions",
    placeholder: "e.g. 2",
    type: "number",
    required: true,
  },
] as const;

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];

export const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Junior",
  "Mid-Level",
  "Senior",
  "Lead",
  "Director",
];
