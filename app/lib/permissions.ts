import { ROLE, STATUS } from '@/constants';

interface UserWithPermissions {
    role: string;
    status: string;
}

export const isAdminOrOwner = (user: UserWithPermissions): boolean => {
    return user.role === ROLE.ADMIN || user.role === ROLE.OWNER;
};

export const isActiveStatus = (user: UserWithPermissions): boolean => {
    return user.status === STATUS.ACTIVE || user.role === ROLE.OWNER;
};
