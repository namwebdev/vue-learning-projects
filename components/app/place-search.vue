<template>
  <div class="flex flex-col gap-2">
    <Form
      ref="form"
      v-slot="{ errors }"
      class="flex flex-col gap-2 item-centers"
      :validation-schema="toTypedSchema(SearchSchema)"
      :initial-values="{ q: '' }"
      @submit="onSubmit"
    >
      <div class="join mt-4">
        <div>
          <label for="input join-item">
            <Icon name="tabler:search" />
            <Field
              type="text"
              name="q"
              placeholder="Search for a place"
              :disabled="loading"
              :class="{ 'input-error': errors.q }"
            />
          </label>

          <div v-if="errors.q" class="validator-hint text-error">
            {{ errors.q }}
          </div>
        </div>

        <button :disabled="loading" class="btn btn-neutral join-item">
          Search
        </button>
      </div>
    </Form>

    <div v-if="loading" class="flex justify-center">
      <div class="loading loading-lg" />
    </div>
    <div v-if="!loading">
      <div v-if="errorMessage" role="alert" class="alert alert-error">
        {{ errorMessage }}
      </div>

      <div
        v-if="hasSearched && !searchResults.length"
        role="alert"
        class="alert alert-warning"
      >
        No results found.
      </div>
    </div>

    <div class="flex flex-col overflow-auto gap-2 max-h-60 mt-2">
      <div
        v-for="result in searchResults"
        :key="result.place_id"
        class="card card-sm bg-base-100"
      >
        <div class="card-body">
          <h4 class="card-title">
            {{ result.display_name }}
          </h4>

          <div class="justify-end card-actions">
            <button class="btn btn-warning btn-sm" @click="setLocation(result)">
              Set Location
              <Icon name="tabler:map-pin-share" size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import type { NominatimResult } from "~/lib/types";
import { SearchSchema } from "~/lib/zod-schemas";

const emit = defineEmits<{ resultSelected: [result: NominatimResult] }>();

const searchResults = ref<NominatimResult[]>([]);
const form = useTemplateRef("form");
const loading = ref(false);
const hasSearched = ref(false);
const errorMessage = ref("");

async function onSubmit(query: Record<string, string>) {
  loading.value = true;
  hasSearched.value = true;
  errorMessage.value = "";
  searchResults.value = [];
  try {
    const result = await $fetch("/api/search", { query });
    searchResults.value = result as NominatimResult[];
    //scroll to bottom of page by vue function
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  } catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  } finally {
    loading.value = false;
  }
}

function setLocation(result: NominatimResult) {
  emit("resultSelected", result);
  searchResults.value = [];
  hasSearched.value = false;
  errorMessage.value = "";
  if (form.value) {
    form.value.resetForm();
  }
}
</script>

<style scoped></style>
