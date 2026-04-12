export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FIND_JOBS: "/findjobs",
  JOB_DETAILS: (id: string) => `/findjobs/${id}`,
  FAVORITE: "/favorite",
  PROFILE: "/profile",

  ADMIN: {
    HOME: "/",
    COMPANIES: "/dashboard/companies",
    JOBS: "/dashboard/jobs",
  },

  QUERY_PARAMS: {
    KEYWORD: "keyword",
    CATEGORY: "category",
  },
} as const;

export const getJobDetailsUrl = (id: string) => ROUTES.JOB_DETAILS(id);

export const getFindJobsUrl = (search?: string, category?: string) => {
  const params = new URLSearchParams();
  if (search) params.set(ROUTES.QUERY_PARAMS.KEYWORD, search);
  if (category) params.set(ROUTES.QUERY_PARAMS.CATEGORY, category);
  const query = params.toString();
  return query ? `${ROUTES.FIND_JOBS}?${query}` : ROUTES.FIND_JOBS;
};
