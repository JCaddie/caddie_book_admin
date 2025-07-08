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
        {/* 업체명 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">업체명</span>
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

        {/* 계약 현황 */}
        <div className="flex border-b border-gray-200">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">계약 현황</span>
          </div>
          <div className="flex-1 px-4 py-3 flex items-center gap-6">
            <div className="bg-green-400 text-white px-2 py-1 rounded text-sm font-medium">
              {golfCourse.contractStatus}
            </div>
            <span className="text-sm text-gray-900">
              {golfCourse.contractPeriod}
            </span>
          </div>
        </div>

        {/* 대표번호 */}
        <div className="flex">
          <div className="bg-gray-50 px-4 py-3 w-32 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">대표번호</span>
          </div>
          <div className="flex-1 px-4 py-3">
            <span className="text-sm text-gray-900">{golfCourse.phone}</span>
          </div>
        </div>
      </div>

      {/* 대표자/담당자 정보 */}
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
                {golfCourse.representative.name}
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
                {golfCourse.representative.contact}
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
                {golfCourse.representative.email}
              </span>
            </div>
          </div>
        </div>

        {/* 담당자 정보 */}
        <div>
          {/* 담당자 */}
          <div className="flex border-b border-gray-200">
            <div className="bg-gray-50 px-4 py-3 w-24 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">담당자</span>
            </div>
            <div className="flex-1 px-4 py-3">
              <span className="text-sm text-gray-900">
                {golfCourse.manager.name}
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
                {golfCourse.manager.contact}
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
                {golfCourse.manager.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GolfCourseInfo;
