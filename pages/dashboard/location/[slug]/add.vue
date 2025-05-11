<template>
    <div>
        <LocationLogForm :initial-values="initialValues" :on-submit="onSubmit" :on-submit-complete="submitComplete"
            submit-label="Add Location Log" submit-icon="tabler:map-pin-plus" />
    </div>
</template>

<script setup lang="ts">
import type { CreateLocationLogType } from '~/lib/db/schema/location-log';
import { NHA_TRANG_CITY } from '~/lib/constants';
const route = useRoute();
const { currentLocation } = useLocationStore();

const initialValues = {
    name: '',
    description: '',
    startedAt: Date.now() - (24 * 60 * 60 * 1000),
    endedAt: Date.now(),
    long: currentLocation?.long || (NHA_TRANG_CITY as [number, number])[0],
    lat: currentLocation?.lat || (NHA_TRANG_CITY as [number, number])[1],
}

async function onSubmit(location: CreateLocationLogType) {
    await $fetch(`/api/locations/${route.params.slug}/add`, {
        method: "post",
        body: location,
    });
}
function submitComplete() {
    navigateTo({
        name: "dashboard-location-slug",
        params: {
            slug: route.params.slug,
        },
    });
}
</script>