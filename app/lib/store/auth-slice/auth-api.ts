import APIHelper from '@/utils/api-helper';
import type { ApiResponse } from '@/models';
import type { LoginPayload, Login } from '@/models/auth';

export async function getGenerateDefaultUserApi() {
    return APIHelper.get(`/api/seed/default-user`);
}

export async function getLoginApi(payload: LoginPayload): ApiResponse<Login> {
    return APIHelper.post(`/api/auth/login`, payload);
}
