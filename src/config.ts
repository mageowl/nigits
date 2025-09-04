export interface Config {
  iconPath: string;

  theme: {
    background: string;
    foreground: string;

    font: {
      normal: string;
      normalWeight?: string;
      bold: string;
      boldWeight?: string;
      size: string;
    };

    borderRadius: {
      tiny: string;
      small: string;
      large: string;
    };

    outsideGap: string;
    padding: string;
    paddingInner: string;

    bar?: {
      background: string;
      padding: string;
      iconSpacing: string;
      spacing: string;
    };

    notifications?: {
      border: string;

      actionBackground: string;
      primaryActionBackground: string;
    };

    launcher?: {
      border: string;
      padding: string;
      prefixColor: string;
    };
  };

  bar?: BarConfig;
  notifications?: NotificationsConfig;
  launcher?: LauncherConfig;
}

export interface BarConfig {
  valign: VAlign;

  leftWidgets: BarWidget[];
  centerWidgets: BarWidget[];
  rightWidgets: BarWidget[];
}
export interface NotificationsConfig {
  valign: VAlign;
  halign: HAlign;

  spacing: number;
  actionSpacing: number;
}
export interface LauncherConfig {
  placeholder: string;
  image?: string;

  width: number;
  height: number;

  maxResults: number;
}

export type BarWidget = {
  type: string;
} | string;
export type VAlign = "top" | "bottom";
export type HAlign = "left" | "right";

import userConfig from "./userConfig.json" with { type: "json" };
export const config = userConfig as Config;

type CSSConfig = { [name: string]: string | CSSConfig };
function objectToVariables(object: CSSConfig, path: string[] = []): string {
  return Object.entries(object).map(([key, value]) => {
    if (typeof value === "string") {
      return `--cfg-${path.join("")}${key}: ${value};`;
    } else {
      return objectToVariables(value, [...path, key + "-"]);
    }
  }).reduce((a, b) => a + b);
}

export const cssVariables = `\n:root {${objectToVariables(config.theme)}}`;
