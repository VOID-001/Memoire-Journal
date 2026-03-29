import { NextResponse } from 'next/server';
import { getDriver } from '@/lib/memgraph';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  const driver = getDriver();
  const session = driver.session();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 1. Fetch user
    const result = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const userNode = result.records[0].get('u').properties;

    // 2. Verify password
    const isPasswordValid = await comparePassword(password, userNode.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 3. sign JWT
    const token = await signToken({ userId: userNode.id, email: userNode.email });

    const response = NextResponse.json({
      user: {
        id: userNode.id,
        email: userNode.email,
        username: userNode.username,
        active_persona_id: userNode.active_persona_id
      }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await session.close();
  }
}
