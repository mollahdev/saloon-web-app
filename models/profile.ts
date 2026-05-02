export interface Profile {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MEMBER';
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING_VERIFICATION' | 'LOCKED';
    position: string | null;
    phone: string | null;
    address: string | null;
    avatar: string | null;
    bio: string | null;
    createdAt: string;
    updatedAt: string;
}
