import { UserRole } from "@/shared/types";
import Sidebar from "./sidebar";
import Header from "./header";
import AuthGuard from "@/shared/components/auth/auth-guard";

export interface AdminLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, userRole }) => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* 사이드바 */}
        <Sidebar userRole={userRole} />

        {/* 메인 콘텐츠 영역 */}
        <main className="ml-60 min-h-screen">
          {/* 헤더 영역 */}
          <Header />

          {/* 페이지 콘텐츠 */}
          <div className="p-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default AdminLayout;
