import * as fs from "fs";
import * as path from "path";

export function getLeaguePath(defaultPath?: string): string | null {
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
    fs.existsSync(path.join(defaultPath, "LeagueClient.exe"))
  ) {
    leaguePath = defaultPath;
  }

  console.warn("League of Legends installation path not found.");
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
  private lockfile: Lockfile;

  constructor(lockfile: Lockfile) {
    this.lockfile = lockfile;
  }

  getLockfile(): Lockfile {
    return this.lockfile;
  }

  private url(path: string): string {
    return `${this.lockfile.getURL()}${path}`;
  }

  async get(path: string): Promise<any> {
    const response = await fetch(this.url(path), {
      method: "GET",
      headers: {
        Authorization: this.lockfile.getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
    }

    return response.json();
  }
}
