import { TextField } from "@/shared/components/ui";
import { Work } from "@/modules/work/types";

interface WorkDetailFormProps {
  work: Work;
  onUpdate?: (updatedWork: Partial<Work>) => void;
  isEditing?: boolean;
}

export default function WorkDetailForm({
  work,
  onUpdate,
  isEditing = false,
}: WorkDetailFormProps) {
  return (
    <div className="space-y-8">
      {/* 기본 정보 섹션 */}
      <section className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-6">기본 정보</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              근무 번호
            </label>
            <TextField
              value={work.id.toString()}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              일자
            </label>
            <TextField
              type="date"
              value={work.date}
              onChange={(e) => onUpdate?.({ date: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              골프장
            </label>
            <TextField
              value={work.golfCourse}
              onChange={(e) => onUpdate?.({ golfCourse: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상태
            </label>
            <select
              value={work.status}
              onChange={(e) =>
                onUpdate?.({ status: e.target.value as Work["status"] })
              }
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEB912] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="planning">계획중</option>
              <option value="confirmed">확정</option>
              <option value="completed">완료</option>
              <option value="cancelled">취소</option>
            </select>
          </div>
        </div>
      </section>

      {/* 인원 정보 섹션 */}
      <section className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-6">인원 정보</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전체 인원수
            </label>
            <TextField
              type="number"
              value={work.totalStaff.toString()}
              onChange={(e) =>
                onUpdate?.({ totalStaff: parseInt(e.target.value) || 0 })
              }
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              가용 인원수
            </label>
            <TextField
              type="number"
              value={work.availableStaff.toString()}
              onChange={(e) =>
                onUpdate?.({ availableStaff: parseInt(e.target.value) || 0 })
              }
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              부족 인원수
            </label>
            <TextField
              value={(work.totalStaff - work.availableStaff).toString()}
              disabled
              className="bg-red-50 text-red-600"
            />
          </div>
        </div>
      </section>

      {/* 근무 상세 정보 섹션 */}
      <section className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-6">근무 상세 정보</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작 시간
            </label>
            <TextField type="time" defaultValue="06:00" disabled={!isEditing} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료 시간
            </label>
            <TextField type="time" defaultValue="18:00" disabled={!isEditing} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              특이사항
            </label>
            <textarea
              rows={4}
              placeholder="특이사항을 입력하세요..."
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEB912] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
            />
          </div>
        </div>
      </section>

      {/* 날씨 정보 섹션 */}
      <section className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-6">날씨 정보</h3>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              날씨
            </label>
            <select
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEB912] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="sunny">맑음</option>
              <option value="cloudy">흐림</option>
              <option value="rainy">비</option>
              <option value="snowy">눈</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기온 (°C)
            </label>
            <TextField type="number" placeholder="20" disabled={!isEditing} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              습도 (%)
            </label>
            <TextField type="number" placeholder="60" disabled={!isEditing} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              풍속 (m/s)
            </label>
            <TextField
              type="number"
              step="0.1"
              placeholder="2.5"
              disabled={!isEditing}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
