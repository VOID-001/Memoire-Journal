'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Note } from '@/lib/ui-types';
import { ArrowLeftIcon, ArrowRightIcon, ChevronDoubleLeftIcon } from './Icons';

interface CalendarProps {
  notes: Note[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onToggle?: () => void;
  isExpanded?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ notes, selectedDate, setSelectedDate, onToggle, isExpanded = true }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  useEffect(() => {
    setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  }, [selectedDate]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const notesByDate = useMemo(() => {
    return notes.reduce((acc, note) => {
        (acc[note.date] = acc[note.date] || []).push(note);
        return acc;
    }, {} as Record<string, Note[]>);
  }, [notes]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const getISODate = (date: Date): string => {
    // Handling local time correctly
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  };

  const renderDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = startDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }

    const todayIso = getISODate(new Date());

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const isoDate = getISODate(date);
      const isSelected = getISODate(selectedDate) === isoDate;
      const isToday = todayIso === isoDate;
      const hasNotes = notesByDate[isoDate];

      const dayClasses = `
        w-10 h-10 flex flex-col items-center justify-center rounded-full cursor-pointer transition-all relative font-sans
        ${isSelected ? 'bg-ocean text-white shadow-md shadow-ocean/30 hover:scale-105' : ''}
        ${!isSelected && isToday ? 'bg-driftwood/30 text-ink font-bold hover:bg-driftwood/50' : ''}
        ${!isSelected && !isToday ? 'text-foreground hover:bg-sky/20' : ''}
      `;

      days.push(
        <div key={day} className={dayClasses} onClick={() => setSelectedDate(date)}>
          <span className="relative z-10">{day}</span>
          {hasNotes && (
            <div className="absolute bottom-1.5 flex gap-0.5 justify-center z-20">
              {hasNotes.slice(0, 3).map((note, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : (note.color || 'bg-ocean')}`}
                ></div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  if (!isExpanded) {
    return (
      <div 
        onClick={onToggle}
        className="bg-paper/80 backdrop-blur-xl p-4 rounded-2xl border border-driftwood/20 shadow-xl shadow-ocean/5 flex flex-col items-center justify-center cursor-pointer hover:bg-paper transition-all animate-fade-in group"
      >
        <span className="text-ocean text-sm font-semibold uppercase tracking-widest font-sans rotate-180 -translate-y-2" style={{ writingMode: 'vertical-rl' }}>
            Calendar
        </span>
      </div>
    );
  }

  return (
    <div className="bg-paper/80 backdrop-blur-xl p-6 rounded-3xl border border-driftwood/20 shadow-xl shadow-ocean/5 flex-shrink-0 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        {onToggle && (
          <button onClick={onToggle} className="p-2 -ml-2 rounded-full hover:bg-sky/20 transition-colors group" aria-label="Minimize calendar">
              <ChevronDoubleLeftIcon className="w-5 h-5 text-driftwood group-hover:text-ocean" />
          </button>
        )}
        <h2 className="text-xl font-serif font-semibold text-ink uppercase tracking-widest ml-2">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center gap-1">
            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-sky/20 transition-colors group" aria-label="Previous month">
                <ArrowLeftIcon className="w-5 h-5 text-driftwood group-hover:text-ocean" />
            </button>
            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-sky/20 transition-colors group" aria-label="Next month">
                <ArrowRightIcon className="w-5 h-5 text-driftwood group-hover:text-ocean" />
            </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-3 mb-2 text-center text-xs uppercase tracking-widest text-driftwood font-sans">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="w-10">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center items-center justify-items-center">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
