import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getFamilies } from '../../api/families';
import { FamilyCard } from '../../components/common/FamilyCard';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterPanel } from '../../components/common/FilterPanel';
import { Pagination } from '../../components/ui/Pagination';
import { FamilyCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Users, Filter } from 'lucide-react';

export function FamilyDirectoryPage() {
  const { t } = useTranslation('families');
  const [searchParams, setSearchParams] = useSearchParams();

  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Filters state from URL or default
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    governorate: searchParams.get('governorate') || 'all',
    urgency: searchParams.get('urgency') || 'all',
    sortBy: searchParams.get('sortBy') || 'urgent',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getFamilies(filters);
        setFamilies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      governorate: 'all',
      urgency: 'all',
      sortBy: 'urgent',
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(families.length / itemsPerPage);
  const paginatedFamilies = families.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-display">
          {t('directory.title')}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {t('directory.subtitle')}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <SearchBar
            value={filters.search}
            onChange={(val) => handleFilterChange('search', val)}
            onClear={() => handleFilterChange('search', '')}
            placeholder={t('directory.searchPlaceholder')}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="sm:hidden btn-secondary text-xs w-full py-3 flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>خيارات التصفية المتقدمة</span>
          </button>
        </div>

        {/* Filters Panel */}
        <div className={`sm:block ${showMobileFilter ? 'block' : 'hidden'}`}>
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400 pt-2">
        <span>{t('directory.showingResults', { count: families.length })}</span>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <FamilyCardSkeleton key={i} />
          ))}
        </div>
      ) : paginatedFamilies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedFamilies.map((family) => (
            <FamilyCard key={family.id} family={family} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title={t('directory.noFamiliesFound')}
          description="جرب البحث بكلمات مختلفة أو إزالة بعض خيارات التصفية للوصول للمزيد من الحالات."
          actionLabel={t('directory.clearFilters')}
          onAction={handleResetFilters}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
