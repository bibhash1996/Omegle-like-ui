import { NextRequest, NextResponse } from 'next/server';
import { API_SERVER_BASE_URL } from '../const';

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    /**
     * Add api to hit backend
     */
    const res = await fetch(`${API_SERVER_BASE_URL}/public/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: reqBody.email,
        password: reqBody.password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      // console.log("RES : ", res)
      return NextResponse.json(
        { error: `Error: ` },
        {
          status: res.status,
        }
      );
    }
    const data = await res.json();
    return NextResponse.json(
      {
        ...data.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Error: ${(error as any).message}` },
      {
        status: 500,
      }
    );
  }
}
