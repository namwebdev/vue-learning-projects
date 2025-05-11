<template>
  <div class="container max-w-md mx-auto px-5">
    <div class="my-4">
      <h1 class="text-lg">Add Location</h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be a
        city, country, state or point of interest. You can add specific times
        you visited this location after adding it.
      </p>
    </div>

    <LocationForm :initial-values="{
      name: '',
      description: '',
      lat: NHA_TRANG_CITY[1],
      long: NHA_TRANG_CITY[0],
    }" :on-submit="onSubmit" :on-submit-complete="onSubmitComplete" submit-label="Add"
      submit-icon="tabler:circle-plus-filled" />
  </div>
</template>

<script setup lang="ts">
import { type CreateLocationType } from "@/lib/db/schema/location";
import { NHA_TRANG_CITY } from "@/lib/constants";

async function onSubmit(values: CreateLocationType) {
  await $fetch("/api/locations", {
    method: "post",
    body: values,
  });
}
function onSubmitComplete() {
  navigateTo("/dashboard");
}
</script>