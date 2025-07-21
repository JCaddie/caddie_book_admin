import { AnnouncementFilters } from "../types";

/**
 * API 파라미터 빌더 클래스
 */
export class AnnouncementApiParamsBuilder {
  private params = new URLSearchParams();

  /**
   * 페이지네이션 파라미터 추가
   */
  withPagination(page: number, limit: number): this {
    this.params.append("page", page.toString());
    this.params.append("limit", limit.toString());
    return this;
  }

  /**
   * 필터 파라미터 추가
   */
  withFilters(filters?: AnnouncementFilters): this {
    if (!filters) return this;

    const filterMappings: Record<string, string> = {
      searchTerm: "search",
      isPublished: "is_published",
      category: "category",
      priority: "priority",
      isPinned: "is_pinned",
      startDate: "start_date",
      endDate: "end_date",
      authorId: "author_id",
      type: "type",
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        const paramKey = filterMappings[key] || key;
        this.params.append(paramKey, String(value));
      }
    });

    return this;
  }

  /**
   * 커스텀 파라미터 추가
   */
  withCustomParam(key: string, value: string | number | boolean): this {
    this.params.append(key, String(value));
    return this;
  }

  /**
   * URLSearchParams 반환
   */
  build(): URLSearchParams {
    return this.params;
  }

  /**
   * 쿼리 스트링 반환
   */
  toString(): string {
    return this.params.toString();
  }
}

/**
 * 팩토리 함수
 */
export const createApiParams = () => new AnnouncementApiParamsBuilder();
