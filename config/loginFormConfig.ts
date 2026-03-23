export const LOGIN_FORM_FIELDS = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter password",
  },
] as const;

export const LOGIN_ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "recruiter", label: "Recruiter" },
];
