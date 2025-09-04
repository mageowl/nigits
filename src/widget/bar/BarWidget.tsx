import { Accessor } from "ags";
import { transform } from "../../util";

export function BarWidget({ icon, content, classes }: {icon?: Accessor<string> | string, classes?: Accessor<string> | string, content: Accessor<string> | string}) {
  return (<box class={transform(classes, (classes) => "BarWidget box" + (classes ? " " + classes : ""))}>
    {icon && <image iconName={icon}></image>}
    <label label={content}/>
  </box>);
}
