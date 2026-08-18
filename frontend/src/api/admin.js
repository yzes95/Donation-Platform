import { apiClient } from './client';
import { mockAuditLogs, mockPendingVerifications } from '../data/admin';
import { mockFamilies } from '../data/families';
import { mockServices } from '../data/services';
import { mockDonations } from '../data/donations';
import { mockStatistics } from '../data/statistics';

export async function getAdminDashboard() {
  return apiClient.get('/admin/dashboard', () => {
    return {
      statistics: mockStatistics,
      pendingVerificationsCount: mockPendingVerifications.length,
      pendingRequestsCount: mockServices.filter(s => s.status === 'pending_review').length,
      recentDonations: mockDonations.slice(0, 6),
      recentAuditLogs: mockAuditLogs.slice(0, 5),
    };
  });
}

export async function getPendingVerifications() {
  return apiClient.get('/admin/verifications', () => {
    return mockPendingVerifications;
  });
}

export async function verifyFamily(verificationId, action, reason = '') {
  return apiClient.post(`/admin/verifications/${verificationId}/action`, { action, reason }, () => {
    const index = mockPendingVerifications.findIndex(v => v.id === verificationId);
    if (index !== -1) {
      mockPendingVerifications.splice(index, 1);
    }
    mockAuditLogs.unshift({
      id: `log-${Date.now()}`,
      action: action === 'approve' ? 'VERIFY_FAMILY' : 'REJECT_FAMILY',
      actionAr: action === 'approve' ? 'اعتماد ملف أسرة' : 'رفض ملف أسرة',
      actorName: 'المسؤول الحالي',
      targetType: 'FamilyVerification',
      targetId: verificationId,
      detailsAr: `تم تنفيذ إجراء (${action}) للملف ${verificationId}${reason ? `: ${reason}` : ''}`,
      detailsEn: `Action (${action}) executed for application ${verificationId}`,
      timestamp: new Date().toISOString(),
    });
    return { success: true };
  });
}

export async function reviewAssistanceRequest(serviceId, decision, notes = '') {
  return apiClient.post(`/admin/services/${serviceId}/review`, { decision, notes }, () => {
    const srv = mockServices.find(s => s.id === serviceId);
    if (srv) {
      srv.status = decision === 'approve' ? 'active' : 'rejected';
    }
    return { success: true, service: srv };
  });
}

export async function getAuditLogs() {
  return apiClient.get('/admin/audit-logs', () => {
    return mockAuditLogs;
  });
}

export async function getReports() {
  return apiClient.get('/admin/reports', () => {
    return {
      statistics: mockStatistics,
      trends: mockStatistics.monthlyTrends,
      categoryDistribution: mockStatistics.categoryDistribution,
    };
  });
}
