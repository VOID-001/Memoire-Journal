export interface Note {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  color?: string; // Optional custom color for the calendar dot
}

const getISODate = (date: Date): string => date.toISOString().split('T')[0];

export const SAMPLE_NOTES: Note[] = [
  {
    id: `note-1`,
    date: getISODate(new Date(new Date().setDate(new Date().getDate() - 2))),
    content: 'A soothing beach day\n\nWalked along the shore and watched the waves. The colors were incredible today, blending sky and sand into a warm gradient.',
    color: 'bg-ocean'
  },
  {
    id: `note-2`,
    date: getISODate(new Date()),
    content: 'Driftwood findings\n\nFound a beautifully weathered piece of driftwood. The texture reminded me of old paper. It feels right to document this.',
    color: 'bg-driftwood'
  },
  {
    id: `note-3`,
    date: getISODate(new Date()),
    content: 'Evening calm\n\nThe starlight overlay was beautiful, but this grounded, breezy space feels easier to breathe in. I think I will rest here for a while.',
    color: 'bg-sky'
  }
];
