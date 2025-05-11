<template>
    <LocationBaseForm v-slot="{ errors, loading }" :initial-values="initialValues" :on-submit="onSubmit"
        :on-submit-complete="onSubmitComplete" :submit-label="submitLabel" :submit-icon="submitIcon" :zoom="zoom"
        :schema="CreateLocation">
        <AppFormField name="name" label="Name" :error="errors.name" :disabled="loading" />
        <AppFormField name="description" label="Description" type="textarea" :error="errors.description"
            :disabled="loading" />
    </LocationBaseForm>
</template>

<script setup lang="ts">
import { CreateLocation, type CreateLocationType } from "~/lib/db/schema/location";
import { MAP_ZOOM, NHA_TRANG_CITY } from "~/lib/constants";

const { initialValues = {
    name: '',
    description: '',
    long: (NHA_TRANG_CITY as [number, number])[0],
    lat: (NHA_TRANG_CITY as [number, number])[1],
}, onSubmit, onSubmitComplete, submitLabel, submitIcon, zoom = MAP_ZOOM } = defineProps<{
    initialValues?: CreateLocationType;
    onSubmit: (location: CreateLocationType) => Promise<any>;
    onSubmitComplete: () => void;
    submitLabel: string;
    submitIcon: string;
    zoom?: number;
}>();
</script>