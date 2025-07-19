<template>
  <v-layout class="rounded rounded-md border">
    <SystemBar
      v-if="settings.systemBar.enable"
      :timeString="timeString"
      :settings="settings.systemBar"
    />

    <MenuBar :settings="settings.menu" />

    <FriendList :me="me" :friends="friends" :settings="settings.friendList" />

    <v-main class="d-flex align-center justify-center" height="auto">
      <RouterView :settings="settings" />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import MenuBar from "./components/MenuBar.vue";
import FriendList from "./components/FriendList.vue";
import { LolChatFriend, LolChatMe } from "./lcu/types";
import { onBeforeUnmount, onMounted, ref } from "vue";
import SystemBar from "./components/SystemBar.vue";
import { Settings } from "./settings";

const me = ref({} as LolChatMe);

const fetchMe = async () => {
  try {
    me.value = await window.electronAPI.getChatInfo();
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

const timeString = ref("00:00:00");

const updateTimeString = () => {
  const now = new Date();
  timeString.value = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: settings.value.systemBar.twelveHourClock,
  });
};

let intervalId: NodeJS.Timeout;

onMounted(() => {
  fetchMe();
  fetchFriends();

  intervalId = setInterval(() => {
    updateTimeString();
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});

const settings = ref({
  systemBar: {
    enable: true,
    showTime: true,
    twelveHourClock: false,
  },
  menu: {
    rail: true,
    expandOnHover: false,
  },
  friendList: {
    showOffline: true,
    showProfilePictures: true,
    rail: false,
  },
} as Settings);

const friends = ref([] as LolChatFriend[]);
const fetchFriends = async () => {
  try {
    friends.value = (await window.electronAPI.getFriends()).sort((a, b) => {
      if (a.gameName < b.gameName) return -1;
      if (a.gameName > b.gameName) return 1;
      return 0;
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
  }
};
</script>
