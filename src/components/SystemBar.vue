<template>
  <v-system-bar>
    <v-icon icon="mdi-wifi-strength-4"></v-icon>
    <v-icon icon="mdi-signal" class="ms-2"></v-icon>
    <v-icon icon="mdi-battery" class="ms-2"></v-icon>

    <span class="ms-2" v-if="props.settings.showTime">{{
      props.timeString
    }}</span>
  </v-system-bar>
</template>

<script setup lang="ts">
import { SystemBarSettings } from "src/settings";

const props = defineProps<{
  timeString: string;
  settings: SystemBarSettings;
}>();
</script>
