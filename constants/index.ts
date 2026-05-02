import icon from '@/app/icon.png';

export const projectData = {
    title: 'Big Apple Barbers',
    icon: icon,
} as const;

export const timezones = 'America/New_York';
export const passwordSaltRounds = 10;

export const workingDayOptions = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
] as const;

export const defaultWorkingHours = workingDayOptions.map((day) => {
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

export const STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    PENDING_VERIFICATION: 'PENDING_VERIFICATION',
    LOCKED: 'LOCKED',
} as const;
