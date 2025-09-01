export function GolfCourseListSkeleton() {
  return (
    <div className="space-y-6">
      {/* 제목 스켈레톤 */}
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />

      {/* 액션바 스켈레톤 */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded w-[106px] animate-pulse"
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 테이블 스켈레톤 */}
      <div className="space-y-4">
        {/* 테이블 헤더 */}
        <div className="bg-gray-50 rounded-t-md border border-gray-200 p-4">
          <div className="flex items-center gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded animate-pulse"
                style={{ width: i === 1 ? "48px" : i === 2 ? "192px" : "96px" }}
              />
            ))}
          </div>
        </div>

        {/* 테이블 행들 */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            className="flex items-center gap-8 p-4 border-b border-gray-200"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded animate-pulse"
                style={{ width: i === 1 ? "48px" : i === 2 ? "192px" : "96px" }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 페이지네이션 스켈레톤 */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 bg-gray-200 rounded w-8 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
