import { Browser, DeviceType, OS } from "@prisma/client";
import { UAParser } from "ua-parser-js";

const getUserAgentData = (userAgent: string | undefined) => {
  const { browser, device, os } = UAParser(userAgent);
  const rawBrowser = browser.name?.toUpperCase() || "OTHER";
  const rawOS = os.name?.toUpperCase() || "OTHER";
  const rawDevice = device.type?.toUpperCase() || "OTHER";

  const browserEnum = Object.values(Browser).includes(rawBrowser as Browser)
    ? (rawBrowser as Browser)
    : Browser.OTHER;
  const osEnum = Object.values(OS).includes(rawOS as OS)
    ? (rawOS as OS)
    : OS.OTHER;
  const deviceEnum = Object.values(DeviceType).includes(rawDevice as DeviceType)
    ? (rawDevice as DeviceType)
    : DeviceType.OTHER;

  return { browserEnum, osEnum, deviceEnum };
};

export default getUserAgentData;
