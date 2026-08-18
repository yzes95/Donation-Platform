import { apiClient } from './client';
import { mockFamilies, mockRegisteredFamilyGroups, mockPublicInstitutions } from '../data/families';
import { mockServices } from '../data/services';

export async function getFamilies(filters = {}) {
  return apiClient.get('/families', () => {
    let result = [...mockFamilies];
    
    if (filters.scope && filters.scope !== 'all') {
      result = result.filter(f => f.scope === filters.scope);
    }

    if (filters.familyGroupId && filters.familyGroupId !== 'all') {
      result = result.filter(f => f.familyGroupId === filters.familyGroupId);
    }

    if (filters.institutionId && filters.institutionId !== 'all') {
      result = result.filter(f => f.institutionId === filters.institutionId);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(f => 
        f.nameAr.toLowerCase().includes(q) || 
        f.nameEn.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q) ||
        (f.familyGroupNameAr && f.familyGroupNameAr.toLowerCase().includes(q)) ||
        (f.familyGroupNameEn && f.familyGroupNameEn.toLowerCase().includes(q)) ||
        (f.institutionNameAr && f.institutionNameAr.toLowerCase().includes(q)) ||
        f.governorateAr.toLowerCase().includes(q) ||
        f.governorateEn.toLowerCase().includes(q) ||
        f.summaryAr.toLowerCase().includes(q)
      );
    }
    
    if (filters.category && filters.category !== 'all') {
      result = result.filter(f => f.category === filters.category);
    }

    if (filters.governorate && filters.governorate !== 'all') {
      result = result.filter(f => f.governorateAr.includes(filters.governorate) || f.governorateEn.includes(filters.governorate));
    }

    if (filters.urgency && filters.urgency !== 'all') {
      result = result.filter(f => f.urgency === filters.urgency);
    }

    if (filters.sortBy) {
      if (filters.sortBy === 'urgent') {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        result.sort((a, b) => (order[a.urgency] || 9) - (order[b.urgency] || 9));
      } else if (filters.sortBy === 'progress') {
        result.sort((a, b) => (b.totalRaised / b.totalTarget) - (a.totalRaised / a.totalTarget));
      } else if (filters.sortBy === 'target_high') {
        result.sort((a, b) => b.totalTarget - a.totalTarget);
      } else if (filters.sortBy === 'target_low') {
        result.sort((a, b) => a.totalTarget - b.totalTarget);
      }
    }

    return result;
  });
}

export async function getFamily(id) {
  return apiClient.get(`/families/${id}`, () => {
    const family = mockFamilies.find(f => f.id === id || f.code === id);
    if (!family) throw new Error('Family not found');
    const services = mockServices.filter(s => s.familyId === family.id);
    return { ...family, services };
  });
}

export async function updateFamily(id, updates) {
  return apiClient.put(`/families/${id}`, updates, (payload) => {
    const idx = mockFamilies.findIndex(f => f.id === id || f.code === id);
    if (idx !== -1) {
      mockFamilies[idx] = { ...mockFamilies[idx], ...payload };
      return mockFamilies[idx];
    }
    return payload;
  });
}

export async function getFamilyServices(familyId) {
  return apiClient.get(`/families/${familyId}/services`, () => {
    return mockServices.filter(s => s.familyId === familyId);
  });
}

export async function getService(serviceId) {
  return apiClient.get(`/services/${serviceId}`, () => {
    const service = mockServices.find(s => s.id === serviceId || s.code === serviceId);
    if (!service) throw new Error('Service not found');
    const family = mockFamilies.find(f => f.id === service.familyId);
    return { ...service, family };
  });
}

export async function createAssistanceRequest(data) {
  return apiClient.post('/services/requests', data, (payload) => {
    const newService = {
      id: `srv-${Date.now()}`,
      code: `SRV-${Math.floor(100 + Math.random() * 900)}`,
      familyId: payload.familyId || 'fam-01',
      titleAr: payload.titleAr || payload.title,
      titleEn: payload.titleEn || payload.title,
      category: payload.category || 'medical',
      unitLabelAr: payload.unitLabelAr || 'سهم مساهمة',
      unitLabelEn: payload.unitLabelEn || 'Share',
      targetAmount: Number(payload.targetAmount) || 10000,
      raisedAmount: 0,
      presetAmounts: [50, 100, 250, 500, 1000],
      urgency: payload.urgency || 'high',
      status: 'pending_review',
      descriptionAr: payload.descriptionAr || payload.description,
      descriptionEn: payload.descriptionEn || payload.description,
      beneficiaryAr: payload.beneficiaryAr || 'الأسرة',
      beneficiaryEn: payload.beneficiaryEn || 'Family',
      createdAt: new Date().toISOString(),
      donorsCount: 0,
    };
    mockServices.unshift(newService);
    return newService;
  });
}
