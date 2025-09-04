import app from "ags/gtk4/app"
import { Astal, Gdk } from "ags/gtk4"
import TimeWidget from "./Time";
import GObject from "gi://GObject";
import { BarConfig, BarWidget } from "../../config";
import VolumeWidget from "./Volume";
import MusicWidget from "./Music";
import BatteryWidget from "./Battery";
import { onCleanup } from "gnim";

const barWidgets: { [id: string]: ({ opts: { } }) => GObject.Object } = {
  time: TimeWidget,
  volume: VolumeWidget,
  music: MusicWidget,
  battery: BatteryWidget,
};

const WidgetError = () => <box class="box error">error!</box>;
function BarWidgets({ align, widgets }: { align: "start" | "center" | "end", widgets: BarWidget[] }) {
  return <box $type={align}>
    {widgets.map(w => {
      if (typeof (w) === "string") {
        return barWidgets[w]?.({ opts: {} }) ?? WidgetError();
      } else {
        return barWidgets[w.type]?.({ opts: w }) ?? WidgetError();
      }
    })}
  </box>;
}

export default function Bar({ gdkmonitor, config }: { gdkmonitor: Gdk.Monitor, config: BarConfig }) {
  const { BOTTOM, TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      $={(self) => onCleanup(() => self.destroy())}
      
      visible
      name="bar"
      class={"Bar " + config.valign}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={(config.valign === "top" ? TOP : BOTTOM) | LEFT | RIGHT}
      application={app}
    >
      <centerbox class="box">
        <BarWidgets align="start" widgets={config.leftWidgets} />
        <BarWidgets align="center" widgets={config.centerWidgets} />
        <BarWidgets align="end" widgets={config.rightWidgets} />
      </centerbox>
    </window>
  )
}
