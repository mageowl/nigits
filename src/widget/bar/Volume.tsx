import { BarWidget } from "./BarWidget";
import AstalWp from "gi://AstalWp";
import { createBinding, createComputed, With } from "ags";
import { getThreshold } from "../../util";

interface VolumeWidgetOpts {
  format: string;
  bold: boolean;
}

const DEFAULT_OPTIONS: VolumeWidgetOpts = {
  format: "%H:%M",
  bold: true,
};

const wp = AstalWp.get_default();

function VolumeWidget({ opts }: { opts: Partial<VolumeWidgetOpts> }) {
  opts = {...DEFAULT_OPTIONS, ...opts};
  const speaker = createBinding(wp, "default_speaker");

  return <With value={speaker}>
    {(s) => {
      const volume = createBinding(s, "volume");
      const muted = createBinding(s, "mute");
      return <BarWidget
          content={volume((v) => `${Math.round(v * 100)}%`)}
          classes={opts.bold ? "bold" : ""}
          icon={createComputed([muted, volume], (m, v) => `volume-${m ? "mute" : getThreshold(v, [0, 0.33, 0.5])}-symbolic`)} />;
    }}
  </With>;
}
export default VolumeWidget;
