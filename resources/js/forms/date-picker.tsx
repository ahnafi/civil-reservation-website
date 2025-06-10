'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatLocale } from '@/utils/date-utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

export default function DatePickerShadCN({ label }: { label: string }) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn('w-full justify-between rounded-md border px-4 py-2 text-left', !selectedDate && 'text-muted-foreground')}
                >
                    {selectedDate ? formatLocale(selectedDate) : label}
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
            </PopoverContent>
        </Popover>
    );
}
