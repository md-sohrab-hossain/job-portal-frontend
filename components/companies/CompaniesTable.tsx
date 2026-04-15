"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Building2, Loader2, AlertCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useCompanies } from "@/hooks/useCompanies";
import { type Company, type CompanyFormData } from "@/types/company";
import { CompanyRow } from "./CompanyRow";
import { CompanyFormModal } from "./CompanyFormModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

const EMPTY_FORM: CompanyFormData = {
  name: "",
  description: "",
  website: "",
  location: "",
  logo: "",
};

export default function CompaniesTable() {
  const {
    companies,
    loading,
    error,
    refresh,
    addCompany,
    updateCompany,
    deleteCompany,
  } = useCompanies();

  const [search, setSearch] = useState("");

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CompanyFormData>(EMPTY_FORM);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close modals on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowForm(false);
        setDeleteId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (company: Company) => {
    setFormData({
      name: company.name,
      description: company.description,
      website: company.website,
      location: company.location,
      logo: company.logo,
    });
    setEditingId(company.id);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: CompanyFormData, logoFile?: File) => {
    if (editingId) {
      return await updateCompany(editingId, data);
    } else {
      return await addCompany(data, logoFile);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await deleteCompany(deleteId);
    setDeleteId(null);
    setIsDeleting(false);
  };

  const filtered = useMemo(
    () =>
      companies.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [companies, search],
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Area */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
          <div className="w-full sm:w-auto flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Companies</h1>
            <p className="text-sm text-gray-500">
              Manage your company directory and details
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                className="pl-9 bg-gray-50/50 min-w-60"
                placeholder="Search companies…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={openCreate}
              className="bg-amber-400 hover:bg-amber-500 text-black font-medium gap-2 shrink-0"
            >
              <Plus className="h-4 w-4" /> Add Company
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white">
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
            </div>
          ) : error ? (
            <div className="text-center py-16 m-6 rounded-xl border border-red-100 bg-red-50">
              <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
              <p className="mt-2 text-red-600 font-medium">{error}</p>
              <Button
                onClick={refresh}
                variant="outline"
                size="sm"
                className="mt-4 border-red-200 text-red-500 bg-white hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 m-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto" />
              <p className="mt-3 text-gray-600 font-medium">
                {search
                  ? `No results for "${search}"`
                  : "No companies added yet"}
              </p>
              <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                {search
                  ? "Try adjusting your search terms."
                  : "Get started by adding your first company to the directory."}
              </p>
              {!search && (
                <Button
                  onClick={openCreate}
                  variant="outline"
                  className="mt-5 text-gray-600 hover:text-gray-900 border-gray-300 bg-white"
                >
                  Add your first company
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50 border-b border-gray-100">
                <TableRow className="hover:bg-gray-50">
                  <TableHead className="w-20 text-center font-semibold text-gray-600">
                    Logo
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600">
                    Company Details
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600 hidden md:table-cell">
                    Contact & Links
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600 hidden lg:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((company) => (
                  <CompanyRow
                    key={company.id}
                    company={company}
                    onEdit={openEdit}
                    onDelete={setDeleteId}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Modals */}
      <CompanyFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        initialData={formData}
        isEditing={!!editingId}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
