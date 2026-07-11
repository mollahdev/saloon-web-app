export enum CouponDiscountType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED = 'FIXED',
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
    usageLimit: number | null;
    usageCount: number;
    minimumSpend: number | null;
    status: CouponStatus;
    createdAt: string;
    updatedAt: string;
}
