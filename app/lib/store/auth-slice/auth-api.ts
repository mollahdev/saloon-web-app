import APIHelper from '@/utils/api-helper';

export async function generateDefaultUser() {
    return APIHelper.get(`/api/seed/default-user`);
}
