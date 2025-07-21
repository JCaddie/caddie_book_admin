import { AUTH_CONSTANTS } from "@/shared/constants/auth";
import { cookieUtils } from "./utils";

/**
 * API 클라이언트 옵션
 */
interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean; // 인증 토큰을 포함하지 않을 경우
}

/**
 * 공통 API 클라이언트 클래스
 */
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  }

  /**
   * 인증 토큰을 가져오는 함수
   */
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return cookieUtils.get(AUTH_CONSTANTS.COOKIES.AUTH_TOKEN);
  }

  /**
   * 기본 헤더 생성
   */
  private getDefaultHeaders(skipAuth?: boolean): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // 인증 토큰 추가 (skipAuth가 true가 아닌 경우)
    if (!skipAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * 공통 fetch 요청 함수
   */
  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { skipAuth, headers, ...restOptions } = options;

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseURL}${endpoint}`;

    const defaultHeaders = this.getDefaultHeaders(skipAuth);
    const mergedHeaders = { ...defaultHeaders, ...headers };

    // 개발 환경에서만 로그 출력
    if (process.env.NODE_ENV === "development") {
      const method = restOptions.method || "GET";
      console.log(`🌐 ${method} ${url}`);

      // 요청 헤더 출력 (인증 토큰은 마스킹)
      const logHeaders: Record<string, string> = { ...mergedHeaders };
      if (logHeaders["Authorization"]) {
        logHeaders["Authorization"] = logHeaders["Authorization"].replace(
          /Bearer .+/,
          "Bearer ***"
        );
      }
      console.log(`📋 요청 헤더:`, logHeaders);

      // POST, PATCH, DELETE 요청 시 요청 데이터 출력
      if (["POST", "PATCH", "DELETE"].includes(method) && restOptions.body) {
        try {
          const requestData = JSON.parse(restOptions.body as string);
          console.log(`📤 요청 데이터:`, requestData);
        } catch {
          console.log(`📤 요청 데이터:`, restOptions.body);
        }
      }
    }

    const response = await fetch(url, {
      ...restOptions,
      headers: mergedHeaders,
    });

    // 에러 응답 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ API 에러:", response.status, errorData);

      // 401 에러인 경우 토큰 만료로 간주하고 로그아웃 처리
      if (response.status === 401) {
        // 브라우저 환경에서만 실행
        if (typeof window !== "undefined") {
          console.warn("🚨 인증 토큰 만료 - 로그아웃 처리");
          cookieUtils.removeMultiple([
            AUTH_CONSTANTS.COOKIES.AUTH_TOKEN,
            AUTH_CONSTANTS.COOKIES.USER_DATA,
          ]);
          window.location.href = "/login";
        }
      }

      throw new Error(
        errorData.detail ||
          errorData.message ||
          `API 요청 실패: ${response.status}`
      );
    }

    const data = await response.json();

    // 개발 환경에서 응답 데이터 출력
    if (process.env.NODE_ENV === "development") {
      const method = restOptions.method || "GET";
      console.log(`✅ ${response.status} ${response.statusText}`);

      // GET 요청은 데이터 크기에 따라 요약 출력
      if (method === "GET") {
        // 공지사항 목록 API 응답 형태 확인
        if (Array.isArray(data?.results)) {
          console.log(`📥 응답 데이터 (${data.results.length}개 항목):`, {
            success: data.success,
            message: data.message,
            count: data.count,
            page: data.page,
            total_pages: data.total_pages,
            results: data.results.slice(0, 3), // 처음 3개만 표시
            ...(data.results.length > 3 && {
              "...": `${data.results.length - 3}개 더`,
            }),
          });
        } else {
          console.log(`📥 응답 데이터:`, data);
        }
      } else {
        // POST, PATCH, DELETE는 전체 응답 출력
        console.log(`📥 응답 데이터:`, data);
      }
    }

    return data;
  }

  /**
   * GET 요청
   */
  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST 요청
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT 요청
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH 요청
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE 요청
   */
  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  /**
   * DELETE 요청 (body 포함)
   */
  async deleteWithBody<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * FormData 요청 (파일 업로드 등)
   */
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    options?: Omit<ApiRequestOptions, "headers">
  ): Promise<T> {
    const { skipAuth, ...restOptions } = options || {};

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {};

    // 인증 토큰 추가 (skipAuth가 true가 아닌 경우)
    if (!skipAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    // 개발 환경에서만 로그 출력
    if (process.env.NODE_ENV === "development") {
      console.log(`🌐 POST ${url} (FormData)`);

      // 요청 헤더 출력 (인증 토큰은 마스킹)
      const logHeaders: Record<string, string> = {};
      Object.entries(headers).forEach(([key, value]) => {
        if (key === "Authorization" && typeof value === "string") {
          logHeaders[key] = value.replace(/Bearer .+/, "Bearer ***");
        } else {
          logHeaders[key] = String(value);
        }
      });
      console.log(`📋 요청 헤더:`, logHeaders);

      // FormData 내용 출력
      const formDataEntries: Record<string, string> = {};
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          formDataEntries[key] = `[File: ${value.name}, ${value.size} bytes]`;
        } else {
          formDataEntries[key] = String(value);
        }
      }
      console.log(`📤 FormData:`, formDataEntries);
    }

    const response = await fetch(url, {
      ...restOptions,
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ FormData API 에러:", response.status, errorData);

      if (response.status === 401 && typeof window !== "undefined") {
        console.warn("🚨 인증 토큰 만료 - 로그아웃 처리");
        cookieUtils.removeMultiple([
          AUTH_CONSTANTS.COOKIES.AUTH_TOKEN,
          AUTH_CONSTANTS.COOKIES.USER_DATA,
        ]);
        window.location.href = "/login";
      }

      throw new Error(
        errorData.detail ||
          errorData.message ||
          `FormData 요청 실패: ${response.status}`
      );
    }

    const data = await response.json();

    // FormData 요청 시 응답 데이터 출력
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ ${response.status} ${response.statusText}`);
      console.log(`📥 응답 데이터 (FormData):`, data);
    }

    return data;
  }
}

// 싱글톤 인스턴스 생성
export const apiClient = new ApiClient();

// 편의를 위한 개별 함수들도 export
export const {
  get,
  post,
  put,
  patch,
  delete: del,
  deleteWithBody,
  postFormData,
} = apiClient;
