'use client';

import React from 'react';
import { TimePicker, TimePickerProps } from '@mantine/dates';

const preventTyping = { onKeyDown: (e: React.KeyboardEvent) => e.preventDefault() };

/**
 * A time picker with 5-minute intervals using Mantine's TimePicker.
 * Shows a dropdown with hour/minute columns for easy selection.
 * Keyboard input is blocked — users must select from the dropdown.
 *
 * Accepts all standard Mantine TimePicker props.
 */
export default function ScheduleTimePicker(props: TimePickerProps) {
    return (
        <TimePicker
            withDropdown
            minutesStep={5}
            format="12h"
            maxDropdownContentHeight={200}
            hoursInputProps={preventTyping}
            minutesInputProps={preventTyping}
            amPmSelectProps={preventTyping}
            {...props}
        />
    );
}
