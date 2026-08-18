import React from 'react';
import { useTranslation } from 'react-i18next';
import { AssistanceCategories } from '../../lib/constants';
import { mockRegisteredFamilyGroups, mockPublicInstitutions } from '../../data/families';
import { Filter, RotateCcw, Building2, Users } from 'lucide-react';

export function FilterPanel({
  filters,
  onChange,
  onReset,
  governorates = ['القاهرة', 'الجيزة', 'الإسكندرية', 'الفيوم', 'المنوفية', 'أسيوط', 'قنا', 'الأقصر', 'شمال سيناء', 'الإسماعيلية', 'الشرقية', 'السويس'],
}) {
  const { t, i18n } = useTranslation(['families', 'common']);
  const isArabic = (i18n.language || 'ar').startsWith('ar');

  const selectedScope = filters.scope || 'all';

  return (
    <div className="bg-white dark:bg-surface-darkCard border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2 font-bold text-sm text-stone-900 dark:text-stone-100">
          <Filter className="w-4 h-4 text-primary-600" />
          <span>{isArabic ? 'تصفية وتخصيص نتائج الحالات' : 'Filter & Categorize Cases'}</span>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('directory.clearFilters')}</span>
        </button>
      </div>

      {/* 1ST KEY FILTER: PUBLIC VS PRIVATE SCOPE */}
      <div className="space-y-2 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
        <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
          {isArabic ? '1. نوع ونطاق الحالة (عام / مؤسسات مقابل خاص / أسر وقبائل):' : '1. Case Scope (Public Institutions vs Private / Families):'}
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              onChange('scope', 'all');
              onChange('familyGroupId', 'all');
              onChange('institutionId', 'all');
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center border ${
              selectedScope === 'all'
                ? 'bg-primary-700 text-white border-primary-700 shadow-sm'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
            }`}
          >
            {isArabic ? '🌐 جميع الحالات والمبادرات' : '🌐 All Cases & Initiatives'}
          </button>

          <button
            type="button"
            onClick={() => {
              onChange('scope', 'private');
              onChange('institutionId', 'all');
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center border flex items-center justify-center gap-1.5 ${
              selectedScope === 'private'
                ? 'bg-primary-700 text-white border-primary-700 shadow-sm'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isArabic ? '🏠 حالات الأسر والقبائل (خاص)' : '🏠 Families & Tribes (Private)'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChange('scope', 'public');
              onChange('familyGroupId', 'all');
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center border flex items-center justify-center gap-1.5 ${
              selectedScope === 'public'
                ? 'bg-primary-700 text-white border-primary-700 shadow-sm'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{isArabic ? '🏥 مؤسسات ومستشفيات معتمدة (عام)' : '🏥 Public Hospitals & NGOs'}</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC CONDITIONAL DROPDOWNS */}
      {selectedScope === 'private' && (
        <div className="p-3 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/40 space-y-1">
          <label className="block text-xs font-bold text-teal-900 dark:text-teal-200 mb-1">
            {isArabic ? 'اختر العائلة أو القبيلة المسجلة:' : 'Select Registered Family / Tribe:'}
          </label>
          <select
            value={filters.familyGroupId || 'all'}
            onChange={(e) => onChange('familyGroupId', e.target.value)}
            className="w-full text-xs rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-stone-800 px-3 py-2.5 text-stone-800 dark:text-stone-200 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{isArabic ? '✨ كافة العائلات والقبائل المسجلة' : '✨ All Registered Families'}</option>
            {mockRegisteredFamilyGroups.map((grp) => (
              <option key={grp.id} value={grp.id}>
                {isArabic ? `${grp.nameAr} (${grp.regionAr})` : `${grp.nameEn} (${grp.regionEn})`}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedScope === 'public' && (
        <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-1">
          <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 mb-1">
            {isArabic ? 'اختر المؤسسة أو المستشفى المعتمد:' : 'Select Public Charity / Hospital:'}
          </label>
          <select
            value={filters.institutionId || 'all'}
            onChange={(e) => onChange('institutionId', e.target.value)}
            className="w-full text-xs rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-stone-800 px-3 py-2.5 text-stone-800 dark:text-stone-200 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{isArabic ? '✨ كافة المؤسسات والمستشفيات الشريكة' : '✨ All Partner Institutions'}</option>
            {mockPublicInstitutions.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {isArabic ? inst.nameAr : inst.nameEn}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* SECONDARY FILTERS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
            {t('directory.filterCategory')}
          </label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('directory.allCategories')}</option>
            {AssistanceCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {isArabic ? c.nameAr : c.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Governorate */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
            {t('directory.filterGovernorate')}
          </label>
          <select
            value={filters.governorate || 'all'}
            onChange={(e) => onChange('governorate', e.target.value)}
            className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('directory.allGovernorates')}</option>
            {governorates.map((gov) => (
              <option key={gov} value={gov}>
                {gov}
              </option>
            ))}
          </select>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
            {t('directory.filterUrgency')}
          </label>
          <select
            value={filters.urgency || 'all'}
            onChange={(e) => onChange('urgency', e.target.value)}
            className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('directory.allUrgencies')}</option>
            <option value="critical">{isArabic ? 'حرج للغاية (تدخل فوري)' : 'Critical (Immediate)'}</option>
            <option value="high">{isArabic ? 'عالي الأولوية' : 'High Priority'}</option>
            <option value="medium">{isArabic ? 'متوسط الأولوية' : 'Medium Priority'}</option>
            <option value="low">{isArabic ? 'عادي' : 'Standard'}</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
            {t('directory.sortBy')}
          </label>
          <select
            value={filters.sortBy || 'urgent'}
            onChange={(e) => onChange('sortBy', e.target.value)}
            className="w-full text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="urgent">{t('directory.sortUrgent')}</option>
            <option value="progress">{t('directory.sortProgress')}</option>
            <option value="target_high">{t('directory.sortTargetHigh')}</option>
            <option value="target_low">{t('directory.sortTargetLow')}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
