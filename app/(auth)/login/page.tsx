"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@mantine/hooks";
import { toast } from "sonner";
import { LoginInput } from "@/lib/schemas/login";
import LoginForm from "@/components/auth/LoginForm";
import { api } from "@/lib/api";
import { ROUTES } from "@/lib/routes";
import { AuthUser } from "@/types/api";

const Login = () => {
  const router = useRouter();
  const [user, setUserData] = useLocalStorage<{ role?: string }>({
    key: "userData",
    defaultValue: {},
  });

  useEffect(() => {
    if (user?.role == "recruiter") {
      router?.push("/admin/companies");
    } else if (user?.role == "student") {
      router.push("/");
    }
  }, []);

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await api.auth.login(data);

      if (!response.success) {
        toast.error(response.message || "Login failed");
        return;
      }

      toast.success("Login successful");
      setUserData(response.data as AuthUser);

      const user = response.data as { role?: string } | undefined;
      if (user?.role === "recruiter") {
        router.push(ROUTES.ADMIN.HOME);
      } else {
        router.push(ROUTES.HOME);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-start justify-center w-xl m-auto z-10">
      <LoginForm onSubmit={onSubmit} />
    </div>
  );
};

export default Login;
