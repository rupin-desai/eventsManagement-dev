import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";

type Event = {
  date: string;
  endDate?: string;
  title: string;
  locations: string;
  color: string;
};

export interface CustomCalendarProps {
  events: Event[];
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setHoveredEvents: React.Dispatch<
    React.SetStateAction<{ title: string; date: string }[]>
  >;
  calendarDayProps?: (date: Date) => Record<string, any>;
}

const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

const getEventDays = (events: Event[]) => {
  const days: { [date: string]: Event[] } = {};
  events.forEach((event) => {
    if (
      event.title === "Joy of Giving" ||
      event.title === "Audio Book Recording"
    ) {
      return;
    }
    if (event.endDate) {
      let current = new Date(event.date);
      const end = new Date(event.endDate);
      while (current <= end) {
        const key = format(current, "yyyy-MM-dd");
        if (!days[key]) days[key] = [];
        days[key].push(event);
        current.setDate(current.getDate() + 1);
      }
    } else {
      const key = event.date;
      if (!days[key]) days[key] = [];
      days[key].push(event);
    }
  });
  return days;
};

const CustomCalendar = ({
  events,
  selectedDate,
  setSelectedDate,
  setHoveredEvents,
  calendarDayProps,
}: CustomCalendarProps) => {
  const [currentMonth] = useState(new Date(2025, 7, 1)); // August 2025, fixed

  const eventDays = getEventDays(events);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-2">
      <span className="font-medium text-gray-700">Activity</span>
      <span className="font-semibold text-gray-800 text-sm">
        {format(currentMonth, "MMM yyyy")}
      </span>
    </div>
  );

  const renderDays = () => (
    <div className="grid grid-cols-7 mb-1">
      {dayNames.map((d) => (
        <div
          key={d}
          className="text-xs font-semibold text-gray-400 text-center py-1"
        >
          {d}
        </div>
      ))}
    </div>
  );

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "yyyy-MM-dd");
        const eventsOnDay = eventDays[formattedDate] || [];
        const isEvent = eventsOnDay.length > 0;
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = isSameMonth(day, monthStart);

        // Get background and boxShadow from calendarDayProps (hex gradient or color)
        const dayProps = calendarDayProps?.(day) || {};
        let background = dayProps.background;
        let boxShadow = dayProps.boxShadow;

        // Reduce opacity of gradient or color
        let style: React.CSSProperties = {};
        if (!isSelected && isEvent && background) {
          if (background.startsWith("linear-gradient")) {
            // Insert opacity for each color stop (e.g. #ff0000 -> #ff000080)
            background = background.replace(
              /#([0-9a-fA-F]{6})/g,
              (match: string) => `${match}80` // 40 = 25% opacity
            );
            style.background = background;
          } else if (background.startsWith("#") && background.length === 7) {
            style.background = `${background}80`; // 25% opacity
          } else {
            style.background = background;
          }
        }
        if (boxShadow) {
          style.boxShadow = boxShadow;
        }

        // Pass both title and date for hover
        const hoverEventObjs = eventsOnDay.map((ev) => ({
          title: ev.title,
          date: ev.date,
        }));

        days.push(
          <div
            key={formattedDate}
            className={`flex items-center justify-center h-8 w-8 mx-auto my-1 rounded-full transition
              ${isCurrentMonth ? "text-gray-900" : "text-gray-300"}
              ${isSelected ? "bg-blue-600 text-white" : ""}
              ${isToday && !isSelected ? "ring-2 ring-blue-300" : ""}
              hover:ring-2 hover:ring-blue-400 hover:ring-offset-2
            `}
            style={{
              ...style,
              cursor: "default",
            }}
            onMouseEnter={() => setHoveredEvents(hoverEventObjs)}
            onMouseLeave={() => setHoveredEvents([])}
            onClick={() => {
              if (isCurrentMonth && isEvent) setSelectedDate(day);
            }}
          >
            <div className="rounded-full w-8 h-8 flex items-center justify-center">
              {format(day, "d")}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="sticky top-6">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default CustomCalendar;