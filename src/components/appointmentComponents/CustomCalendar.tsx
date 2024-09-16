import React from 'react';
import { DayPicker, DayPickerSingleProps } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomCalendarProps extends Omit<DayPickerSingleProps, 'mode'> {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  disabledDays?: Date[] | ((date: Date) => boolean);
  className?: string;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ 
  selectedDate, 
  onSelectDate, 
  disabledDays, 
  className,
  ...props 
}) => {
  const today = new Date();

  return (
    <DayPicker
      mode="single"
      selected={selectedDate}
      onSelect={onSelectDate}
      disabled={disabledDays}
      fromDate={today}
      className={`p-3 bg-white rounded-lg shadow-md ${className}`}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-gray-900",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity duration-200",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-xs uppercase",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
        day: "h-9 w-9 p-0 font-normal rounded-full hover:bg-gray-100 transition-colors duration-200",
        day_selected: "bg-blue-500 text-white hover:bg-blue-600",
        day_today: "bg-gray-200 font-semibold",
        day_outside: "text-gray-400 opacity-50",
        day_disabled: "text-gray-400 opacity-30",
        day_hidden: "invisible",
      }}
      components={{
      }}
      {...props}
    />
  );
};

export default CustomCalendar;