import { UserRole } from "@/shared/types";
import Navigation from "./navigation";

interface SidebarProps {
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-10">
      <Navigation userRole={userRole} />
    </aside>
  );
};

export default Sidebar;
