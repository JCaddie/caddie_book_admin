export const USER_CONSTANTS = {
  UI_TEXT: {
    TITLE: "사용자 관리",
    DELETE_TITLE: "사용자 삭제",
    DELETE_MESSAGE: "개 사용자를 삭제하시겠습니까?",
    CREATE_BUTTON: "생성",
    SEARCH_PLACEHOLDER: "검색어 입력",
    ROLE_FILTER_PLACEHOLDER: "권한",
    TOTAL_COUNT: "총 {count}건",
    EMPTY_STATE: "등록된 사용자가 없습니다.",
    COLUMNS: {
      NO: "No.",
      USERNAME: "아이디",
      NAME: "이름",
      PHONE: "연락처",
      EMAIL: "이메일",
      ROLE: "권한",
    },
  },
  ITEMS_PER_PAGE: 20,
} as const;
