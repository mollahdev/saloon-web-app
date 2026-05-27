import icon from '@/app/icon.png';

export const projectData = {
    title: 'Big Apple Barbers',
    icon: icon,
} as const;

export const timezones = 'America/New_York';
export const passwordSaltRounds = 10;

export const workingDayOptions = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
] as const;

export const defaultSchedule = workingDayOptions.map((day) => {
    return {
        dayOfWeek: day,
        isOffDay: false,
        startTime: '10:00:00',
        endTime: '19:00:00',
    };
});

export const ROLE = {
    OWNER: 'OWNER',
    ADMIN: 'ADMIN',
    MEMBER: 'MEMBER',
} as const;

export type ROLE_TYPE = (typeof ROLE)[keyof typeof ROLE];

export const STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    PENDING_VERIFICATION: 'PENDING_VERIFICATION',
    LOCKED: 'LOCKED',
} as const;

export const REPEAT_OPTIONS = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'YEARLY', label: 'Yearly' },
];

export const DAY_OF_WEEK_OPTIONS = workingDayOptions.map((day) => ({
    value: day,
    label: day.charAt(0) + day.slice(1).toLowerCase(),
}));
