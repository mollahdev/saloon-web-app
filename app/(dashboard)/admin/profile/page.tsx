'use client';
import { Button, Divider, TextInput, Textarea, Select, Switch } from '@mantine/core';
import { useEffect } from 'react';
import ProfileLoading from './loading';
import { schemaResolver, useForm } from '@mantine/form';
import { profileSchema, ProfileValues } from '@/app/lib/validation/profile';
import { PageTitle } from '@/utils/portal';
import { useGetProfileQuery } from '@/app/lib/store/profile/api';
export default function ProfilePage() {
    const { data: profileResponse, isLoading, error } = useGetProfileQuery();
    const profile = profileResponse?.data;

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

    if (isLoading || error) {
        return <ProfileLoading />;
    }

    const handleSubmit = (values: ProfileValues) => {
        console.log('🚀 ~ ProfilePage ~ handleSubmit ~ values:', values);
    };

    return (
        <>
            <PageTitle.Source>Profile</PageTitle.Source>
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
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

                        <div className="flex items-center pt-6">
                            <Switch
                                id="profile-status"
                                label="Active Account"
                                size="md"
                                key={form.key('status')}
                                checked={form.values.status === 'ACTIVE'}
                                onChange={(event) =>
                                    form.setFieldValue(
                                        'status',
                                        event.currentTarget.checked ? 'ACTIVE' : 'INACTIVE'
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
