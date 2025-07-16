"use client";

import React from "react";
import { GolfCourseDetail } from "@/shared/types/golf-course";

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

        {/* 계약 현황 및 기간 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">계약 현황</span>
          </div>
          <div className="flex-1 px-4 py-3 flex items-center gap-6">
            <div className="bg-green-400 text-white px-2 py-1 rounded text-sm font-medium">
              {golfCourse.contract_status}
            </div>
            <span className="text-sm text-gray-900">
              {golfCourse.contract_start_date} ~ {golfCourse.contract_end_date}
            </span>
          </div>
        </div>

        {/* 회원구분 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">회원구분</span>
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
            <span className="text-sm text-gray-900">{golfCourse.phone}</span>
          </div>
        </div>

        {/* 활성화 여부 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">활성화</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {golfCourse.is_active ? "활성" : "비활성"}
            </span>
          </div>
        </div>

        {/* 생성일/수정일 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">생성일</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {golfCourse.created_at}
            </span>
          </div>
        </div>
        <div className="flex">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">수정일</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">
              {golfCourse.updated_at}
            </span>
          </div>
        </div>
      </div>

      {/* 대표자/매니저 정보 */}
      <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded-md overflow-hidden">
        {/* 대표자 정보 */}
        <div className="border-r border-gray-200">
          {/* 대표자 */}
          <div className="flex border-b border-gray-200">
            <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">대표자</span>
            </div>
            <div className="flex-1 px-4 py-3">
              <span className="text-sm text-gray-900">
                {golfCourse.ceo_name}
              </span>
            </div>
          </div>
        </div>
        {/* 매니저 정보 */}
        <div>
          {/* 매니저 */}
          <div className="flex border-b border-gray-200">
            <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">매니저</span>
            </div>
            <div className="flex-1 px-4 py-3">
              <span className="text-sm text-gray-900">
                {golfCourse.manager_name}
              </span>
            </div>
          </div>
          {/* 연락처 */}
          <div className="flex border-b border-gray-200">
            <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">연락처</span>
            </div>
            <div className="flex-1 px-4 py-3">
              <span className="text-sm text-gray-900">
                {golfCourse.manager_contact}
              </span>
            </div>
          </div>
          {/* 이메일 */}
          <div className="flex">
            <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">이메일</span>
            </div>
            <div className="flex-1 px-4 py-3">
              <span className="text-sm text-gray-900">
                {golfCourse.manager_email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GolfCourseInfo;
