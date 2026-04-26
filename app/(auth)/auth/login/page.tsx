'use client';
import {
    Anchor,
    Box,
    Button,
    Center,
    Divider,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import Link from 'next/link';
import { useEffect } from 'react';
/**
 * Internal dependencies
 */
import { projectData } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/app/lib/store';
import { selectisDefaultUserGenerated } from '@/app/lib/store/auth-slice/auth-slice';
import { generateDefaultUserAction } from '@/app/lib/store/auth-slice/auth-action';
import { loginSchema, type LoginFormValues } from './schema';

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const isDefaultUserGenerated = useAppSelector(selectisDefaultUserGenerated);

    useEffect(() => {
        dispatch(generateDefaultUserAction());
    }, [dispatch]);

    const form = useForm<LoginFormValues>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
        },
        validate: schemaResolver(loginSchema),
    });

    const handleSubmit = (values: LoginFormValues) => {
        // TODO: wire up authentication
        console.log(values);
    };

    return (
        <Center mih="100vh" px="md">
            <Box w="100%" maw={420}>
                {/* Heading */}
                <Stack gap={4} mb="xl">
                    <Title order={1} ta="center" fz={{ base: 'xl', sm: '2xl' }}>
                        {projectData.title}
                        {isDefaultUserGenerated && ' 🎉'}
                    </Title>
                    <Text c="dimmed" ta="center" fz="sm">
                        Sign in to continue to your account
                    </Text>
                </Stack>

                <Paper withBorder shadow="sm" p={{ base: 'lg', sm: 'xl' }} radius="md">
                    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
                        <Stack gap="md">
                            {/* Email */}
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

                            {/* Password */}
                            <Box>
                                <PasswordInput
                                    id="login-password"
                                    label="Password"
                                    placeholder="Your password"
                                    autoComplete="current-password"
                                    size="md"
                                    key={form.key('password')}
                                    {...form.getInputProps('password')}
                                />

                                {/* Forgot password — right-aligned below the field */}
                                <Anchor
                                    component={Link}
                                    href="/auth/forgot-password"
                                    fz="sm"
                                    mt={6}
                                    display="block"
                                    ta="right"
                                >
                                    Forgot password?
                                </Anchor>
                            </Box>

                            <Divider />

                            {/* Submit */}
                            <Button id="login-submit" type="submit" fullWidth size="md">
                                Sign in
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Box>
        </Center>
    );
}
