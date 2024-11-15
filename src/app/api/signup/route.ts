import { NextRequest, NextResponse } from 'next/server';
import { API_SERVER_BASE_URL } from '../const';

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    /**
     * Add api to hit backend
     */
    const res = await fetch(`${API_SERVER_BASE_URL}/signup`, {
      method: 'POST',
      body: JSON.stringify({
        name: reqBody.name,
        location: JSON.parse(reqBody.location),
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
    // console.log("DATA FROM BACKEND : ", data)

    // let response = {
    //     "status": "OK",
    //     "data": {
    //         "id": "eedf24f8-b5ac-4791-ac36-6d6abbd63c0d",
    //         "name": "Bibhash",
    //         "location": {
    //             "lat": "13.0265909",
    //             "long": "77.7043423"
    //         },
    //         "geohash": "tdr60",
    //         "status": "ACTIVE",
    //         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVlZGYyNGY4LWI1YWMtNDc5MS1hYzM2LTZkNmFiYmQ2M2MwZCIsIm5hbWUiOiJCaWJoYXNoIiwibG9jYXRpb24iOnsibGF0IjoiMTMuMDI2NTkwOSIsImxvbmciOiI3Ny43MDQzNDIzIn0sImdlb2hhc2giOiJ0ZHI2MCIsInN0YXR1cyI6IkFDVElWRSIsImlhdCI6MTcyOTMyNzkxOCwiZXhwIjoxNzI5NTAwNzE4fQ.YjVu-82u2lt43XzVUYDJ-2CjD6HyFmFjx9SHf3ia5jc"
    //     }
    // }
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
