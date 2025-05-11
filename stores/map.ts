import type { LngLatBounds, LngLatLike } from "maplibre-gl";
import type { MapPoint } from "~/lib/types";
import { MAP_ZOOM, NHA_TRANG_CITY } from "@/lib/constants";

const PADDING = 60;

export const useMapStore = defineStore("useMapStore", () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const addedPoint = ref<(MapPoint & { centerMap?: boolean }) | null>(null);

  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const map = useMap();

    let bounds: LngLatBounds | null = null;

    effect(() => {
      const firstPoint = mapPoints.value[0];
      if (!firstPoint) {
        map.map?.flyTo({
          center: NHA_TRANG_CITY as LngLatLike,
          zoom: MAP_ZOOM,
        });
        return
      }

      bounds = mapPoints.value.reduce(
        (bounds, point) => {
          return bounds.extend([point.long, point.lat]);
        },
        new LngLatBounds(
          [firstPoint.long, firstPoint.lat],
          [firstPoint.long, firstPoint.lat]
        )
      );

      map.map?.fitBounds(bounds, {
        padding: PADDING,
        maxZoom: 16,
      });
    });

    watch(
      addedPoint,
      (newVal, oldVal) => {
        if ((newVal && !oldVal) || newVal?.centerMap) {
          map.map?.flyTo({
            center: [newVal.long, newVal.lat],
            zoom: MAP_ZOOM,
            speed: 0.5
          });
        }
      },
      { immediate: true }
    );
  }

  return {
    init,
    mapPoints,
    selectedPoint,
    addedPoint,
  };
});
