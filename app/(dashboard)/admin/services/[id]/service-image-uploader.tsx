'use client';

import { RefObject } from 'react';
import { Button, Card, Text, Group, Stack, Badge, Loader } from '@mantine/core';
import { HiOutlineUpload, HiOutlineClock } from 'react-icons/hi';

interface ServiceImageUploaderProps {
    imageUrl: string | null | undefined;
    name: string;
    price: number;
    duration: number;
    status: string;
    isUploadingImage: boolean;
    fileInputRef: RefObject<HTMLInputElement | null>;
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
}

export function ServiceImageUploader({
    imageUrl,
    name,
    price,
    duration,
    status,
    isUploadingImage,
    fileInputRef,
    onUpload,
    onRemoveImage,
}: ServiceImageUploaderProps) {
    return (
        <Card withBorder radius="lg" className="bg-white p-6 relative overflow-hidden shadow-sm">
            {/* Decorator Header */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />

            <Stack align="center" gap="md" className="mt-2">
                <div className="relative group w-full">
                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onUpload}
                        accept="image/png,image/jpeg,image/gif,image/webp"
                        style={{ display: 'none' }}
                    />

                    {imageUrl ? (
                        <div className="relative rounded-lg overflow-hidden border border-gray-100 shadow-sm w-full h-44 bg-gray-50 flex items-center justify-center">
                            <img
                                src={imageUrl}
                                alt="Service Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    size="xs"
                                    variant="filled"
                                    color="blue"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingImage}
                                >
                                    Change
                                </Button>
                                <Button
                                    size="xs"
                                    variant="filled"
                                    color="red"
                                    onClick={onRemoveImage}
                                    disabled={isUploadingImage}
                                >
                                    Remove
                                </Button>
                            </div>
                            {isUploadingImage && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                                    <Loader size="xs" color="white" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 rounded-lg w-full h-44 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 transition-all gap-2 bg-gray-50/50"
                        >
                            {isUploadingImage ? (
                                <>
                                    <Loader size="xs" color="indigo" />
                                    <Text size="xs" className="text-gray-500">
                                        Uploading image...
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <HiOutlineUpload size={24} className="text-gray-400" />
                                    <Text size="xs" fw={600} className="text-gray-600 text-center">
                                        Click to upload image
                                    </Text>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="text-center w-full">
                    <Text fw={700} size="lg" className="line-clamp-1">
                        {name || 'Service Name'}
                    </Text>
                    <Text size="md" c="indigo" fw={700} mt="xs">
                        ${Math.round(Number(price || 0))}
                    </Text>
                </div>

                <Group justify="center" gap="xs">
                    <Badge
                        color="indigo"
                        variant="light"
                        leftSection={<HiOutlineClock size={12} className="mt-0.5" />}
                        className="font-semibold px-2.5 py-1 h-auto"
                    >
                        {duration || 0} mins
                    </Badge>
                    <Badge
                        color={status === 'ACTIVE' ? 'teal' : 'orange'}
                        variant="light"
                        className="font-semibold px-2.5 py-1 h-auto"
                    >
                        {status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </Badge>
                </Group>
            </Stack>
        </Card>
    );
}
