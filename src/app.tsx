import { createBinding, For, This } from "ags";
import { Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import style from "./style/style.scss";
import Bar from "./widget/bar/Bar";
import { config, cssVariables } from "./config";
import Notifications from "./widget/Notifications";
import Launcher, { launcherWindow } from "./widget/Launcher";

app.start({
  css: style + cssVariables,
  icons: config.iconPath,

  main() {
    <For each={createBinding(app, "monitors")}>
      {(m: Gdk.Monitor) => <This this={app}>
        {config.bar && <Bar gdkmonitor={m} config={config.bar} />}
        {config.notifications && <Notifications gdkmonitor={m} config={config.notifications} />}
      </This>}
    </For>;

    if (config.launcher != null) {
      <Launcher config={config.launcher}/>;
    }
  },

  requestHandler([command, args]: string[], res) {
      switch (command) {
        case "launcher":
          launcherWindow.show();
          res("ok");
          break;
        default:
          res("unknown command: " + command);
      }
  },
});
