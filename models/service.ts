export interface Service {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number; // in minutes
    image: string | null;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
}
