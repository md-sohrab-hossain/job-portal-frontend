"use client";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Edit2, Trash2, MapPin, Globe } from "lucide-react";
import { type Company } from "@/types/company";

interface CompanyRowProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
}

export function CompanyRow({ company, onEdit, onDelete }: CompanyRowProps) {
  return (
    <TableRow className="hover:bg-amber-50/30 transition-colors group">
      <TableCell className="text-center align-top pt-5">
        <Avatar className="h-11 w-11 mx-auto ring-1 ring-gray-200 shadow-sm">
          <AvatarImage
            src={company.logo}
            alt={company.name}
            className="object-cover bg-white"
          />
          <AvatarFallback className="bg-amber-100 text-amber-700 font-bold">
            {company.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </TableCell>

      <TableCell className="align-top pt-5">
        <div className="font-bold text-gray-900 text-base">{company.name}</div>
        {company.description ? (
          <div className="text-sm text-gray-500 mt-1 line-clamp-2 max-w-md">
            {company.description}
          </div>
        ) : (
          <div className="text-sm text-gray-400 italic mt-1">
            No description
          </div>
        )}
      </TableCell>

      <TableCell className="align-top pt-5 hidden md:table-cell">
        <div className="space-y-2">
          {company.location ? (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="truncate max-w-50">{company.location}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-sm text-gray-400 italic">
              <MapPin className="h-4 w-4 shrink-0" /> Location not set
            </div>
          )}

          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 hover:underline w-fit"
            >
              <Globe className="h-4 w-4 shrink-0" />
              <span className="truncate max-w-50">
                {company.website.replace(/^https?:\/\//, "")}
              </span>
            </a>
          )}
        </div>
      </TableCell>

      <TableCell className="align-top pt-4 pr-6">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-400 hover:text-amber-600 hover:bg-amber-50"
            onClick={() => onEdit(company)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(company.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
