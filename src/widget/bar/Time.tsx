import { createPoll } from "ags/time";
import { BarWidget } from "./BarWidget";

interface TimeWidgetOpts {
  format: string;
  bold: boolean;
}

const DEFAULT_OPTIONS: TimeWidgetOpts = {
  format: "%H:%M",
  bold: true,
};

function TimeWidget({ opts }: { opts: Partial<TimeWidgetOpts> }) {
  opts = {...DEFAULT_OPTIONS, ...opts};
  const time = createPoll("", 1000, 'date "+' + opts.format + '"');

  return <BarWidget content={time} classes={opts.bold ? "bold" : ""} />;
}
export default TimeWidget;
