"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface SearchFormProps {
  onSearch: (searchTerm: string) => void;
}

interface FormValues {
  query: string;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    if (data.query?.trim()) {
      onSearch(data.query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-2/5 shadow-lg border pl-3 bg-white text-slate-600 rounded-full items-center gap-4 mx-auto">
        <input
          type="text"
          {...register("query")}
          placeholder="Find your dream job"
          className="outline-none border-none bg-white w-full"
        />
        <Button
          type="submit"
          className="rounded-r-full bg-white hover:bg-transparent"
        >
          <Search className="h-5 w-5 bg-transparent text-slate-600" />
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
