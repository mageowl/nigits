import { BarWidget } from "./BarWidget";
import { createBinding, createComputed } from "ags";
import { getThreshold } from "../../util";
import AstalBattery from "gi://AstalBattery";

interface VolumeWidgetOpts {
  format: string;
  bold: boolean;
}

const DEFAULT_OPTIONS: VolumeWidgetOpts = {
  format: "%H:%M",
  bold: true,
};

const bat = AstalBattery.get_default();

function BatteryWidget({ opts }: { opts: Partial<VolumeWidgetOpts> }) {
  opts = {...DEFAULT_OPTIONS, ...opts};

  const energy = createBinding(bat, "percentage");
  const charging = createBinding(bat, "charging");
  return <BarWidget
      content={energy((v) => `${Math.round(v * 100)}%`)}
      classes={opts.bold ? "bold" : ""}
      icon={createComputed([charging, energy], (m, v) => `battery-${m ? "charging" : getThreshold(v, [0, 0.10, 0.5, 0.75])}-symbolic`)} />;
}
export default BatteryWidget;
