import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { Spinner } from '../components/ui/Spinner';

// Public Pages
const HomePage = lazy(() => import('../pages/public/HomePage').then(m => ({ default: m.HomePage })));
const FamilyDirectoryPage = lazy(() => import('../pages/public/FamilyDirectoryPage').then(m => ({ default: m.FamilyDirectoryPage })));
const FamilyProfilePage = lazy(() => import('../pages/public/FamilyProfilePage').then(m => ({ default: m.FamilyProfilePage })));
const ServiceDetailsPage = lazy(() => import('../pages/public/ServiceDetailsPage').then(m => ({ default: m.ServiceDetailsPage })));
const DonationCheckoutPage = lazy(() => import('../pages/public/DonationCheckoutPage').then(m => ({ default: m.DonationCheckoutPage })));
const PaymentProcessingPage = lazy(() => import('../pages/public/PaymentProcessingPage').then(m => ({ default: m.PaymentProcessingPage })));
const DonationConfirmationPage = lazy(() => import('../pages/public/DonationConfirmationPage').then(m => ({ default: m.DonationConfirmationPage })));
const DonationTrackingPage = lazy(() => import('../pages/public/DonationTrackingPage').then(m => ({ default: m.DonationTrackingPage })));
const AboutPage = lazy(() => import('../pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('../pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const SupportPlatformPage = lazy(() => import('../pages/public/SupportPlatformPage').then(m => ({ default: m.SupportPlatformPage })));
const PlatformTransparencyPage = lazy(() => import('../pages/public/PlatformTransparencyPage').then(m => ({ default: m.PlatformTransparencyPage })));
const InstallAppPage = lazy(() => import('../pages/public/InstallAppPage').then(m => ({ default: m.InstallAppPage })));
const ApplyRepresentativePage = lazy(() => import('../pages/public/ApplyRepresentativePage').then(m => ({ default: m.ApplyRepresentativePage })));

// Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const AdminLoginPage = lazy(() => import('../pages/auth/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));

// Dashboard Pages
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const FamilyProfileManagementPage = lazy(() => import('../pages/dashboard/FamilyProfileManagementPage').then(m => ({ default: m.FamilyProfileManagementPage })));
const NeedsManagementPage = lazy(() => import('../pages/dashboard/NeedsManagementPage').then(m => ({ default: m.NeedsManagementPage })));
const CreateAssistanceRequestPage = lazy(() => import('../pages/dashboard/CreateAssistanceRequestPage').then(m => ({ default: m.CreateAssistanceRequestPage })));
const EditAssistanceRequestPage = lazy(() => import('../pages/dashboard/EditAssistanceRequestPage').then(m => ({ default: m.EditAssistanceRequestPage })));
const DonationHistoryPage = lazy(() => import('../pages/dashboard/DonationHistoryPage').then(m => ({ default: m.DonationHistoryPage })));
const DonationDetailsPage = lazy(() => import('../pages/dashboard/DonationDetailsPage').then(m => ({ default: m.DonationDetailsPage })));
const NotificationsPage = lazy(() => import('../pages/dashboard/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const AccountSettingsPage = lazy(() => import('../pages/dashboard/AccountSettingsPage').then(m => ({ default: m.AccountSettingsPage })));

// Admin Pages
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const FamilyManagementPage = lazy(() => import('../pages/admin/FamilyManagementPage').then(m => ({ default: m.FamilyManagementPage })));
const FamilyVerificationPage = lazy(() => import('../pages/admin/FamilyVerificationPage').then(m => ({ default: m.FamilyVerificationPage })));
const AssistanceRequestReviewPage = lazy(() => import('../pages/admin/AssistanceRequestReviewPage').then(m => ({ default: m.AssistanceRequestReviewPage })));
const DonationMonitoringPage = lazy(() => import('../pages/admin/DonationMonitoringPage').then(m => ({ default: m.DonationMonitoringPage })));
const PaymentMonitoringPage = lazy(() => import('../pages/admin/PaymentMonitoringPage').then(m => ({ default: m.PaymentMonitoringPage })));
const UserManagementPage = lazy(() => import('../pages/admin/UserManagementPage').then(m => ({ default: m.UserManagementPage })));
const ReportsAnalyticsPage = lazy(() => import('../pages/admin/ReportsAnalyticsPage').then(m => ({ default: m.ReportsAnalyticsPage })));
const AuditLogsPage = lazy(() => import('../pages/admin/AuditLogsPage').then(m => ({ default: m.AuditLogsPage })));
const NotificationsManagementPage = lazy(() => import('../pages/admin/NotificationsManagementPage').then(m => ({ default: m.NotificationsManagementPage })));
const PlatformSettingsPage = lazy(() => import('../pages/admin/PlatformSettingsPage').then(m => ({ default: m.PlatformSettingsPage })));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/families" element={<FamilyDirectoryPage />} />
          <Route path="/families/:id" element={<FamilyProfilePage />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          <Route path="/donate" element={<DonationCheckoutPage />} />
          <Route path="/payment/processing/:referenceId" element={<PaymentProcessingPage />} />
          <Route path="/donation/confirmation/:referenceId" element={<DonationConfirmationPage />} />
          <Route path="/track" element={<DonationTrackingPage />} />
          <Route path="/support-platform" element={<SupportPlatformPage />} />
          <Route path="/transparency" element={<PlatformTransparencyPage />} />
          <Route path="/install" element={<InstallAppPage />} />
          <Route path="/apply-rep" element={<ApplyRepresentativePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Route>

        {/* FAMILY REPRESENTATIVE DASHBOARD */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<FamilyProfileManagementPage />} />
          <Route path="needs" element={<NeedsManagementPage />} />
          <Route path="needs/create" element={<CreateAssistanceRequestPage />} />
          <Route path="needs/edit/:id" element={<EditAssistanceRequestPage />} />
          <Route path="donations" element={<DonationHistoryPage />} />
          <Route path="donations/:id" element={<DonationDetailsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<AccountSettingsPage />} />
        </Route>

        {/* ADMIN PANEL */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="families" element={<FamilyManagementPage />} />
          <Route path="verifications" element={<FamilyVerificationPage />} />
          <Route path="needs-review" element={<AssistanceRequestReviewPage />} />
          <Route path="donations" element={<DonationMonitoringPage />} />
          <Route path="payments" element={<PaymentMonitoringPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="reports" element={<ReportsAnalyticsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="notifications-mgmt" element={<NotificationsManagementPage />} />
          <Route path="settings" element={<PlatformSettingsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
