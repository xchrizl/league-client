<template>
  <v-navigation-drawer
    location="right"
    :rail="settings.rail"
    :expand-on-hover="settings.rail"
  >
    <v-list>
      <v-list-item
        :prepend-avatar="myProfilePictureUrl"
        :title="props.me?.gameName"
        :subtitle="props.me?.statusMessage"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav>
      <v-list-item
        v-for="friend in friends"
        :key="friend.id"
        :title="friend.gameName"
        @click="handleFriendClick(friend)"
        :prepend-avatar="
          settings.showProfilePictures
            ? getProfilePictureUrl(friend.icon)
            : undefined
        "
        link
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-dialog v-model="dialog" width="auto">
    <v-card
      prepend-icon="mdi-update"
      text="Your application will relaunch automatically after the update is complete."
      title="Update in progress"
    >
      <pre>{{ JSON.stringify(currentFriend, undefined, 2) }}</pre>
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Ok" @click="handleFriendOk"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { LolChatFriend, LolChatMe } from "src/lcu/types";
import { FriendListSettings } from "src/settings";
import { computed, ref } from "vue";

const dialog = ref(false);
const currentFriend = ref<LolChatFriend | null>(null);

const props = defineProps<{
  me: LolChatMe;
  friends: LolChatFriend[];
  settings: FriendListSettings;
}>();

const friends = computed(() => {
  return props.friends.filter((friend) => {
    return props.settings.showOffline || friend.availability !== "offline";
  });
});

const myProfilePictureUrl = computed(() => {
  if (!props.me?.icon) return "";
  const url = getProfilePictureUrl(props.me.icon);
  if (!url) return "";
  return url;
});

const getProfilePictureUrl = (iconId: number) =>
  `https://ddragon.leagueoflegends.com/cdn/15.14.1/img/profileicon/${iconId}.png`;

const handleFriendOk = () => {
  dialog.value = false;
  currentFriend.value = null;
};

const handleFriendClick = (friend: LolChatFriend) => {
  console.log("Friend clicked:", friend);
  dialog.value = true;
  currentFriend.value = friend;
};
</script>
