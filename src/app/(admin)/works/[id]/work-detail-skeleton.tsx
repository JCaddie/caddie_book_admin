export function WorkDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* 헤더 스켈레톤 */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
      </div>

      {/* 날짜 네비게이션 스켈레톤 */}
      <div className="flex items-center gap-4">
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
      </div>

      {/* 부 정보 스켈레톤 */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 bg-gray-200 rounded w-24 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 스켈레톤 */}
      <div className="flex gap-8">
        {/* 왼쪽: 라운딩 관리 스켈레톤 */}
        <div className="flex-1 space-y-4">
          <div className="h-12 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="h-16 bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* 오른쪽: 인력 현황 스켈레톤 */}
        <div className="w-80 space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-12 bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
