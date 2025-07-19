export interface SystemBarSettings {
  enable: boolean;
  showTime: boolean;
  twelveHourClock: boolean;
}

export interface MenuBarSettings {
  expandOnHover: boolean;
  rail: boolean;
}

export interface FriendListSettings {
  showOffline: boolean;
  showProfilePictures: boolean;
  rail: boolean;
}

export interface Settings {
  systemBar: SystemBarSettings;
  menu: MenuBarSettings;
  friendList: FriendListSettings;
}
