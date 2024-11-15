import { NextRequest, NextResponse } from 'next/server';
import { API_SERVER_BASE_URL } from '../const';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import { error } from 'console';

export async function GET() {
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

    // console.log(token)
    /**
     * Add api to hit backend
     */
    const res = await fetch(`${API_SERVER_BASE_URL}/user/near`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
    // console.log(res.body)
    const data = await res.json();
    // console.log(data)
    console.log('DATA FROM BACKEND For near me : ', data);
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

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
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

    // console.log(token)
    /**
     * Add api to hit backend
     */
    const res = await fetch(`${API_SERVER_BASE_URL}/user/signal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: reqBody.to,
        data: JSON.parse(reqBody.data),
      }),
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
    // console.log(res.body)
    const data = await res.json();
    // console.log(data)
    console.log('DATA FROM BACKEND For near me : ', data);
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
