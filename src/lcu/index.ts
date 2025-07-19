import { Lockfile } from "./lockfile";
import * as path from "path";
import * as fs from "fs";

export class LCU {
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

  static findLeaguePath(defaultPath?: string): string | null {
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
