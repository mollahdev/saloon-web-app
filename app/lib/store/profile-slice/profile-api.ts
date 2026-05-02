import APIHelper from '@/utils/api-helper';
import type { Profile } from '@/models/profile';
import type { ApiResponse } from '@/models';

export async function getProfileApi(): ApiResponse<Profile> {
    return APIHelper.get(`/api/private/users`);
}
