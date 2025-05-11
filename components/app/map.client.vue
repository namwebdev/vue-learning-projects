<template>
  <MglMap :map-style="mapStyle" :center="[NHA_TRANG_CITY[0], NHA_TRANG_CITY[1]]" :zoom="zoom"
    @map:dblclick="onDoubleClick">
    <MglNavigationControl />

    <MglMarker v-if="mapStore.addedPoint" draggable :coordinates="[mapStore.addedPoint.long, mapStore.addedPoint.lat]"
      @update:coordinates="updateAddedPoint">
      <template #marker>
        <div class="tooltip tooltip-top tooltip-open hover:cursor-pointer" data-tip="Drag to your desired location">
          <Icon name="tabler:map-pin-filled" size="35" class="text-warning" />
        </div>
      </template>
    </MglMarker>

    <MglMarker v-for="point in mapStore.mapPoints" :key="point.id" :coordinates="[point.long, point.lat]">
      <template #marker>
        <div class="tooltip tooltip-top hover:cursor-pointer" :data-tip="point.name" :class="{
          'tooltip-open': isPointSelected(point, mapStore.selectedPoint),
        }" @mouseenter="mapStore.selectedPoint = point" @mouseleave="mapStore.selectedPoint = null">
          <Icon name="tabler:map-pin-filled" size="30" :class="isPointSelected(point, mapStore.selectedPoint)
              ? 'text-accent'
              : 'text-secondary'
            " />
        </div>
      </template>

      <MglPopup>
        <h3 class="text-xl">
          {{ point.name }}
        </h3>
        <p v-if="point.description">
          {{ point.description }}
        </p>
        <div class="flex justify-end mt-4">
          <NuxtLink v-if="point.to" :to="point.to" class="btn btn-sm btn-outline">
            {{ point.toLabel }}
          </NuxtLink>
        </div>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>

<script setup lang="ts">
import type { LngLat } from "maplibre-gl";
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";
import { NHA_TRANG_CITY, MAP_ZOOM } from "@/lib/constants";

const colorMode = useColorMode();
const mapStore = useMapStore();

const mapStyle = computed(() =>
  colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty"
);
const zoom = MAP_ZOOM;

onMounted(() => {
  mapStore.init();
});

function updateAddedPoint(location: LngLat) {
  if (!mapStore.addedPoint) return;

  mapStore.addedPoint.long = location.lng;
  mapStore.addedPoint.lat = location.lat;
}
function onDoubleClick(mglEvent: MglEvent<"dblclick">) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = mglEvent.event.lngLat.lat;
    mapStore.addedPoint.long = mglEvent.event.lngLat.lng;
  }
}
</script>
