import AstalNotifd from "gi://AstalNotifd";
import { Accessor, createBinding, createState, For, onCleanup, Setter } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import { NotificationsConfig } from "../config";
import app from "ags/gtk4/app";
import { timeout } from "ags/time";

interface NotificationEntry {
  notification: AstalNotifd.Notification;
  closing: Accessor<boolean>;
  setClosing: Setter<boolean>;
}

const notifd = AstalNotifd.get_default();

// class NotificationMap {
//   #notifications: Map<number, NotificationEntry> = new Map(
//     notifd.notifications
//       .map(n => [n.id, NotificationMap.createNotifEntry(n)])
//   );

//   private static createNotifEntry(notification: AstalNotifd.Notification) {
//     const [closing, setClosing] = createState(false);
//     return { notification, closing, setClosing };
//   }

//   constructor() {
//     notifd.connect("notified", (_, id) => {
//       this.#notifications.set(id, NotificationMap.createNotifEntry(notifd.get_notification(id)));
//     });

//     notifd.connect("resolved", (_, id) => {
//       const notif = this.#notifications.get(id);
//       if (notif) {
//         notif.setClosing(true);
//         setTimeout(() => {
//           this.#notifications.delete(id);
//         }, 1000);
//       }
//     });
//   }
// }

// const notifs = new NotificationMap();

function Notification({ value, config }: { value: AstalNotifd.Notification, config: NotificationsConfig }) {
  return <box class="Notification box" spacing={config.spacing}>
    {value.image ?
      <image file={value.image} />
      : value.appIcon && <image icon_name={value.appIcon} />}
    <box orientation={Gtk.Orientation.VERTICAL}>
      <label class="bold" label={createBinding(value, "summary")} xalign={0} />
      <label label={createBinding(value, "body")} xalign={0} />
      <box class="actions" spacing={config.actionSpacing} hexpand={true}>
        <For each={createBinding(value, "actions")}>
          {(action: AstalNotifd.Action, index) => {
            const primary = index(i => i === 0);
            return <button
              class={primary(p => p ? "primary" : "")}
              label={action.label}
              hexpand={primary}
              onClicked={() => {
                value.invoke(action.id);
                value.dismiss();
              }}
            />;
          }}
        </For>
      </box>
    </box>
  </box>;
}

export default function Notifications({ gdkmonitor, config }: { gdkmonitor: Gdk.Monitor, config: NotificationsConfig }) {
  const { BOTTOM, TOP, LEFT, RIGHT } = Astal.WindowAnchor;
  const notifications = createBinding(notifd, "notifications");

  return (
    <window
      $={(self) => onCleanup(() => self.destroy())}

      visible={notifications(l => l.length > 0)}
      name="notifications"
      class="Notifications"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={(config.valign === "top" ? TOP : BOTTOM) | (config.halign === "left" ? LEFT : RIGHT)}
      application={app}
    >
      <box orientation={Gtk.Orientation.VERTICAL} spacing={config.spacing}>
        <For each={notifications}>
          {(notif: AstalNotifd.Notification) => <Notification value={notif} config={config} />}
        </For>
      </box>
    </window>
  );
}
