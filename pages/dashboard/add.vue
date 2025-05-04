<template>
    <div class="container max-w-md mx-auto">
        <div class="my-4">
            <h1 class="text-lg">
                Add Location
            </h1>
            <p class="text-sm">
                A location is a place you have traveled or will travel to. It can be a city, country, state or point of
                interest. You can add specific times you visited this location after adding it.
            </p>
        </div>
        <div v-if="submitError" role="alert" class="alert alert-error">
            <span>{{ submitError }}</span>
        </div>

        <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
            <AppFormField name="name" label="Name" :error="errors.name" :disabled="loading" />
            <AppFormField name="description" label="Description" type="textarea" :error="errors.description"
                :disabled="loading" />
            <AppFormField name="lat" label="Latitude" :error="errors.lat" :disabled="loading" />
            <AppFormField name="long" label="Longitude" :error="errors.long" :disabled="loading" />

            <div class="flex justify-end gap-2">
                <button :disabled="loading" type="button" class="btn btn-outline" @click="router.back()">
                    <Icon name="tabler:arrow-left" size="24" />
                    Cancel
                </button>
                <button :disabled="loading" type="submit" class="btn btn-primary">
                    Add
                    <span v-if="loading" class="loading loading-spinner loading-sm" />
                    <Icon v-else name="tabler:circle-plus-filled" size="24" />
                </button>
            </div>
        </form>

    </div>
</template>

<script setup lang="ts">
import { CreateLocation } from "@/lib/db/schema/location";
import type { FetchError } from "ofetch";

const router = useRouter();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(CreateLocation),
});
const onSubmit = handleSubmit(async (values) => {
    submitError.value = "";
    loading.value = true;
    try {
        await $fetch("/api/locations", {
            method: "post",
            body: values,
        });
        submitted.value = true;
        navigateTo("/dashboard");
    } catch (e) {
        const error = e as FetchError;
        if (error.data?.data) setErrors(error.data?.data);
        const errorMessage = error.data?.statusMessage || error.statusMessage || "An unknown error occurred.";
        submitError.value = errorMessage;
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped></style>