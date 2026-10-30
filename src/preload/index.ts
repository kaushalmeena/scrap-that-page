import { contextBridge } from "electron";
import { AppProxy } from "./proxy/app";
import { ScraperProxy } from "./proxy/scraper";

contextBridge.exposeInMainWorld("scraper", ScraperProxy);
contextBridge.exposeInMainWorld("app", AppProxy);
