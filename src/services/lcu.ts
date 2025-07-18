import * as fs from "fs";
import * as path from "path";

export function findLeaguePath(defaultPath?: string): string | null {
  let leaguePath = null;

  const paths = [
    path.join("C:", "Riot Games", "League of Legends"),
    path.join("C:", "Program Files", "Riot Games", "League of Legends"),
    path.join("C:", "Program Files (x86)", "Riot Games", "League of Legends"),
  ];

  for (const p of paths) {
    if (fs.existsSync(path.join(p, "LeagueClient.exe"))) {
      leaguePath = p;
      break;
    }
  }

  if (
    defaultPath &&
    !leaguePath &&
    fs.existsSync(path.join(defaultPath, "LeagueClient.exe"))
  ) {
    leaguePath = defaultPath;
  }

  return leaguePath;
}

export class Lockfile {
  processName: string;
  processId: number;
  port: number;
  password: string;
  protocol: string;

  constructor(
    processName: string,
    processId: number,
    port: number,
    password: string,
    protocol: string
  ) {
    this.processName = processName;
    this.processId = processId;
    this.port = port;
    this.password = password;
    this.protocol = protocol;
  }

  getURL(): string {
    return `${this.protocol}://127.0.0.1:${this.port}`;
  }

  getAuthHeader(): string {
    return `Basic ${Buffer.from(`riot:${this.password}`).toString("base64")}`;
  }

  static fromText(text: string): Lockfile | null {
    const parts = text.split(":");
    if (parts.length !== 5) {
      console.warn("Invalid lockfile format.");
      return null;
    }

    const [processName, processId, port, password, protocol] = parts;
    return new Lockfile(
      processName,
      parseInt(processId, 10),
      parseInt(port, 10),
      password,
      protocol
    );
  }

  static fromFile(filePath: string): Lockfile | null {
    if (!fs.existsSync(filePath)) {
      console.warn(`Lockfile not found at ${filePath}`);
      return null;
    }

    const content = fs.readFileSync(filePath, "utf-8").trim();
    return Lockfile.fromText(content);
  }
}

export class LCUService {
  private lockfilePath: string;
  private lockfileCache: { timestamp: number; lockfile: Lockfile } | null;

  constructor(lockfilePath: string) {
    this.lockfilePath = lockfilePath;
    this.lockfileCache = null;
  }

  getLockfile(): Lockfile {
    const currentTime = Date.now();
    if (
      this.lockfileCache &&
      currentTime - this.lockfileCache.timestamp < 10000 // Cache for 10 seconds
    ) {
      return this.lockfileCache.lockfile;
    }

    const lockfile = Lockfile.fromFile(this.lockfilePath);
    if (!lockfile) {
      throw new Error("Failed to read lockfile.");
    }

    this.lockfileCache = {
      timestamp: currentTime,
      lockfile: lockfile,
    };
    return lockfile;
  }

  private url(path: string): string {
    return `${this.getLockfile().getURL()}${path}`;
  }

  async get<T>(path: string): Promise<T> {
    const url = this.url(path);
    console.log(`Fetching from LCU: ${url}`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: this.getLockfile().getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
    }

    return response.json();
  }
}

export interface LolChatMe {
  availability: string;
  gameName: string;
  gameTag: string;
  icon: number;
  id: string;
  lastSeenOnlineTimestamp: number | null;
  lol: {
    championId: string;
    companionId: string;
    damageSkinId: string;
    gameQueueType: string;
    gameStatus: string;
    iconOverride: string;
    legendaryMasteryScore: string;
    level: string;
    mapId: string;
    mapSkinId: string;
    puuid: string;
    rankedLeagueDivision: string;
    rankedLeagueQueue: string;
    rankedLeagueTier: string;
    rankedLosses: string;
    rankedPrevSeasonDivision: string;
    rankedPrevSeasonTier: string;
    rankedSplitRewardLevel: string;
    rankedWins: string;
    regalia: string; // JSON string
    skinVariant: string;
    skinname: string;
  };
  name: string;
  obfuscatedSummonerId: number;
  patchline: string;
  pid: string;
  platformId: string;
  product: string;
  productName: string;
  puuid: string;
  statusMessage: string;
  summary: string;
  summonerId: number;
  time: number;
}

export interface LolChatFriend {
  summonerId: number;
  id: string;
  name: string;
  pid: string;
  puuid: string;
  gameName: string;
  gameTag: string;
  icon: number;
  availability: string;
  platformId: string;
  patchline: string;
  product: string;
  productName: string;
  summary: string;
  time: number;
  statusMessage: string;
  note: string;
  lastSeenOnlineTimestamp: string;
  isP2PConversationMuted: boolean;
  groupId: number;
  displayGroupId: number;
  groupName: string;
  displayGroupName: string;
  lol: {
    bannerIdSelected: string;
    challengeCrystalLevel: string;
    challengePoints: string;
    challengeTokensSelected: string;
    championId: string;
    companionId: string;
    damageSkinId: string;
    gameId: string;
    gameMode: string;
    gameQueueType: string;
    gameStatus: string;
    iconOverride: string;
    isObservable: string;
    legendaryMasteryScore: string;
    level: string;
    mapId: string;
    mapSkinId: string;
    playerTitleSelected: string;
    profileIcon: string;
    pty: string;
    puuid: string;
    queueId: string;
    rankedLeagueDivision: string;
    rankedLeagueQueue: string;
    rankedLeagueTier: string;
    rankedLosses: string;
    rankedPrevSeasonDivision: string;
    rankedPrevSeasonTier: string;
    rankedSplitRewardLevel: string;
    rankedWins: string;
    regalia: string;
    skinVariant: string;
    skinname: string;
    timeStamp: string;
  };
}
