'use client';

import { Divider, TextInput, Textarea, NumberInput, Grid, Switch } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { ServiceValues } from '@/app/lib/validation/service';
import { labelStyles } from './label-styles';

interface ServiceDetailsFormProps {
    form: UseFormReturnType<ServiceValues>;
}

export function ServiceDetailsForm({ form }: ServiceDetailsFormProps) {
    return (
        <Grid gap="md">
            <Grid.Col span={{ base: 12 }}>
                <TextInput
                    id="service-name"
                    label="Service Name"
                    placeholder="e.g. Premium Haircut"
                    required
                    {...form.getInputProps('name')}
                    styles={{ label: labelStyles }}
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                    id="service-price"
                    label="Price ($)"
                    placeholder="e.g. 45"
                    min={1}
                    allowDecimal={false}
                    hideControls
                    required
                    {...form.getInputProps('price')}
                    styles={{ label: labelStyles }}
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                    id="service-duration"
                    label="Duration (Minutes)"
                    placeholder="e.g. 30"
                    min={1}
                    allowDecimal={false}
                    required
                    {...form.getInputProps('duration')}
                    styles={{ label: labelStyles }}
                />
            </Grid.Col>

            <Grid.Col span={{ base: 12 }}>
                <Textarea
                    id="service-description"
                    label="Description (Optional)"
                    placeholder="Describe what the service includes..."
                    minRows={4}
                    {...form.getInputProps('description')}
                    styles={{ label: labelStyles }}
                />
            </Grid.Col>

            {/* Availability Settings Toggle */}
            <Grid.Col span={{ base: 12 }} className="mt-2">
                <Divider label="Service Availability" labelPosition="left" mb="md" />
                <Switch
                    id="service-status"
                    label="Active Service"
                    size="md"
                    checked={form.values.status === 'ACTIVE'}
                    onChange={(event) =>
                        form.setFieldValue(
                            'status',
                            event.currentTarget.checked ? 'ACTIVE' : 'INACTIVE'
                        )
                    }
                />
            </Grid.Col>
        </Grid>
    );
}
