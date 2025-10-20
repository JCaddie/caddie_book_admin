import { NextRequest, NextResponse } from "next/server";

const EC2_BASE_URL = "http://3.35.21.201:8000";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params.path, "GET");
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params.path, "POST");
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params.path, "PUT");
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params.path, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params.path, "DELETE");
}

async function handleRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    const path = pathSegments.join("/");
    const url = new URL(`${EC2_BASE_URL}/api/v1/${path}`);

    // 쿼리 파라미터 복사
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    // 헤더 복사 (중요한 헤더만)
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      if (
        key.toLowerCase() === "authorization" ||
        key.toLowerCase() === "content-type" ||
        key.toLowerCase() === "accept"
      ) {
        headers[key] = value;
      }
    });

    // 요청 본문 가져오기
    let body: string | undefined;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      body = await request.text();
    }

    console.log(`🌐 [API Route] ${method} ${url.toString()}`);

    // EC2 서버로 요청 전달
    const response = await fetch(url.toString(), {
      method,
      headers,
      body,
    });

    // 응답 데이터 가져오기
    const data = await response.text();

    console.log(`✅ [API Route] 응답: ${response.status}`);

    // 응답 반환
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("❌ [API Route] 에러:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
