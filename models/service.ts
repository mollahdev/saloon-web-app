import { Profile } from './profile';
import { Coupon } from './coupon';

export interface ServiceCoupon {
    id: string;
    serviceId: string;
    couponId: string;
    coupon?: Coupon;
    amount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ServicePricingCoupon {
    id: string;
    servicePricingId: string;
    couponId: string;
    coupon?: Coupon;
    amount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ServicePricing {
    id: string;
    serviceId: string;
    staffId: string;
    staff?: Profile;
    price: number;
    enableCoupons?: boolean;
    pricingCoupons?: ServicePricingCoupon[];
    createdAt: string;
    updatedAt: string;
}

export interface Service {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number; // in minutes
    image: string | null;
    status: 'ACTIVE' | 'INACTIVE';
    pricingVariations?: ServicePricing[];
    enableCoupons?: boolean;
    serviceCoupons?: ServiceCoupon[];
    createdAt: string;
    updatedAt: string;
}
