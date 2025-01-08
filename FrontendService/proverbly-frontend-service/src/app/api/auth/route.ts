import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export interface User {
  id: number;
  email: string;
  password: string;
}

export async function GET() {
  return NextResponse.json({ message: "Hello, World!" });
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log(process.env.NEXT_SERVER_USER_SERVICE_API_URL);
    const response = await fetch(
      `${process.env.NEXT_SERVER_USER_SERVICE_API_URL}/users/email/${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        throw new Error(error.error);
      } else {
        throw new Error("API 호출 오류");
      }
    }

    const user = await response.json();

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const isValid = await bcryptjs.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    const {
      password: {},
      ...userWithoutPassword
    } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json(
      { error: "로그인 처리 중 오류가 발생했습니다.", message: error },
      { status: 500 }
    );
  }
}
