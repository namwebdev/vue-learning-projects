<template>
  <LocationBaseForm v-slot="{ errors, loading }" :initial-values="initialValues" :on-submit="onSubmit"
    :on-submit-complete="onSubmitComplete" :submit-label="submitLabel" :submit-icon="submitIcon"
    :schema="CreateLocationLog" :zoom="MAP_ZOOM">
    <AppFormField name="name" label="Name" :error="errors.name" :disabled="loading" />
    <AppFormField name="description" label="Description" type="textarea" :error="errors.description"
      :disabled="loading" />
    <AppDateFormField name="startedAt" label="Started At" :value="initialValues.startedAt" :error="errors.startedAt"
      :disabled="loading" />
    <AppDateFormField name="endedAt" label="Ended At" :value="initialValues.endedAt" :error="errors.endedAt"
      :disabled="loading" />
  </LocationBaseForm>
</template>

<script setup lang="ts">
import { MAP_ZOOM, NHA_TRANG_CITY } from "~/lib/constants";
import { type CreateLocationLogType, CreateLocationLog } from "~/lib/db/schema/location-log";

const props = defineProps<{
  onSubmit: (location: CreateLocationLogType) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
}>();

const initialValues = {
  name: "",
  description: "",
  startedAt: Date.now() - (24 * 60 * 60 * 1000),
  endedAt: Date.now(),
  long: (NHA_TRANG_CITY as [number, number])[0],
  lat: (NHA_TRANG_CITY as [number, number])[1],
};
</script>

<style scoped></style>