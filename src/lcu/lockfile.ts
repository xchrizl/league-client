import * as fs from "fs";

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
