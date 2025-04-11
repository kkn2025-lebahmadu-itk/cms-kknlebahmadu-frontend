<script setup>
defineProps({
    data: Object
})
</script>

<template>
    <img :src="data.thumbnail_url" alt="news thumbnail">
    <h2>{{ data.title }}</h2>
</template>