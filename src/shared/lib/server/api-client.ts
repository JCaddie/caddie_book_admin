import { cookies } from "next/headers";
import { AUTH_CONSTANTS } from "@/shared/constants/auth";

/**
 * 서버 컴포넌트용 API 클라이언트
 * 쿠키에서 토큰을 직접 읽어서 사용
 */
class ServerApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  }

  /**
   * 서버에서 쿠키를 통해 인증 토큰을 가져오는 함수
   */
  private getAuthToken(): string | null {
    try {
      const cookieStore = cookies();
      const token = cookieStore.get(AUTH_CONSTANTS.COOKIES.AUTH_TOKEN);
      return token?.value || null;
    } catch (error) {
      console.error("서버에서 토큰 읽기 실패:", error);
      return null;
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
   * GET 요청
   */
  async get<T>(endpoint: string, options?: { skipAuth?: boolean }): Promise<T> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseURL}${endpoint}`;
    const headers = this.getDefaultHeaders(options?.skipAuth);

    if (process.env.NODE_ENV === "development") {
      console.log(`🌐 [Server] GET ${url}`);
      const logHeaders = { ...headers };
      if (logHeaders["Authorization"]) {
        logHeaders["Authorization"] = logHeaders["Authorization"].replace(
          /Bearer .+/,
          "Bearer ***"
        );
      }
      console.log(`📋 [Server] 요청 헤더:`, logHeaders);
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ [Server] API 에러:`, response.status, errorData);
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();

    if (process.env.NODE_ENV === "development") {
      console.log(`✅ [Server] 응답 데이터:`, data);
    }

    return data;
  }

  /**
   * POST 요청
   */
  async post<T>(
    endpoint: string,
    data: any,
    options?: { skipAuth?: boolean }
  ): Promise<T> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseURL}${endpoint}`;
    const headers = this.getDefaultHeaders(options?.skipAuth);

    if (process.env.NODE_ENV === "development") {
      console.log(`🌐 [Server] POST ${url}`);
      console.log(`📤 [Server] 요청 데이터:`, data);
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ [Server] API 에러:`, response.status, errorData);
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const responseData = await response.json();

    if (process.env.NODE_ENV === "development") {
      console.log(`✅ [Server] 응답 데이터:`, responseData);
    }

    return responseData;
  }
}

// 서버 컴포넌트용 API 클라이언트 인스턴스
export const serverApiClient = new ServerApiClient();
