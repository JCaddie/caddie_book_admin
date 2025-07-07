"use client";

import { AdminLayout } from "@/shared/components/layout";

interface AdminRootLayoutProps {
  children: React.ReactNode;
}

const AdminRootLayout: React.FC<AdminRootLayoutProps> = ({ children }) => {
  // 미들웨어에서 인증을 처리하므로 여기서는 인증 로직 불필요
  return <AdminLayout userRole="DEVELOPER">{children}</AdminLayout>;
};

export default AdminRootLayout;
