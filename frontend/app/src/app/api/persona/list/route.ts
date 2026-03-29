import { NextResponse } from 'next/server';
import { getDriver } from '@/lib/memgraph';

export async function GET() {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      'MATCH (p:Persona) RETURN p ORDER BY p.is_custom ASC, p.name ASC'
    );

    const personas = result.records.map(record => {
      const p = record.get('p').properties;
      return {
        id: p.id,
        name: p.name,
        tagline: p.tagline,
        emoji: p.emoji,
        system_prompt: p.system_prompt,
        is_custom: p.is_custom
      };
    });

    return NextResponse.json({ personas });

  } catch (error: any) {
    console.error('List personas error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await session.close();
  }
}
