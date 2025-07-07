export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * 토큰 유효성 검증 유틸리티
 */
export const tokenUtils = {
  /**
   * 토큰 형식 검증
   */
  isValidFormat(token: string): boolean {
    const parts = token.split("-");
    return parts.length >= 3 && parts[0] === "mock" && parts[1] === "token";
  },

  /**
   * 토큰에서 사용자 ID 추출
   */
  extractUserId(token: string): string | null {
    const parts = token.split("-");
    return parts.length >= 3 ? parts[2] : null;
  },

  /**
   * 토큰 만료 시간 확인 (실제 구현에서는 JWT 디코딩)
   */
  isExpired(token: string): boolean {
    // 목 토큰의 경우 타임스탬프 확인
    const parts = token.split("-");
    if (parts.length < 4) return false;

    const timestamp = parseInt(parts[3]);
    const now = Date.now();
    const expiryTime = 7 * 24 * 60 * 60 * 1000; // 7일

    return now - timestamp > expiryTime;
  },
};

/**
 * 쿠키 관련 유틸리티
 */
export const cookieUtils = {
  /**
   * 쿠키 설정
   */
  set(name: string, value: string, days: number = 7): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    const isSecure = window.location.protocol === "https:";
    const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax${
      isSecure ? ";Secure" : ""
    }`;

    document.cookie = cookieString;
  },

  /**
   * 쿠키 가져오기
   */
  get(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
  },

  /**
   * 쿠키 삭제
   */
  remove(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },

  /**
   * 여러 쿠키 동시 삭제
   */
  removeMultiple(names: string[]): void {
    names.forEach((name) => this.remove(name));
  },
};

/**
 * 권한 관련 유틸리티
 */
export const authUtils = {
  /**
   * 권한 레벨 비교
   */
  getRoleLevel(role: string): number {
    const levels = {
      DEVELOPER: 2,
      BRANCH: 1,
    };
    return levels[role as keyof typeof levels] || 0;
  },

  /**
   * 상위 권한 확인
   */
  hasHigherRole(userRole: string, requiredRole: string): boolean {
    return this.getRoleLevel(userRole) >= this.getRoleLevel(requiredRole);
  },
};
