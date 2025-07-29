"use client";

import React from "react";
import { GolfCourseDetail } from "../../types";

interface GolfCourseInfoProps {
  golfCourse: GolfCourseDetail;
}

const GolfCourseInfo: React.FC<GolfCourseInfoProps> = ({ golfCourse }) => {
  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        {/* 골프장명 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">골프장명</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">{golfCourse.name}</span>
          </div>
        </div>

        {/* 주소 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">주소</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">{golfCourse.address}</span>
          </div>
        </div>

        {/* 지역 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">지역</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">{golfCourse.region}</span>
          </div>
        </div>

        {/* 계약 현황 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">계약 현황</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {golfCourse.contract_status}
            </span>
          </div>
        </div>

        {/* 회원제 구분 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">회원제 구분</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {golfCourse.membership_type}
            </span>
          </div>
        </div>

        {/* 대표번호 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">대표번호</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {golfCourse.phone || "-"}
            </span>
          </div>
        </div>

        {/* 활성 상태 */}
        <div className="flex">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">활성 상태</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {golfCourse.is_active ? "활성" : "비활성"}
            </span>
          </div>
        </div>
      </div>

      {/* 대표자 정보 */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900">대표자 정보</h3>
        </div>
        <div className="flex">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">대표자명</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {golfCourse.ceo_name || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* 매니저 정보 */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900">매니저 정보</h3>
        </div>
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">매니저명</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {golfCourse.manager_name || "-"}
            </span>
          </div>
        </div>
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">연락처</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {golfCourse.manager_contact || "-"}
            </span>
          </div>
        </div>
        <div className="flex">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">이메일</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {golfCourse.manager_email || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* 계약 정보 */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900">계약 정보</h3>
        </div>
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">계약 시작일</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {golfCourse.contract_start_date || "-"}
            </span>
          </div>
        </div>
        <div className="flex">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">계약 종료일</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {golfCourse.contract_end_date || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* 시스템 정보 */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900">시스템 정보</h3>
        </div>
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">등록일</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {new Date(golfCourse.created_at).toLocaleDateString("ko-KR")}
            </span>
          </div>
        </div>
        <div className="flex">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">최근 수정일</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {new Date(golfCourse.updated_at).toLocaleDateString("ko-KR")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GolfCourseInfo;
