<template>
  <p class="pb-5">Welcome to your Vue + Electron + TypeScript application.</p>
  <button class="px-5 bg-blue-300 m-2" @click="fetchChatInfo">
    Get Chat Info
  </button>
  <button class="px-5 bg-blue-300 m-2" @click="fetchLeaguePath">
    Get League Path
  </button>
  <button class="px-5 bg-blue-300 m-2" @click="fetchFriends">
    Get Friends
  </button>

  <ul id="friends-list" class="pt-5">
    <!-- Friends will be populated here -->
    <li
      v-for="friend in friends.filter((f) => f.availability !== 'offline')"
      :key="friend.summonerId"
      :id="`friend-${friend.summonerId}`"
    >
      {{ createFriendString(friend) }}
    </li>
    <li v-if="friends.length === 0">No friends found.</li>
    <li
      v-if="
        friends.length > 0 && friends.every((f) => f.availability === 'offline')
      "
    >
      All friends are currently offline.
    </li>
    <hr />
    <li
      v-for="friend in friends.filter((f) => f.availability === 'offline')"
      :key="friend.summonerId"
    >
      {{ createFriendString(friend) }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { LolChatFriend } from "src/lcu/types";
import { ref } from "vue";

const fetchChatInfo = async () => {
  try {
    const chatInfo = await window.electronAPI.getChatInfo();
    console.log("Chat Info:", chatInfo);
  } catch (error) {
    console.error("Error fetching chat info:", error);
  }
};
const fetchLeaguePath = async () => {
  try {
    const leaguePath = await window.electronAPI.getLeaguePath();
    console.log("League Path:", leaguePath);
  } catch (error) {
    console.error("Error fetching league path:", error);
  }
};

const friends = ref([] as LolChatFriend[]);
const fetchFriends = async () => {
  try {
    const res = await window.electronAPI.getFriends();
    console.log(
      "Friends:",
      res
        .filter((friend) => friend.availability !== "offline")
        .map(({ gameName, lol: { gameQueueType } }) => ({
          gameName,
          gameQueueType,
        }))
    );

    friends.value = res;
  } catch (error) {
    console.error("Error fetching friends:", error);
  }
};

const createFriendString = (friend: LolChatFriend): string => {
  if (!friend) {
    return "Missing friend data";
  }

  const { gameName, summonerId, availability } = friend;
  if (!gameName || !summonerId) {
    return "Incomplete friend data";
  }

  const prefix = gameName.padEnd(32, "_");

  if (availability === "offline") {
    return `${prefix} (Offline)`;
  }

  if (!friend.lol) {
    return `${prefix} (Online)`;
  }

  const { gameQueueType, gameStatus, timeStamp } = friend.lol;
  if (!gameQueueType || !gameStatus || !timeStamp) {
    return "Incomplete game information";
  }

  const lastActivityDate = new Date(parseInt(timeStamp, 10));
  if (isNaN(lastActivityDate.getTime())) {
    return "Invalid timestamp";
  }

  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - lastActivityDate.getTime();
  if (timeDifference < 0) {
    return "Future timestamp detected";
  }

  const date = new Date(timeDifference);
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

  return (
    prefix + `(${gameQueueType} - ${gameStatus} - ${formatter.format(date)})`
  );
};
</script>
