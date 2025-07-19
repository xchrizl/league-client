<template>
  <v-container>
    <v-sheet
      border="dashed md"
      color="surface-light"
      height="auto"
      rounded="lg"
      width="100%"
      class="pa-4"
    >
      <h1 class="text-center">💖 Hello World from SettingsView!</h1>

      <v-divider></v-divider>

      <h2>System Bar</h2>

      <v-switch
        v-model="props.settings.systemBar.enable"
        :label="`Enable system bar: ${props.settings.systemBar.enable.toString()}`"
        hide-details
        inset
      ></v-switch>
      <v-switch
        v-model="props.settings.systemBar.showTime"
        :label="`Show time: ${props.settings.systemBar.showTime.toString()}`"
        hide-details
        inset
      ></v-switch>
      <v-switch
        v-model="props.settings.systemBar.twelveHourClock"
        :label="`12-hour clock: ${props.settings.systemBar.twelveHourClock.toString()}`"
        hide-details
        inset
      ></v-switch>

      <v-divider></v-divider>

      <h2>Menu Bar</h2>

      <v-switch
        v-model="props.settings.menu.rail"
        :label="`Rail: ${props.settings.menu.rail.toString()}`"
        hide-details
        inset
      ></v-switch>
      <v-switch
        v-model="props.settings.menu.expandOnHover"
        :label="`Expand on hover: ${props.settings.menu.expandOnHover.toString()}`"
        hide-details
        inset
      ></v-switch>

      <v-divider></v-divider>

      <h2>Friend List</h2>

      <v-switch
        v-model="props.settings.friendList.showOffline"
        :label="`Show offline friends: ${props.settings.friendList.showOffline.toString()}`"
        hide-details
        inset
      ></v-switch>
      <v-switch
        v-model="props.settings.friendList.showProfilePictures"
        :label="`Show profile pictures: ${props.settings.friendList.showProfilePictures.toString()}`"
        hide-details
        inset
      ></v-switch>
      <v-switch
        v-model="props.settings.friendList.rail"
        :label="`Friend list rail: ${props.settings.friendList.rail.toString()}`"
        hide-details
        inset
      ></v-switch>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { Settings } from "src/settings";

const props = defineProps<{
  settings: Settings;
}>();
</script>
