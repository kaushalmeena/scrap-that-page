import { contextBridge } from "electron";

import { DesktopProxy } from "./proxy/desktop";
import { ScraperProxy } from "./proxy/scraper";

contextBridge.exposeInMainWorld("scraper", ScraperProxy);
contextBridge.exposeInMainWorld("desktop", DesktopProxy);
