import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getDriver } from '@/lib/memgraph';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { personaId } = await req.json();

    if (!personaId) {
      return NextResponse.json({ error: 'Persona ID is required' }, { status: 400 });
    }

    const driver = getDriver();
    const session = driver.session();

    try {
      // 1. Verify persona exists
      const personaResult = await session.run(
        'MATCH (p:Persona {id: $personaId}) RETURN p',
        { personaId }
      );

      if (personaResult.records.length === 0) {
        return NextResponse.json({ error: 'Persona not found' }, { status: 404 });
      }

      // 2. Update user's active persona and relationship
      await session.run(`
        MATCH (u:User {id: $userId})
        OPTIONAL MATCH (u)-[r:USES_PERSONA]->(:Persona)
        DELETE r
        WITH u
        MATCH (p:Persona {id: $personaId})
        CREATE (u)-[:USES_PERSONA]->(p)
        SET u.active_persona_id = $personaId
        RETURN u
      `, {
        userId: payload.userId,
        personaId
      });

      return NextResponse.json({ success: true, active_persona_id: personaId });

    } finally {
      await session.close();
    }

  } catch (error: any) {
    console.error('Set persona error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
