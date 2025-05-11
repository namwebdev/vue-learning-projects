<template>
    <div v-if="submitError" role="alert" class="alert alert-error">
        <span>{{ submitError }}</span>
    </div>

    <form class="flex flex-col gap-2" @submit.prevent="onSubmit" v-bind="$attrs">
        <slot :errors :loading />

        <p class="text-xs text-gray-400">
            Current coordinates: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
        </p>

        <p>
            To set the coordinates:
        </p>
        <ul class="list-disc ml-4 text-sm">
            <li>
                Drag the
                <Icon name="tabler:map-pin-filled" class="text-primary dark:text-warning" /> marker on the map.
            </li>
            <li>
                Double click the map.
            </li>
            <li>
                Search for a location below.
            </li>
        </ul>

        <div class="flex justify-end gap-2">
            <button :disabled="loading" type="button" class="btn btn-outline" @click="router.back()">
                <Icon name="tabler:arrow-left" size="24" />
                Cancel
            </button>
            <button :disabled="loading" type="submit" class="btn btn-primary">
                {{ props.submitLabel }}
                <span v-if="loading" class="loading loading-spinner loading-sm" />
                <Icon v-else :name="props.submitIcon" size="24" />
            </button>
        </div>
    </form>

    <div class="divider" />
    <AppPlaceSearch @result-selected="searchResultSelected" />
</template>

<script setup lang="ts" generic="T extends LatLongItem">
import type { ZodSchema } from 'zod';
import type { LatLongItem, NominatimResult } from '~/lib/types';
import { FetchError } from 'ofetch';
import { NHA_TRANG_CITY } from '~/lib/constants';

defineOptions({ inheritAttrs: false })
const props = defineProps<{
    initialValues: T;
    schema: ZodSchema;
    onSubmit: (location: T) => Promise<any>;
    onSubmitComplete: () => void;
    submitLabel: string;
    submitIcon: string;
    zoom: number;
}>();

const router = useRouter();
const mapStore = useMapStore();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const { handleSubmit, errors, setErrors, setFieldValue, meta, controlledValues } = useForm({
    initialValues: props.initialValues,
    validationSchema: toTypedSchema(props.schema)
})

effect(() => {
    if (mapStore.addedPoint) {
        setFieldValue("long", mapStore.addedPoint.long);
        setFieldValue("lat", mapStore.addedPoint.lat);
    }
});

onMounted(() => {
    mapStore.addedPoint = {
        id: 1,
        name: "Added Point",
        description: "",
        long: props.initialValues?.long || (NHA_TRANG_CITY as [number, number])[0],
        lat: props.initialValues?.lat || (NHA_TRANG_CITY as [number, number])[1],
        centerMap: true,
    };
});

onBeforeRouteLeave(() => {
    if (!submitted.value && meta.value.dirty) {
        // eslint-disable-next-line no-alert
        const confirm = window.confirm("Are you sure you want to leave? All unsaved changes will be lost.");
        if (!confirm) return false;
    }
    mapStore.addedPoint = null;
    return true;
});

const onSubmit = handleSubmit(async (values: T) => {
    submitError.value = "";
    loading.value = true;
    try {
        console.log("🚀 ~ onSubmit ~ handleSubmit:")

        await props.onSubmit(values);
        submitted.value = true;
        props.onSubmitComplete();
    }
    catch (e) {
        const err = e as FetchError;
        console.error("🚀 ~ onSubmit ~ err:", err)
        if (err.data?.error) setErrors(err.data.error);
        submitError.value = getFetchErrorMessage(err);
    }
    finally {
        loading.value = false;
    }
})
function formatNumber(value?: number) {
    if (!value) return 0;
    return value.toFixed(5);
}
function searchResultSelected(result: NominatimResult) {
    setFieldValue("name", result.display_name);
    mapStore.addedPoint = {
        id: 1,
        name: "Added Point",
        description: "",
        long: Number(result.lon),
        lat: Number(result.lat),
        centerMap: true,
    };
}
</script>
