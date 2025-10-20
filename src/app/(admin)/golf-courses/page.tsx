// 서버 컴포넌트로 전환 - "use client" 제거
import GolfCourseListClient from "./golf-course-list-client";

export default function GolfCoursesPage() {
  return (
    <div className="p-6">
      <GolfCourseListClient
        initialData={null}
        initialConstants={{
          contract_statuses: [],
          membership_types: [],
          is_active_choices: [],
        }}
        searchParams={{
          page: "1",
          search: "",
          contract: "",
          membership_type: "",
          isActive: "",
        }}
      />
    </div>
  );
}
