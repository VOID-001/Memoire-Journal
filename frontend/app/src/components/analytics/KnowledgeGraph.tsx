'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#fcd34d', '#81a6c6', '#aacddc', '#d2c4b4', '#f3e3d0'];

export default function KnowledgeGraph() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGraph() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/journal/graph/nodes`);
        if (res.ok) {
           const data = await res.json();
           
           // Apply a simple circular layout dynamically
           const radius = 90;
           const centerX = 200;
           const centerY = 150;
           
           const positionedNodes = data.nodes.map((n, i) => {
               const angle = (i / data.nodes.length) * 2 * Math.PI;
               // Add a tiny bit of random padding to make it feel organic
               const r = radius + (Math.random() * 20 - 10); 
               return {
                   ...n,
                   x: centerX + r * Math.cos(angle),
                   y: centerY + r * Math.sin(angle),
                   color: COLORS[i % COLORS.length]
               };
           });

           // Link x/y refs
           const finalLinks = data.links.map(l => {
              const sourceNode = positionedNodes.find(n => n.id === l.source);
              const targetNode = positionedNodes.find(n => n.id === l.target);
              return { ...l, sourceNode, targetNode };
           }).filter(l => l.sourceNode && l.targetNode);

           setGraphData({ nodes: positionedNodes, links: finalLinks });
        }
      } catch (err) {
        console.error("Failed to load real-time graph", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchGraph();
    // Poll every 10 seconds to catch new memories auto-extracting
    const interval = setInterval(fetchGraph, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 md:p-8 rounded-[2.5rem] w-full flex flex-col items-center h-full relative overflow-hidden bg-gradient-to-br from-white/20 to-transparent border-[3px] border-white/40 shadow-xl">
        <div className="w-full flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-ink font-serif">Semantic Graph</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ocean bg-ocean/10 px-3 py-1 rounded-full border border-ocean/20 animate-pulse">Live Sync</span>
        </div>
        <p className="text-foreground/60 text-sm mb-4 w-full">How your thoughts interconnect in the semantic database.</p>

        <div className="relative w-full flex-1 flex items-center justify-center min-h-[300px]">
            {isLoading ? (
               <div className="flex flex-col items-center animate-pulse">
                   <div className="w-8 h-8 rounded-full border-t-2 border-amber-400 animate-spin mb-4"></div>
                   <p className="text-sm font-semibold text-ink/40 tracking-widest uppercase">Querying Memgraph...</p>
               </div>
            ) : graphData.nodes.length === 0 ? (
               <div className="text-center">
                   <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest">No connections yet</p>
                   <p className="text-xs text-foreground/30 mt-2">Write a deeper journal entry to map concepts.</p>
               </div>
            ) : (
                <svg width="100%" height="100%" viewBox="0 0 400 300" className="opacity-95 drop-shadow-md overflow-visible">
                    
                    {/* Draw Links */}
                    {graphData.links.map((link, i) => (
                        <g key={`link-${i}`}>
                            <motion.line 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, delay: i * 0.1 }}
                                x1={link.sourceNode.x} y1={link.sourceNode.y} x2={link.targetNode.x} y2={link.targetNode.y} 
                                stroke="#81a6c6" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3"
                            />
                            <text 
                                x={(link.sourceNode.x + link.targetNode.x) / 2} 
                                y={(link.sourceNode.y + link.targetNode.y) / 2 - 4} 
                                fill="#81a6c6" fontSize="7" textAnchor="middle" 
                                className="font-bold uppercase tracking-widest"
                            >
                                {link.text}
                            </text>
                        </g>
                    ))}

                    {/* Draw Nodes */}
                    {graphData.nodes.map((node, i) => (
                        <motion.g 
                        key={`node-${node.id}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', delay: i * 0.05 }}
                        >
                        <motion.circle 
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 4 + (i%3), repeat: Infinity, ease: "easeInOut" }}
                            cx={node.x} cy={node.y} r="28" fill={node.color} 
                            className="shadow-inner drop-shadow-lg" 
                        />
                        <motion.text 
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 4 + (i%3), repeat: Infinity, ease: "easeInOut" }}
                            x={node.x} y={node.y + 3} 
                            fill="#3d3732" fontSize="9" fontWeight="bold" textAnchor="middle"
                            className="drop-shadow-sm"
                        >
                            {node.label}
                        </motion.text>
                        </motion.g>
                    ))}
                </svg>
            )}
        </div>
    </div>
  );
}
