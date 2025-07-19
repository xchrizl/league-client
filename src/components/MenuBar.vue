<template>
  <v-navigation-drawer
    :rail="props.settings.rail"
    :expand-on-hover="props.settings.expandOnHover"
  >
    <v-list nav>
      <v-list-item
        prepend-icon="mdi-sword-cross"
        title="Play"
        to="/play"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list-item prepend-icon="mdi-home" title="Home" to="/"></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-circle"
        title="Profile"
        to="/profile"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-cards"
        title="Collection"
        to="/collection"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list-item
        prepend-icon="mdi-bag-personal"
        title="Loot"
        to="/loot"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-cart"
        title="Store"
        to="/store"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-cog"
        title="Settings"
        to="/settings"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-bug"
        title="Debug"
        to="/debug"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { MenuBarSettings } from "src/settings";

const props = defineProps<{
  settings: MenuBarSettings;
}>();
</script>
