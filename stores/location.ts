import type { SelectLocationWithLogs, SelectLocationLog } from "~/lib/db/schema";
import type { MapPoint } from "~/lib/types";
import { LOCATION_PAGES, CURRENT_LOCATION_PAGES, CURRENT_LOCATION_LOG_PAGES } from "~/lib/constants";

export const useLocationStore = defineStore("useLocationStore", () => {
  const route = useRoute();
  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  const {
    data: locations,
    status: locationsStatus,
    refresh: refreshLocations,
  } = useFetch("/api/locations", {
    lazy: true,
  });

  const locationUrlWithSlug = computed(() => `/api/locations/${route.params.slug}`);
  const locationLogUrlWithSlugAndId = computed(() => `/api/locations/${route.params.slug}/${route.params.id}`);

  const {
    data: currentLocation,
    status: currentLocationStatus,
    refresh: refreshCurrentLocation,
    error: currentLocationError,
  } = useFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
    lazy: true,
    immediate: false,
    watch: false,
  });

  const {
    data: currentLocationLog,
    status: currentLocationLogStatus,
    error: currentLocationLogError,
    refresh: refreshCurrentLocationLog,
  } = useFetch<SelectLocationLog>(locationLogUrlWithSlugAndId, {
    lazy: true,
    immediate: false,
    watch: false,
  });

  effect(() => {
    const routeName = route.name?.toString() || "";
    const mapPoints: MapPoint[] = [];
    const sidebarItems: SidebarItem[] = [];

    if (locations.value && LOCATION_PAGES.has(routeName)) {


      locations.value.forEach((location) => {
        const mapPoint = createMapPointFromLocation(location);
        sidebarItems.push({
          id: `location-${location.id}`,
          label: location.name,
          icon: "tabler:map-pin-filled",
          to: {
            name: "dashboard-location-slug",
            params: { slug: location.slug },
          },
          mapPoint,
        });

        mapPoints.push(mapPoint);
      });

      sidebarStore.sidebarItems = sidebarItems;
      mapStore.mapPoints = mapPoints;
    } else if (currentLocation.value && CURRENT_LOCATION_PAGES.has(routeName)) {
      currentLocation.value.locationLogs.forEach((log) => {
        const mapPoint = createMapPointFromLocationLog(log);
        sidebarItems.push({
          id: `location-log-${log.id}`,
          label: log.name,
          icon: "tabler:map-pin-filled",
          to: { name: "dashboard-location-slug-id", params: { id: log.id } },
          mapPoint,
        });
        mapPoints.push(mapPoint);
      });

      sidebarStore.sidebarItems = sidebarItems;
      mapStore.mapPoints = mapPoints.length ? mapPoints : [currentLocation.value]
    }
    else if (currentLocationLog.value && CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() || "")) {
      sidebarStore.sidebarItems = [];
      mapStore.mapPoints = [currentLocationLog.value];
    }

    sidebarStore.loading = locationsStatus.value === "pending";
    if (sidebarStore.loading) mapStore.mapPoints = [];
  });

  return {
    locations,
    locationsStatus,
    refreshLocations,
    currentLocation,
    currentLocationStatus,
    currentLocationError,
    refreshCurrentLocation,
    currentLocationLog,
    currentLocationLogStatus,
    currentLocationLogError,
    refreshCurrentLocationLog,
  };
});
