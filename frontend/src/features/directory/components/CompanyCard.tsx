import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { DirectoryCompany } from '../types/directory';
import SpecialtyChip from './SpecialtyChip';
import TierBadge from './TierBadge';

type CompanyCardProps = {
  company: DirectoryCompany;
};

function getCompanyInitials(name: string) {
  const cleanName = name.trim();

  if (cleanName.length < 2) {
    return cleanName.toUpperCase() || 'CL';
  }

  return cleanName.slice(0, 2).toUpperCase();
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const companyInitials = getCompanyInitials(company.name);
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(company.logoUrl) && !logoFailed;
  const visibleSpecialties = company.specialties.slice(0, 4);
  const hiddenSpecialtiesCount = company.specialties.length - visibleSpecialties.length;

  return (
    <Link
      to={`/empresa/${company.id}`}
      aria-label={`Ver detalle de ${company.name}`}
      className="group !flex !h-full !min-h-[375px] !flex-col !rounded-[26px] !border !border-[#e4ebf5] !bg-white !p-7 !shadow-[0_18px_44px_rgba(15,23,42,0.07)] !transition hover:!-translate-y-[2px] hover:!shadow-[0_24px_58px_rgba(15,23,42,0.10)] focus:!outline-none focus:!ring-4 focus:!ring-sky-100"
    >
      <div className="!flex !min-h-[80px] !items-center !justify-center">
        <div className="!relative !flex !h-[54px] !w-[140px] !items-center !justify-center !overflow-hidden !rounded-[14px] !bg-white">
          {showLogo ? (
            <img
              src={company.logoUrl!}
              alt={`Logo de ${company.name}`}
              className="!h-full !w-full !object-contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="!flex !h-[54px] !w-[54px] !items-center !justify-center !rounded-full !border !border-[#dbe7f7] !bg-gradient-to-br !from-[#eaf2fc] !to-[#dbe7f7] !text-[18px] !font-bold !tracking-[0.06em] !text-[#12284b]">
              {companyInitials}
            </span>
          )}
        </div>
      </div>

      <div className="!mt-4 !text-center">
        <h2 className="!line-clamp-3 !text-[24px] !font-bold !leading-[1.12] !tracking-[-0.04em] !text-[#12284b]">
          {company.name}
        </h2>

        <div className='mt-4 flex justify-center'>
          <TierBadge tier={company.tierLabel} />
        </div>
      </div>

      <div className="!mt-5 !h-px !w-full !bg-[#e3eaf4]" />

      <div className="!mt-5 !flex-1">
        <p className="!text-center !text-[13px] !font-bold !uppercase !tracking-[0.12em] !text-[#94a3b8]">
          Especialidades
        </p>

        <div className="!mt-3.5 !flex !min-w-0 !flex-wrap !justify-center !gap-2.5 !overflow-hidden">
          {visibleSpecialties.map((specialty) => (
            <SpecialtyChip key={specialty} label={specialty} />
          ))}

          {hiddenSpecialtiesCount > 0 ? (
            <SpecialtyChip label={`+${hiddenSpecialtiesCount} más`} />
          ) : null}
        </div>
      </div>
    </Link>
  );
}
