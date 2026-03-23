"use client";

import { useEffect } from "react";
import { login } from "@/actions/login";
import LoginForm from "@/components/auth/LoginForm";
import { useLocalStorage } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginInput } from "@/lib/schemas/login";

const Login = () => {
  const router = useRouter();
  const [user, setUser] = useLocalStorage<{ role?: string }>({
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
    const response = await login(data);

    if (response?.error) {
      toast.error(response.error);
      return;
    }

    setUser(response?.result);
    router?.push("/");
  };

  return (
    <div className="flex items-start justify-center w-xl m-auto z-10">
      <LoginForm onSubmit={onSubmit} />
    </div>
  );
};

export default Login;
