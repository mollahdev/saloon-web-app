import { ROLE } from '@/constants';

/**
 * Checks if a user role is ADMIN or OWNER
 * @param role The role to check
 * @returns boolean
 */
export const isAdminOrOwner = (role?: string): boolean => {
    return role === ROLE.ADMIN || role === ROLE.OWNER;
};
