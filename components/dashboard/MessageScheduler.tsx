
'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MessageSchedulerProps {
  onSchedule: (scheduledAt: Date) => void;
}

export function MessageScheduler({ onSchedule }: MessageSchedulerProps) {
  const [date, setDate] = useState<Date>();
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [meridiem, setMeridiem] = useState<'AM' | 'PM'>('PM');

  const handleSchedule = () => {
    if (!date) return;

    const scheduledDate = new Date(date);
    let hours = parseInt(hour);
    
    // Convert to 24-hour format
    if (meridiem === 'PM' && hours !== 12) {
      hours += 12;
    } else if (meridiem === 'AM' && hours === 12) {
      hours = 0;
    }

    scheduledDate.setHours(hours, parseInt(minute));
    onSchedule(scheduledDate);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Time Picker */}
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4 text-gray-500" />
        <Select value={hour} onValueChange={setHour}>
          <SelectTrigger className="w-[65px]">
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => {
              const hour = (i + 1).toString().padStart(2, '0');
              return (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <span>:</span>
        <Select value={minute} onValueChange={setMinute}>
          <SelectTrigger className="w-[65px]">
            <SelectValue placeholder="Min" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 60 }, (_, i) => {
              const minute = i.toString().padStart(2, '0');
              return (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Select
          value={meridiem}
          onValueChange={(value) => setMeridiem(value as 'AM' | 'PM')}
        >
          <SelectTrigger className="w-[65px]">
            <SelectValue placeholder="AM/PM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        variant="secondary"
        onClick={handleSchedule}
        disabled={!date}
      >
        Schedule
      </Button>
    </div>
  );
}
