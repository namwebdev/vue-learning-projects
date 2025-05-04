<template>
    <div class="p-4">
        <h2 class="text-2xl">
            Locations
        </h2>

        <div v-if="status === 'pending'">
            <span class="loading loading-spinner loading-xl" />
        </div>

        <div v-else-if="data && data.length > 0" class="flex flex-nowrap mt-4 gap-2 overflow-auto">
            <div v-for="location in data" :key="location.id"   class="card card-compact bg-base-300 h-32 border-2 w-52 mb-2 shrink-0 hover:cursor-pointer"
         :class="{
           'border-accent': location === mapStore.selectedPoint,
           'border-transparent': location !== mapStore.selectedPoint,
         }"
         @mouseenter="mapStore.selectedPoint = location"
         @mouseleave="mapStore.selectedPoint = null">
                <div class="card-body">
                    <h3 class="text-xl">{{ location.name }}</h3>
                    <p>{{ location.description }}</p>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col gap-2 mt-4">
            <p>Add a location to get started</p>
            <NuxtLink to="/dashboard/add" class="btn btn-primary w-40">
                Add Location
                <Icon name="tabler:tabler:circle-plus-filled" size="24" />
            </NuxtLink>
        </div>
    </div>
    <AppMap class="flex-1" />
</template>

<script setup lang="ts">
const { data, status } = await useFetch("/api/locations", {
    lazy: true,
})

const mapStore = useMapStore();
</script>
