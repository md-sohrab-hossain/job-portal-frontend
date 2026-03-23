export const REGISTER_FORM_FIELDS = [
  {
    name: "fullname",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email",
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "text",
    placeholder: "+1234567890",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter password",
  },
] as const;

export const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "recruiter", label: "Recruiter" },
];
