import { AUTH_CONSTANTS } from "@/shared/constants/auth";
import { API_CONSTANTS } from "@/shared/constants/app";
import { cookieUtils, tokenUtils } from "./utils";

/**
 * API 클라이언트 옵션
 */
interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean; // 인증 토큰을 포함하지 않을 경우
  skipTokenRefresh?: boolean; // 토큰 갱신을 건너뛸 경우
}

/**
 * 공통 API 클라이언트 클래스
 */
class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.baseURL = API_CONSTANTS.BASE_URL;
  }

  /**
   * 인증 토큰을 가져오는 함수
   */
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return cookieUtils.get(AUTH_CONSTANTS.COOKIES.AUTH_TOKEN);
  }

  /**
   * 리프레시 토큰을 사용하여 새로운 액세스 토큰 발급
   */
  private async refreshAccessToken(): Promise<boolean> {
    try {
      console.log("🔄 ===== 토큰 갱신 프로세스 시작 =====");

      const refreshToken = cookieUtils.get(
        AUTH_CONSTANTS.COOKIES.REFRESH_TOKEN
      );

      if (!refreshToken) {
        console.warn("❌ 리프레시 토큰이 없습니다.");
        console.log(
          "🔄 ===== 토큰 갱신 프로세스 실패 (리프레시 토큰 없음) ====="
        );
        return false;
      }

      console.log("📋 리프레시 토큰 존재 확인됨");
      console.log(
        "🌐 토큰 갱신 요청 URL:",
        `${this.baseURL}${AUTH_CONSTANTS.API_ENDPOINTS.REFRESH_TOKEN}`
      );
      console.log("📤 요청 데이터:", { refresh_token: "***" }); // 토큰 마스킹

      const response = await fetch(
        `${this.baseURL}${AUTH_CONSTANTS.API_ENDPOINTS.REFRESH_TOKEN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }
      );

      console.log(
        "📡 토큰 갱신 응답 상태:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        console.error("❌ 토큰 갱신 API 호출 실패:", response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ 에러 상세:", errorData);
        console.log("🔄 ===== 토큰 갱신 프로세스 실패 (API 오류) =====");
        return false;
      }

      const data = await response.json();
      console.log("📥 토큰 갱신 응답 데이터:", {
        ...data,
        access_token: data.access_token ? "***" : undefined,
        refresh_token: data.refresh_token ? "***" : undefined,
      });

      if (data.access_token) {
        // 새로운 액세스 토큰 저장
        cookieUtils.set(
          AUTH_CONSTANTS.COOKIES.AUTH_TOKEN,
          data.access_token,
          AUTH_CONSTANTS.TOKEN.EXPIRES_DAYS
        );

        // 리프레시 토큰도 새로 발급받았다면 저장
        if (data.refresh_token) {
          cookieUtils.set(
            AUTH_CONSTANTS.COOKIES.REFRESH_TOKEN,
            data.refresh_token,
            AUTH_CONSTANTS.TOKEN.EXPIRES_DAYS
          );
        }

        console.log("✅ 토큰 갱신 성공 - 새로운 액세스 토큰 저장됨");
        console.log("🔄 ===== 토큰 갱신 프로세스 성공 =====");
        return true;
      }

      console.log("❌ 응답에 access_token이 없음");
      console.log("🔄 ===== 토큰 갱신 프로세스 실패 (응답 데이터 오류) =====");
      return false;
    } catch (error) {
      console.error("❌ 토큰 갱신 중 예외 발생:", error);
      console.log("🔄 ===== 토큰 갱신 프로세스 실패 (예외) =====");
      return false;
    }
  }

  /**
   * 토큰 갱신 처리 (중복 요청 방지)
   */
  private async handleTokenRefresh(): Promise<boolean> {
    if (this.isRefreshing) {
      // 이미 갱신 중이면 기존 Promise 반환
      console.log("🔄 이미 토큰 갱신 중 - 기존 프로세스 재사용");
      return this.refreshPromise!;
    }

    console.log("🔄 새로운 토큰 갱신 프로세스 시작");
    this.isRefreshing = true;
    this.refreshPromise = this.refreshAccessToken();

    try {
      const result = await this.refreshPromise;
      console.log(
        "🔄 토큰 갱신 프로세스 완료 - 결과:",
        result ? "성공" : "실패"
      );
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
      console.log("🔄 토큰 갱신 상태 초기화 완료");
    }
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
    const { skipAuth, skipTokenRefresh, headers, ...restOptions } = options;

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

    let response = await fetch(url, {
      ...restOptions,
      headers: mergedHeaders,
    });

    // 401 에러이고 토큰 갱신을 건너뛰지 않는 경우 토큰 갱신 시도
    if (response.status === 401 && !skipAuth && !skipTokenRefresh) {
      console.log("🔄 ===== 401 에러 발생 - 자동 토큰 갱신 시작 =====");
      console.log("📋 원본 요청 URL:", url);
      console.log("📋 원본 요청 메서드:", restOptions.method || "GET");
      console.log("📋 원본 요청 상태:", response.status, response.statusText);

      const refreshSuccess = await this.handleTokenRefresh();

      if (refreshSuccess) {
        // 토큰 갱신 성공 시 새로운 토큰으로 재요청
        const newToken = this.getAuthToken();
        if (newToken) {
          (mergedHeaders as Record<string, string>)[
            "Authorization"
          ] = `Bearer ${newToken}`;

          console.log("✅ 토큰 갱신 성공 - 새로운 토큰으로 원본 요청 재시도");
          console.log("🔄 재요청 URL:", url);
          console.log("🔄 재요청 헤더:", {
            ...mergedHeaders,
            Authorization: "Bearer ***", // 토큰 마스킹
          });

          response = await fetch(url, {
            ...restOptions,
            headers: mergedHeaders,
          });

          console.log("🔄 재요청 결과:", response.status, response.statusText);

          if (response.ok) {
            console.log("✅ 토큰 갱신 후 원본 요청 성공!");
          } else {
            console.log("❌ 토큰 갱신 후에도 원본 요청 실패:", response.status);
          }
        }
      } else {
        console.log("❌ 토큰 갱신 실패 - 갱신할 수 없음");
        console.log("💡 사용자는 수동으로 다시 로그인해야 합니다");

        // 토큰 갱신 실패 시 로그인 페이지로 이동
        if (typeof window !== "undefined") {
          console.log("🚨 토큰 갱신 실패 - 로그인 페이지로 이동");
          cookieUtils.removeMultiple([
            AUTH_CONSTANTS.COOKIES.AUTH_TOKEN,
            AUTH_CONSTANTS.COOKIES.REFRESH_TOKEN,
            AUTH_CONSTANTS.COOKIES.USER_DATA,
          ]);
          window.location.href = "/login";
        }
      }
      console.log("🔄 ===== 토큰 갱신 프로세스 완료 =====");
    }

    // 에러 응답 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ API 에러:", response.status, errorData);

      // 401 또는 403 에러 처리
      if (response.status === 401 || response.status === 403) {
        // 브라우저 환경에서만 실행
        if (typeof window !== "undefined") {
          const token = this.getAuthToken();

          // 토큰이 있고 유효한 형식이라면 권한 부족으로 처리
          if (token && tokenUtils.isValidFormat(token)) {
            console.warn(
              `🚨 권한 부족 (${response.status}) - 접근 권한이 없습니다`
            );
            // 권한 부족 에러는 별도 처리하지 않고 에러를 던져서 컴포넌트에서 처리하도록 함
            throw new Error("이 작업을 수행할 권한이 없습니다.");
          } else {
            // 토큰이 없거나 유효하지 않으면 인증 실패로 처리
            console.warn("🚨 인증 토큰 만료 - 로그아웃 처리");
            cookieUtils.removeMultiple([
              AUTH_CONSTANTS.COOKIES.AUTH_TOKEN,
              AUTH_CONSTANTS.COOKIES.REFRESH_TOKEN,
              AUTH_CONSTANTS.COOKIES.USER_DATA,
            ]);
            window.location.href = "/login";
          }
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

      // 401 또는 403 에러 처리
      if (
        (response.status === 401 || response.status === 403) &&
        typeof window !== "undefined"
      ) {
        const token = this.getAuthToken();

        // 토큰이 있고 유효한 형식이라면 권한 부족으로 처리
        if (token && tokenUtils.isValidFormat(token)) {
          console.warn(
            `🚨 권한 부족 (${response.status}) - 접근 권한이 없습니다`
          );
          throw new Error("이 작업을 수행할 권한이 없습니다.");
        } else {
          // 토큰이 없거나 유효하지 않으면 인증 실패로 처리
          console.warn("🚨 인증 토큰 만료 - 로그아웃 처리");
          cookieUtils.removeMultiple([
            AUTH_CONSTANTS.COOKIES.AUTH_TOKEN,
            AUTH_CONSTANTS.COOKIES.REFRESH_TOKEN,
            AUTH_CONSTANTS.COOKIES.USER_DATA,
          ]);
          window.location.href = "/login";
        }
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
