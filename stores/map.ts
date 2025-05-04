import type { LngLatBounds } from "maplibre-gl";
import type { MapPoint } from "~/lib/types";
import { MAP_ZOOM } from "@/lib/constants";

const PADDING = 60;

export const useMapStore = defineStore("useMapStore", () => {
    const mapPoints = ref<MapPoint[]>([]);
    const selectedPoint = ref<MapPoint | null>(null);
    const shouldFlyTo = ref(true);

    async function init() {
        const { useMap } = await import("@indoorequal/vue-maplibre-gl");
        const { LngLatBounds } = await import("maplibre-gl")

        const map = useMap();

        let bounds: LngLatBounds | null = null;

        effect(() => {
            const firstPoint = mapPoints.value[0];
            if (!firstPoint) return;

            bounds = mapPoints.value.reduce((bounds, point) => {
                return bounds.extend([point.long, point.lat]);
            }, new LngLatBounds(
                [firstPoint.long, firstPoint.lat],
                [firstPoint.long, firstPoint.lat]
            ));

            map.map?.fitBounds(bounds, {
                padding: PADDING,
            });
        })

        effect(() => {
            if (selectedPoint.value) {
                if (shouldFlyTo.value)
                    map.map?.flyTo({
                        center: [selectedPoint.value.long, selectedPoint.value.lat],
                        zoom: MAP_ZOOM,
                    });
                return
            }

            if (bounds) {
                map.map?.fitBounds(bounds, {
                    padding: PADDING,
                });
            }
        })
    }

    function selectPointWithoutFlyTo(point: MapPoint | null) {
        shouldFlyTo.value = false;
        selectedPoint.value = point;
    }

    return {
        init,
        mapPoints,
        selectedPoint,
        selectPointWithoutFlyTo,
    };
});
