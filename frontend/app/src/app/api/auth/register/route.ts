import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDriver } from '@/lib/memgraph';
import { hashPassword, signToken } from '@/lib/auth';
import { BUILT_IN_PERSONAS } from '@/lib/personas';
import { INIT_QUERIES } from '@/lib/graph/schema';

export async function POST(req: Request) {
  const driver = getDriver();
  const session = driver.session();

  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 1. Initialize schema (constraints & indexes) - doing this every time for safety in dev, or could be a separate boot script
    for (const query of INIT_QUERIES) {
      try {
        await session.run(query);
      } catch (e) {
        // Ignore if already exists
      }
    }

    // 2. Seed personas if not exist
    for (const p of BUILT_IN_PERSONAS) {
      await session.run(`
        MERGE (p:Persona {id: $id})
        SET p.name = $name,
            p.tagline = $tagline,
            p.emoji = $emoji,
            p.system_prompt = $system_prompt,
            p.is_custom = $is_custom
      `, {
        id: p.id,
        name: p.name,
        tagline: p.tagline,
        emoji: p.emoji,
        system_prompt: p.system_prompt,
        is_custom: p.is_custom || false
      });
    }

    // 3. Check if user exists
    const existingUser = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email }
    );

    if (existingUser.records.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // 4. Create user
    const userId = uuidv4();
    const hashedPassword = await hashPassword(password);
    const createdAt = new Date().toISOString();

    await session.run(`
      CREATE (u:User {
        id: $userId,
        email: $email,
        username: $username,
        password_hash: $password_hash,
        created_at: $createdAt,
        current_streak: 0,
        total_entries: 0,
        active_persona_id: 'sensei'
      })
      WITH u
      MATCH (p:Persona {id: 'sensei'})
      CREATE (u)-[:USES_PERSONA]->(p)
      RETURN u
    `, {
      userId,
      email,
      username,
      password_hash: hashedPassword,
      createdAt
    });

    const token = await signToken({ userId, email });

    const response = NextResponse.json({
      user: { id: userId, email, username, active_persona_id: 'sensei' }
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
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await session.close();
  }
}
