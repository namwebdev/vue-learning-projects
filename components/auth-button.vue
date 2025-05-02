<template>
    <div v-if="authStore.user" class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn m-1">
            <div v-if="authStore.user.image" class="avatar">
                <div class="w-8 rounded-full">
                    <img :src="authStore.user.image" :alt="authStore.user.name">
                </div>
            </div>
            {{ authStore.user.name }}
        </div>

        <ul tabindex="0" class="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
                <NuxtLink to="/sign-out">
                    <Icon name="tabler:logout-2" size="24" />
                    Sign Out
                </NuxtLink>
            </li>
        </ul>
    </div>

    <button v-else :disabled="authStore.loading" class="btn btn-accent min-w-[150px]" @click="authStore.signIn">

        <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
        <div v-else class="flex items-center gap-2">
            Sign In With Github
            <Icon name="tabler:brand-github" size="24" />
        </div>
    </button>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
</script>