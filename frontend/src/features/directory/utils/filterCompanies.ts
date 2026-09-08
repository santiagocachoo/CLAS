import type { DirectoryCompany, DirectoryFilters } from '../types/directory';
import { createCategoryId } from './createCategoryId';
import { normalizeForSearch } from './normalizeForSearch';

export function filterCompanies(
  companies: DirectoryCompany[],
  filters: DirectoryFilters,
): DirectoryCompany[] {
  const normalizedSearch = normalizeForSearch(filters.search.trim());
  const hasSearch = normalizedSearch.length > 0;
  const hasCategoryFilter = filters.categoryIds.length > 0;
  const hasTierFilter = filters.tierIds.length > 0;

  return companies.filter((company) => {
    const companyCategoryIds = [
      company.categoryId,
      ...company.specialties.map(createCategoryId),
    ];

    const matchesCategory = hasCategoryFilter
      ? filters.categoryIds.some((categoryId) =>
          companyCategoryIds.includes(categoryId),
        )
      : true;

    if (!matchesCategory) {
      return false;
    }

    const matchesTier = hasTierFilter
      ? filters.tierIds.includes(company.tierId)
      : true;

    if (!matchesTier) {
      return false;
    }

    if (!hasSearch) {
      return true;
    }

    const searchableValues = [
      company.name,
      company.city,
      company.state,
      company.categoryLabel,
      company.tierLabel,
      company.detail.about,
      ...company.specialties,
    ];

    return searchableValues.some((value) =>
      normalizeForSearch(value).includes(normalizedSearch),
    );
  });
}
