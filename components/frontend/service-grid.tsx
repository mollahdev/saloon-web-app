import { ServiceItem } from '@/repositories/services';
import { ServiceCard } from './service-card';

interface ServiceGridProps {
    services: ServiceItem[];
    selectedServiceIds: string[];
    onSelectService: (service: ServiceItem) => void;
}

export function ServiceGrid({ services, selectedServiceIds, onSelectService }: ServiceGridProps) {
    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-neutral-200/50 p-2 sm:p-4 md:p-6">
            {services.length === 0 ? (
                <div className="text-center py-12 px-4">
                    <p className="text-neutral-500 font-medium text-base font-[family-name:var(--font-barlow)]">
                        No services available at this time.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
                    {services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            isSelected={selectedServiceIds.includes(service.id)}
                            onSelect={onSelectService}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
