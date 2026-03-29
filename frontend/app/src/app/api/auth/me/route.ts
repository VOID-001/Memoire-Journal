import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getDriver } from '@/lib/memgraph';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      'MATCH (u:User {id: $userId}) RETURN u',
      { userId: payload.userId }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userNode = result.records[0].get('u').properties;

    return NextResponse.json({
      user: {
        id: userNode.id,
        email: userNode.email,
        username: userNode.username,
        active_persona_id: userNode.active_persona_id,
        current_streak: userNode.current_streak.toNumber ? userNode.current_streak.toNumber() : userNode.current_streak,
        total_entries: userNode.total_entries.toNumber ? userNode.total_entries.toNumber() : userNode.total_entries,
      }
    });

  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await session.close();
  }
}
