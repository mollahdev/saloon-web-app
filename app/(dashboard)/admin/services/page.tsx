'use client';
import { useState } from 'react';
import { SimpleGrid, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { size } from 'lodash';
import { PageTitle } from '@/utils/portal';
import { useGetServicesQuery } from '@/app/lib/store/services/api';
import { ServiceCard } from '@/components/dashboard/service-card';
import CreateServiceModal from '@/components/dashboard/create-service-modal';
import ServicesLoading from './loading';
import ServicesEmpty from './empty';
import { Service } from '@/models/service';

export default function ServicesPage() {
    const { data: response, isLoading, error } = useGetServicesQuery();
    const services = response?.data || [];
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const handleEditClick = (service: Service) => {
        setSelectedService(service);
        open();
    };

    const handleClose = () => {
        setSelectedService(null);
        close();
    };

    if (isLoading) {
        return (
            <>
                <PageTitle.Source>Services</PageTitle.Source>
                <ServicesLoading />
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageTitle.Source>Services</PageTitle.Source>
                <div className="bg-red-50 p-4 rounded-lg text-red-600">
                    Failed to load services. Please try again later.
                </div>
            </>
        );
    }

    return (
        <div className="max-w-[1300px] mx-auto w-full">
            <PageTitle.Source>Services</PageTitle.Source>

            {size(services) !== 0 && (
                <div className="flex flex-col gap-2 md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Services</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage your saloon service directory
                        </p>
                    </div>
                    <Button
                        id="create-service-btn"
                        onClick={() => {
                            setSelectedService(null);
                            open();
                        }}
                        size="md"
                    >
                        Add New Service
                    </Button>
                </div>
            )}

            {size(services) === 0 ? (
                <ServicesEmpty
                    onCreateClick={() => {
                        setSelectedService(null);
                        open();
                    }}
                />
            ) : (
                <SimpleGrid
                    cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
                    spacing="lg"
                    verticalSpacing="lg"
                >
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} onEdit={handleEditClick} />
                    ))}
                </SimpleGrid>
            )}

            <CreateServiceModal opened={opened} onClose={handleClose} service={selectedService} />
        </div>
    );
}
