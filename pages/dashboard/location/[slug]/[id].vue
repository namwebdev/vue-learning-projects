<template>
    <div>
        <h1>Location Log Details</h1>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const locationStore = useLocationStore();

onMounted(() => {
    locationStore.refreshCurrentLocation();
});
</script> 