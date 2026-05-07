import { ROLE } from '../constants';
import { STATUS } from '../constants';

export interface Profile {
    id: string;
    name: string;
    email: string;
    role: (typeof ROLE)[keyof typeof ROLE];
    status: (typeof STATUS)[keyof typeof STATUS];
    position: string | null;
    phone: string | null;
    address: string | null;
    avatar: string | null;
    bio: string | null;
    createdAt: string;
    updatedAt: string;
}
