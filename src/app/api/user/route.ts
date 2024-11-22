import { NextRequest, NextResponse } from 'next/server';
import { API_SERVER_BASE_URL } from '../const';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          error: 'Please login to continue',
        },
        { status: 401 }
      );
    }
    const token = (session as any).accessToken;
    // const searchParams = req.nextUrl.searchParams;
    const { searchParams } = new URL(req.url);

    const id = searchParams.get('id');

    /**
     * Add api to hit backend
     */
    const res = await fetch(`${API_SERVER_BASE_URL}/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Error: ` },
        {
          status: res.status,
        }
      );
    }
    const data = await res.json();
    if (data.status == 'OK')
      return NextResponse.json(
        {
          ...data.data,
        },
        { status: 200 }
      );
    return NextResponse.json({
      error: `Error ${data.error}`,
    });
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
