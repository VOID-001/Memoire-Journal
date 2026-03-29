import { create } from "zustand";
import debounce from "lodash.debounce";

export interface Message {
  role: "USER" | "AI";
  content: string;
}

interface JournalState {
  messages: Message[];
  date: Date;
  setDate: (d: Date) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (content: string) => void;
  debouncedSave: (content: string, dateStr: string) => void;
  clearMessages: () => void;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  messages: [],
  date: new Date(),

  setDate: (date: Date) => set({ date }),

  setMessages: (messages: Message[]) => set({ messages }),

  clearMessages: () => set({ messages: [] }),

  addMessage: (content: string) => {
    const newMsg: Message = { role: "USER", content };

    set((state) => ({
      messages: [...state.messages, newMsg],
    }));

    // Pass ISO date string to debounced function to ensure safety across re-renders
    const isoDate = get().date.toISOString().split("T")[0];
    get().debouncedSave(content, isoDate);
  },

  debouncedSave: debounce(async (content: string, dateStr: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/journal/entry`, {
        method: "POST",
        body: JSON.stringify({
          date: dateStr,
          content,
        }),
        headers: { "Content-Type": "application/json" },
      });
      
      if (res.ok) {
          const data = await res.json();
          if (data.aiMessage) {
              // Inject the simulated AI response directly into the conversation stream
              set((state) => ({ messages: [...state.messages, data.aiMessage] }));
          }
      }
    } catch (e) {
      console.error("Autosave failed silently", e);
    }
  }, 800),
}));
