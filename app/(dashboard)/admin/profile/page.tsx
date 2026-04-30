'use client';
import { Button, Divider, PasswordInput, TextInput } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { loginSchema } from '@/app/lib/validation/auth';
import { PageTitle } from '@/utils/portal';

export default function ProfilePage() {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
        },
        validate: schemaResolver(loginSchema),
    });

    const handleSubmit = (values: any) => {
        console.log('🚀 ~ ProfilePage ~ handleSubmit ~ values:', values);
    };

    return (
        <>
            <PageTitle.Source>Profile</PageTitle.Source>
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-md">
                <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
                    <div className="grid grid-cols-2 gap-6 pb-4">
                        <TextInput
                            id="login-email"
                            label="Email address"
                            placeholder="you@example.com"
                            type="email"
                            autoComplete="email"
                            size="md"
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                        />

                        <PasswordInput
                            id="login-password"
                            label="Password"
                            placeholder="Your password"
                            autoComplete="current-password"
                            size="md"
                            key={form.key('password')}
                            {...form.getInputProps('password')}
                        />
                    </div>

                    <Divider />
                    <div className="pt-4">
                        <Button
                            id="login-submit"
                            type="submit"
                            size="md"
                            loaderProps={{ type: 'dots' }}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
