"use client";

import React from "react";
import { Badge } from "@/shared/components/ui";

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">대시보드</h2>
        <p className="text-gray-600 mt-2">
          골프장 관리 시스템의 전체 현황을 확인할 수 있습니다.
        </p>
      </div>

      {/* 상태 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 카트 상태 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            카트 상태
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">사용 중</span>
              <Badge variant="green">사용 중</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">대기</span>
              <Badge variant="yellow">대기</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">충전 중</span>
              <Badge variant="red">충전 중</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">정비 중</span>
              <Badge variant="orange">정비 중</Badge>
            </div>
          </div>
        </div>

        {/* 캐디 상태 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            캐디 상태
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">근무 중</span>
              <Badge variant="green">근무 중</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">휴식</span>
              <Badge variant="yellow">휴식</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">대기</span>
              <Badge variant="gray">대기</Badge>
            </div>
          </div>
        </div>

        {/* 골프장 상태 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            골프장 상태
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">운영 중</span>
              <Badge variant="green">운영 중</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">점검 중</span>
              <Badge variant="orange">점검 중</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">휴장</span>
              <Badge variant="red">휴장</Badge>
            </div>
          </div>
        </div>

        {/* 시스템 상태 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            시스템 상태
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">온라인</span>
              <Badge variant="green">온라인</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">활성</span>
              <Badge variant="primary">활성</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">정상</span>
              <Badge variant="secondary">정상</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          오늘의 현황
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">45</div>
            <div className="text-sm text-gray-600">총 예약</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">38</div>
            <div className="text-sm text-gray-600">진행 중</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">7</div>
            <div className="text-sm text-gray-600">완료</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
