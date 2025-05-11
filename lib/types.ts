import type { RouteLocationRaw } from "vue-router";

export type LatLongItem = {
  lat: number;
  long: number;
};

export type SidebarBaseItem = {
  label: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
};

export type MapPoint = {
  id: number;
  name: string;
  description: string | null;
  to?: RouteLocationRaw;
  toLabel?: string;
} & LatLongItem;

export type NominatimResult = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
};
