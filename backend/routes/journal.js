import express from "express";
import { prisma } from "../prisma.js";
import { runCypher } from "../memgraph.js";

const GEMINI_KEY = process.env.GEMINI_API_KEY;

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const userId = "demo-user";

    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      select: { date: true },
      orderBy: { date: "desc" },
    });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/new", async (req, res) => {
  try {
    const { date } = req.body;
    const userId = "demo-user";

    const entry = await prisma.journalEntry.create({
      data: {
        userId,
        date: new Date(date),
      },
    });

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/graph/nodes", async (req, res) => {
  try {
    const query = `MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 30`;
    const result = await runCypher(query);

    const nodesMap = new Map();
    const links = [];

    result.records.forEach(record => {
      const n = record.get('n').properties.name;
      const m = record.get('m').properties.name;
      const rel = record.get('r').properties.type || 'relates';

      nodesMap.set(n, { id: n, label: n });
      nodesMap.set(m, { id: m, label: m });
      links.push({ source: n, target: m, text: rel });
    });

    res.json({
      nodes: Array.from(nodesMap.values()),
      links
    });
  } catch (error) {
    console.error("Memgraph fetching error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const userId = "demo-user";

    const entry = await prisma.journalEntry.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(date),
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc"
          }
        },
      },
    });

    res.json(entry || { messages: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/entry", async (req, res) => {
  try {
    const { date, content } = req.body;
    const userId = "demo-user";

    // Guarantee the user exists so the Foreign Key constraint doesn't fail
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email: "demo-user@example.com" }
    });

    let entry = await prisma.journalEntry.upsert({
      where: {
        userId_date: {
          userId,
          date: new Date(date),
        },
      },
      update: {},
      create: {
        userId,
        date: new Date(date),
      },
    });

    const message = await prisma.message.create({
      data: {
        entryId: entry.id,
        role: "USER",
        content,
      },
    });

    // Retrieve conversation history
    const history = await prisma.message.findMany({
      where: { entryId: entry.id },
      orderBy: { createdAt: "asc" }
    });

    // Prepare resilient Gemini conversation flow (requires alternating roles)
    let rawRoles = [
      { role: "user", parts: [{ text: "System Context: You are a calming, reflective journaling AI. Keep responses brief, insightful, and conversational. Ask open-ended questions occasionally." }] },
      { role: "model", parts: [{ text: "Understood." }] }
    ];

    history.forEach(m => {
       rawRoles.push({
           role: m.role === "USER" ? "user" : "model",
           parts: [{ text: m.content }]
       });
    });

    const consolidated = [];
    let currentRole = null;
    let currentText = "";
    rawRoles.forEach(m => {
       if (m.role === currentRole) {
          currentText += "\n\n" + m.parts[0].text;
       } else {
          if (currentRole) consolidated.push({ role: currentRole, parts: [{ text: currentText }] });
          currentRole = m.role;
          currentText = m.parts[0].text;
       }
    });
    if (currentRole) consolidated.push({ role: currentRole, parts: [{ text: currentText }] });

    let aiText = "I hear you. The tide lets everything pass.";

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: consolidated })
      });
      
      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
          aiText = data.candidates[0].content.parts[0].text;
      } else {
          console.error("Gemini failed constraints or empty:", data);
      }
    } catch (apiErr) {
      console.error("Gemini SDK Error:", apiErr);
    }

    const aiMessage = await prisma.message.create({
      data: {
        entryId: entry.id,
        role: "AI",
        content: aiText
      }
    });

    // Fire & Forget Memgraph Extraction so it doesn't block the UI return
    extractAndStoreGraph(content).catch(err => console.error("Memgraph Extraction failed:", err));

    res.json({ success: true, message, aiMessage });
  } catch (error) {
    console.error("Autosave error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Autonomous LLM Extraction Pipeline
async function extractAndStoreGraph(text) {
  if (!text || text.length < 5) return;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            contents: [{ 
                role: "user", 
                parts: [{ text: `Extract up to 3 core psychological/topical concept relationships from the following text. Output ONLY a valid JSON array of objects with keys 'source', 'target', and 'relation'. Example: [{"source":"Work","target":"Anxiety","relation":"causes"}]\n\nText: ${text}` }] 
            }],
            generationConfig: { temperature: 0.1 }
        })
    });

    const data = await response.json();
    let jsonStr = data.candidates[0].content.parts[0].text;

    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
    const relationships = JSON.parse(jsonStr);

    for (let rel of relationships) {
      if (!rel.source || !rel.target || !rel.relation) continue;
      const query = `
                MERGE (a:Concept {name: $source})
                MERGE (b:Concept {name: $target})
                MERGE (a)-[r:RELATES_TO {type: $relation}]->(b)
            `;
      await runCypher(query, {
        source: rel.source.trim().substring(0, 30),
        target: rel.target.trim().substring(0, 30),
        relation: rel.relation.trim().substring(0, 30)
      });
      console.log(`Saved relation: ${rel.source} -> ${rel.target}`);
    }
  } catch (e) {
    console.warn("Extraction parsing error:", e.message);
  }
}

export default router;
