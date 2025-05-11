<template>
  <div class="p-4 min-h-64">
    <h2 class="text-2xl">Locations</h2>

    <div v-if="status === 'pending'">
      <span class="loading loading-spinner loading-xl" />
    </div>

    <div v-else-if="locations && locations.length > 0" class="flex flex-nowrap mt-4 gap-2 overflow-auto">
      <LocationCard v-for="location in locations" :key="location.id"
        :map-point="createMapPointFromLocation(location)" />
    </div>

    <div v-else class="flex flex-col gap-2 mt-4">
      <p>Add a location to get started</p>
      <NuxtLink to="/dashboard/add" class="btn btn-primary w-40">
        Add Location
        <Icon name="tabler:tabler:circle-plus-filled" size="24" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const locationStore = useLocationStore();

const { locations, locationsStatus: status } = storeToRefs(locationStore);

onMounted(() => {
  locationStore.refreshLocations();
});
</script>
