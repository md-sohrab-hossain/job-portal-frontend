export const COMPANY_FORM_FIELDS = [
  {
    name: "name",
    label: "Company Name",
    placeholder: "e.g. Acme Corp",
    type: "text",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Brief about the company...",
    type: "text",
    required: false,
  },
  {
    name: "website",
    label: "Website URL",
    placeholder: "https://example.com",
    type: "url",
    required: false,
  },
  {
    name: "location",
    label: "Location",
    placeholder: "e.g. Dhaka, Bangladesh",
    type: "text",
    required: false,
  },
] as const;
