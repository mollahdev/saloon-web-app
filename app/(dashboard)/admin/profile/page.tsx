'use client';
import { Button, Divider, TextInput, Textarea, Select, Switch } from '@mantine/core';
import { useEffect } from 'react';
import { schemaResolver, useForm } from '@mantine/form';
import toast from 'react-hot-toast';
/**
 * Internal dependencies
 */
import ProfileLoading from './loading';
import { profileSchema, ProfileValues } from '@/app/lib/validation/profile';
import { PageTitle } from '@/utils/portal';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/app/lib/store/profile/api';
import { ROLE, STATUS } from '@/constants';

export default function ProfilePage() {
    const { data: profileResponse, isLoading, error } = useGetProfileQuery();
    const profile = profileResponse?.data;
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const form = useForm<ProfileValues>({
        initialValues: {
            name: '',
            position: '',
            phone: '',
            address: '',
            bio: '',
            role: 'MEMBER',
            status: 'PENDING_VERIFICATION',
        },
        validate: schemaResolver(profileSchema),
    });

    useEffect(() => {
        if (profile) {
            form.setValues({
                name: profile.name || '',
                position: profile.position || '',
                phone: profile.phone || '',
                address: profile.address || '',
                bio: profile.bio || '',
                role: profile.role || 'MEMBER',
                status: profile.status || 'PENDING_VERIFICATION',
            });
        }
    }, [profile]);

    if (isLoading || error || !profile) {
        return <ProfileLoading />;
    }

    const handleSubmit = async (values: ProfileValues) => {
        try {
            const response = await updateProfile(values).unwrap();
            toast.success(response.message);
        } catch {}
    };

    return (
        <>
            <PageTitle.Source>Profile</PageTitle.Source>
            <div className="max-w-3xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
                <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
                    <div className="grid grid-cols-1 items-center md:grid-cols-2 gap-6 pb-4">
                        <TextInput
                            id="profile-name"
                            label="Name"
                            placeholder="Your name"
                            size="md"
                            key={form.key('name')}
                            {...form.getInputProps('name')}
                        />

                        <TextInput
                            id="profile-position"
                            label="Position"
                            placeholder="Your position"
                            size="md"
                            key={form.key('position')}
                            {...form.getInputProps('position')}
                        />

                        <TextInput
                            id="profile-phone"
                            label="Phone number"
                            placeholder="Your phone number"
                            type="tel"
                            size="md"
                            key={form.key('phone')}
                            {...form.getInputProps('phone')}
                        />

                        <TextInput
                            id="profile-address"
                            label="Address"
                            placeholder="Your address"
                            size="md"
                            key={form.key('address')}
                            {...form.getInputProps('address')}
                        />

                        <div className="col-span-1 md:col-span-2">
                            <Textarea
                                id="profile-bio"
                                label="Bio"
                                placeholder="Tell us about yourself..."
                                size="md"
                                minRows={4}
                                key={form.key('bio')}
                                {...form.getInputProps('bio')}
                            />
                        </div>

                        {profile.role !== ROLE.OWNER && (
                            <Select
                                id="profile-role"
                                label="Role"
                                placeholder="Select role"
                                size="md"
                                data={[
                                    { value: 'ADMIN', label: 'Admin' },
                                    { value: 'MEMBER', label: 'Member' },
                                ]}
                                key={form.key('role')}
                                {...form.getInputProps('role')}
                            />
                        )}

                        <div className="md:mt-6">
                            <Switch
                                id="profile-status"
                                label="Active Account"
                                size="md"
                                key={form.key('status')}
                                checked={form.values.status === STATUS.ACTIVE}
                                onChange={(event) =>
                                    form.setFieldValue(
                                        'status',
                                        event.currentTarget.checked
                                            ? STATUS.ACTIVE
                                            : STATUS.INACTIVE
                                    )
                                }
                            />
                        </div>
                    </div>

                    <Divider />
                    <div className="pt-4 flex justify-end">
                        <Button
                            id="profile-submit"
                            type="submit"
                            size="md"
                            loading={isUpdating}
                            loaderProps={{ type: 'dots' }}
                        >
                            Save Profile
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
