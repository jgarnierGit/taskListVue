<template>
    <v-card-text>
        <div class="text-caption">Tasks quantity to generate at the root</div>
        <v-slider prepend-icon="$mdiFileTreeOutline" :max="10" show-ticks="always" step="1" tick-size="4"
            thumb-label></v-slider>
        <div class="text-caption">Max childs per task</div>
        <v-slider prepend-icon="$mdiArrowExpandHorizontal" :max="10" show-ticks="always" step="1" tick-size="4"
            thumb-label></v-slider>
        <div class="text-caption">Max depth tree</div>
        <v-slider prepend-icon="$mdiArrowExpandVertical" :max="10" show-ticks="always" step="1" tick-size="4"
            thumb-label></v-slider>
        <div class="text-caption">Task name maximum lenght</div>
        <v-slider prepend-icon="$mdiFormTextbox" :max="25" show-ticks="always" step="1" tick-size="4"
            thumb-label></v-slider>
    </v-card-text>
</template>
<script setup lang="ts">
</script>