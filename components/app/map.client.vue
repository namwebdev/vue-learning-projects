<template>
    <MglMap :map-style="mapStyle" :center="[NHA_TRANG_CITY[0], NHA_TRANG_CITY[1]]" :zoom="zoom">
        <MglNavigationControl />

        <MglMarker v-for="point in mapStore.mapPoints" :key="point.id" :coordinates="[point.long, point.lat]">
            <template #marker>
                <div class="tooltip tooltip-top" :data-tip="point.name"
                    :class="{ 'tooltip-open': mapStore.selectedPoint === point }"
                 >
                    <Icon name="tabler:map-pin-filled" size="30"
                        :class="mapStore.selectedPoint === point ? 'text-accent' : 'text-secondary'" />
                </div>
            </template>

            <MglPopup>
                <h3 class="text-xl">
                    {{ point.name }}
                </h3>
                <p v-if="point.description">
                    {{ point.description }}
                </p>
            </MglPopup>
        </MglMarker>
    </MglMap>
</template>

<script setup lang="ts">
import { NHA_TRANG_CITY, MAP_ZOOM } from "@/lib/constants";

const colorMode = useColorMode();
const mapStore = useMapStore();

const mapStyle = computed(() => colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty");
const zoom = MAP_ZOOM;

onMounted(() => {
    mapStore.init();
});
</script>
