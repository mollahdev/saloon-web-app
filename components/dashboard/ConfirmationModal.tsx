'use client';

import { Modal, Button, Group, Text, Stack, ThemeIcon } from '@mantine/core';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useAppDispatch, useAppSelector } from '@/app/lib/store';
import { selectConfirmation } from '@/app/lib/store/ui/slice';
import { _handleGlobalConfirm, _handleGlobalCancel } from '@/hooks/use-confirmation';

export function ConfirmationModal() {
    const dispatch = useAppDispatch();
    const config = useAppSelector(selectConfirmation);

    return (
        <Modal
            opened={config.opened}
            onClose={() => _handleGlobalCancel(dispatch)}
            title={null}
            centered
            radius="md"
            padding="xl"
            withCloseButton={false}
            size="sm"
            transitionProps={{
                transition: 'pop',
                duration: 300,
                timingFunction: 'ease',
            }}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <Stack align="center" gap="md">
                <ThemeIcon
                    color={config.color}
                    variant="light"
                    size={60}
                    radius={60}
                    className="animate-pulse"
                >
                    <HiOutlineExclamationCircle size={36} />
                </ThemeIcon>

                <div className="text-center">
                    <Text size="xl" fw={700} className="text-gray-800">
                        {config.title}
                    </Text>
                    <Text size="sm" color="dimmed" mt={4}>
                        {config.message}
                    </Text>
                </div>

                <Group justify="center" mt="lg" w="full">
                    <Button
                        variant="subtle"
                        color="gray"
                        onClick={() => _handleGlobalCancel(dispatch)}
                        disabled={config.loading}
                        className="font-semibold"
                    >
                        {config.cancelLabel}
                    </Button>
                    <Button
                        color={config.color}
                        onClick={() => _handleGlobalConfirm(dispatch)}
                        loading={config.loading}
                        className="font-semibold"
                    >
                        {config.confirmLabel}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
