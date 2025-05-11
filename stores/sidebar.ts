import type { MapPoint, SidebarBaseItem } from "~/lib/types";

export type SidebarItem = SidebarBaseItem & {
  id: string;
  mapPoint?: MapPoint | null;
};

export const useSidebarStore = defineStore("useSidebarStore", () => {
  const sidebarItems = ref<SidebarItem[]>([]);
  const sidebarTopItems = ref<SidebarItem[]>([]);
  const loading = ref(false);

  return {
    sidebarItems,
    sidebarTopItems,
    loading,
  };
});
