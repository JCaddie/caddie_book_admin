export const ANNOUNCEMENT_CONSTANTS = {
  PAGE_SIZE: 20,
  MAX_TITLE_LENGTH: 200,
  MAX_CONTENT_LENGTH: 5000,
  DEFAULT_SEARCH_PLACEHOLDER: "공지사항 제목을 검색해주세요",
  EMPTY_STATE_MESSAGE: "공지사항이 없습니다",
  LOADING_MESSAGE: "공지사항을 불러오는 중...",
  DELETE_CONFIRMATION: "선택한 공지사항을 삭제하시겠습니까?",
  BULK_DELETE_CONFIRMATION: "개의 공지사항을 삭제하시겠습니까?",
  PUBLISH_CONFIRMATION: "공지사항을 게시하시겠습니까?",
  UNPUBLISH_CONFIRMATION: "공지사항을 게시 중단하시겠습니까?",
};

export const ANNOUNCEMENT_COLUMN_WIDTHS = {
  no: 48,
  title: 600,
  views: 120,
  createdAt: 200,
  updatedAt: 200,
};

export const ANNOUNCEMENT_MESSAGES = {
  SUCCESS: {
    CREATED: "공지사항이 성공적으로 생성되었습니다.",
    UPDATED: "공지사항이 성공적으로 수정되었습니다.",
    DELETED: "공지사항이 성공적으로 삭제되었습니다.",
    PUBLISHED: "공지사항이 게시되었습니다.",
    UNPUBLISHED: "공지사항 게시가 중단되었습니다.",
  },
  ERROR: {
    LOAD_FAILED: "공지사항을 불러오는데 실패했습니다.",
    CREATE_FAILED: "공지사항 생성에 실패했습니다.",
    UPDATE_FAILED: "공지사항 수정에 실패했습니다.",
    DELETE_FAILED: "공지사항 삭제에 실패했습니다.",
    PUBLISH_FAILED: "공지사항 게시에 실패했습니다.",
    UNPUBLISH_FAILED: "공지사항 게시 중단에 실패했습니다.",
  },
};

export const ANNOUNCEMENT_VALIDATION = {
  TITLE: {
    REQUIRED: "제목을 입력해주세요.",
    MIN_LENGTH: "제목은 최소 2자 이상이어야 합니다.",
    MAX_LENGTH: `제목은 최대 ${ANNOUNCEMENT_CONSTANTS.MAX_TITLE_LENGTH}자까지 입력 가능합니다.`,
  },
  CONTENT: {
    REQUIRED: "내용을 입력해주세요.",
    MIN_LENGTH: "내용은 최소 10자 이상이어야 합니다.",
    MAX_LENGTH: `내용은 최대 ${ANNOUNCEMENT_CONSTANTS.MAX_CONTENT_LENGTH}자까지 입력 가능합니다.`,
  },
};
