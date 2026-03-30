import Image from "next/image";
import { JobDetail } from "@/types/job";

interface CompanySectionProps {
  company: JobDetail["company"];
}

export function CompanySection({ company }: CompanySectionProps) {
  if (!company) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">About {company.name}</h3>
      <div className="flex items-center gap-4">
        {company.logo ? (
          <Image
            src={company.logo}
            alt={company.name}
            width={48}
            height={48}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-linear-to-br from-amber-400 to-amber-500 flex items-center justify-center">
            <span className="text-lg font-bold text-white">
              {company.name?.charAt(0).toUpperCase() || "C"}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900">{company.name}</p>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-500 hover:underline"
            >
              {company.website}
            </a>
          )}
        </div>
      </div>
      {company.description && company.description.length > 3 && (
        <p className="mt-3 text-gray-600">{company.description}</p>
      )}
    </div>
  );
}
