import { Service } from './service';
import { Profile } from './profile';

export enum CouponDiscountType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED_CART = 'FIXED_CART',
    FIXED_SERVICE = 'FIXED_SERVICE',
}

export enum CouponStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface Coupon {
    id: string;
    code: string;
    description: string | null;
    discountType: CouponDiscountType;
    amount: number;
    expiryDate: string | null;
    usageLimit: number | null;
    usageCount: number;
    minimumSpend: number | null;
    maximumSpend: number | null;
    services: Service[];
    excludeServices: Service[];
    staffs: Profile[];
    excludeStaffs: Profile[];
    status: CouponStatus;
    createdAt: string;
    updatedAt: string;
}
