"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { type Company, type CompanyFormData } from "@/types/company";
import { type ApiResponse } from "@/types/api";
import { toast } from "sonner";
import { uploadToCloudinary, UPLOAD_FOLDERS } from "@/lib/upload";

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = (await api.companies.getAll()) as ApiResponse<Company[]>;
      if (res.success && res.data) {
        setCompanies(res.data);
      } else {
        setError(res.message || res.error || "Failed to load companies");
      }
    } catch (err) {
      setError("An unexpected error occurred while loading companies.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const addCompany = async (formData: CompanyFormData, logoFile?: File) => {
    const previousCompanies = [...companies];
    const temporaryId = `temp-${Date.now()}`;
    const optimisticCompany: Company = {
      id: temporaryId,
      name: formData.name,
      description: formData.description,
      website: formData.website,
      location: formData.location,
      logo: formData.logo || "",
      createdAt: new Date().toISOString(),
    };

    setCompanies((prev) => [optimisticCompany, ...prev]);

    const res = (await api.companies.create(formData)) as ApiResponse<Company>;
    if (res.success && res.data) {
      const dataWithId = res.data as Company & { _id?: string };
      const companyId = res.data.id || dataWithId._id;
      
      if (logoFile && companyId) {
        const folder = `${UPLOAD_FOLDERS.companies(companyId)}/logos`;
        try {
          const uploadRes = await uploadToCloudinary(logoFile, "companyLogo", { folder });
          const logoUrl = uploadRes.secure_url || uploadRes.url;
          
          await api.companies.update(companyId, { logo: logoUrl });
          res.data.logo = logoUrl;
        } catch {
          toast.error("Logo upload failed, but company was created");
        }
      }
      
      setCompanies((prev) =>
        prev.map((c) => (c.id === temporaryId ? res.data! : c)),
      );
      toast.success("Company created");
      return true;
    } else {
      setCompanies(previousCompanies);
      toast.error(res.message || res.error || "Failed to create company");
      return false;
    }
  };

  const updateCompany = async (id: string, formData: CompanyFormData) => {
    const previousCompanies = [...companies];
    const originalCompany = companies.find((c) => c.id === id);

    const optimisticCompany: Company = {
      id,
      name: formData.name,
      description: formData.description,
      website: formData.website,
      location: formData.location,
      logo: formData.logo || "",
      createdAt: originalCompany?.createdAt || new Date().toISOString(),
    };

    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? optimisticCompany : c)),
    );

    const res = (await api.companies.update(
      id,
      formData,
    )) as ApiResponse<Company>;
    if (res.success) {
      toast.success("Company updated");
      return true;
    } else {
      setCompanies(previousCompanies);
      toast.error(res.error || "Failed to update company");
      return false;
    }
  };

  const deleteCompany = async (id: string) => {
    const previousCompanies = [...companies];
    setCompanies((prev) => prev.filter((c) => c.id !== id));

    const res = await api.companies.delete(id);
    if (res.success) {
      toast.success("Company deleted");
      return true;
    } else {
      setCompanies(previousCompanies);
      toast.error(res.message || "Delete failed");
      return false;
    }
  };

  return {
    companies,
    loading,
    error,
    refresh: loadCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
  };
}
