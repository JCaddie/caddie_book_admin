// 선택된 캐디들 삭제 확인 메시지 생성
export const getDeleteConfirmMessage = (count: number): string => {
  return `선택된 ${count}개 항목을 삭제하시겠습니까?`;
};
