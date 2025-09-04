import { createState, With } from "gnim";
import { LauncherConfig } from "../config";
import app from "ags/gtk4/app";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import { Process, subprocess } from "ags/process";
import Graphene from "gi://Graphene";


type CommonMenuState = {
  input: string;
  prompt?: string;
};

type MenuState = CommonMenuState & (
  | MainMenuState
  | PromptState
  | ListState
  | ErrorState
);
interface MainMenuState {
  type: "main_menu";
  items: {
    prefix: string;
    description: string;
  }[];
}
interface PromptState {
  type: "prompt";
  prefix: string;
  output?: string;
}
interface ListState {
  type: "list";
  items: ""[];
}
interface ErrorState {
  type: "error";
  message: string;
}

export let launcherWindow: Astal.Window;

export default function Launcher({ config }: { config: LauncherConfig }) {
  const command = `superspace -n ${config.maxResults}`; // make sure to install superspace!

  const [menuState, setMenuState] = createState<MenuState | null>(null);

  const [input, setInput] = createState("");
  let process: Process | null = null;
  function onProcessOut(stdout: string) {
    let data = JSON.parse(stdout);
    setMenuState(data);
    if (data.input != null) setInput(data.input);
  }
  function onProcessErr(stderr: string) {
    console.error(stderr)
  }

  function onKeypress({ }, keyval: number) {
    switch (keyval) {
      case Gdk.KEY_Escape: launcherWindow.hide(); break;
      case Gdk.KEY_BackSpace:
        setInput((i) => i.slice(0, -1));
        process?.write("backspace\n");
        break;
      case Gdk.KEY_Return:
        process?.write("enter\n");
        break;
      default:
        setInput((i) => i + String.fromCharCode(Gdk.keyval_to_unicode(keyval)));
        process?.write(String.fromCharCode(Gdk.keyval_to_unicode(keyval), 10));
        break;
    }
    if (keyval == Gdk.KEY_Escape) {
      launcherWindow.hide();
    }
  }
  function onClick(_e: Gtk.GestureClick, _: number, x: number, y: number) {
    const [, rect] = launcherWindow.compute_bounds(launcherWindow);
    const position = new Graphene.Point({ x, y })

    if (!rect.contains_point(position)) {
      launcherWindow.hide()
      return true
    }
  }

  function renderMainMenu(m: CommonMenuState & MainMenuState) {
    return m.items.map(({prefix, description}) => {
      return <box class="result">
        <label class="prefix" xalign={0} label={prefix}/>
        <label label={description}/>
      </box>
    });
  }
  function renderList(m: CommonMenuState & ListState) {
    return m.items.map(name => {
      return <box class="result">
        <label label={name}/>
      </box>;
    });
  }
  function renderPrompt(m: CommonMenuState & PromptState) {
    if (m.output != null) {
      return <label class="output" label={m.output} xalign={0}/>
    }
  }
  function renderError(m: ErrorState) {
    return <label class="error" wrap={true} label={m.message}/>
  }

  const inputVisible = menuState(m => m?.type != "error");
  return (
    <window
      $={(self) => launcherWindow = self}

      class="Launcher"
      name="launcher"
      namespace="launcher-menu"
      widthRequest={config.width}
      heightRequest={config.height}
      anchor={Astal.WindowAnchor.NONE}
      onShow={() => {
        process?.kill();
        process = subprocess(
          command,
          onProcessOut,
          onProcessErr,
        );
        process.connect("exit", () => {
          process = null; // dont kill it after it already exited.
          launcherWindow.hide();
        });
      }}
      onHide={() => {
        process?.kill();
        setMenuState(null);
        setInput("");
      }}
      keymode={Astal.Keymode.EXCLUSIVE}
      application={app}
    >
      <Gtk.EventControllerKey onKeyPressed={onKeypress} />
      <Gtk.GestureClick onPressed={onClick} />
      <box class="box">
        {config.image && <image file={config.image} />}
        <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
          <box class="input-row" visible={inputVisible}>
            <label
              class="prompt"
              label={menuState(m => m?.prompt ?? "")}
            />
            <label
              class="input"
              hexpand={false}
              label={input}
            />
          </box>
          <Gtk.Separator hexpand={true} visible={inputVisible} />
          <With value={menuState}>
            {(m) => {
              if (m == null) return null;

              let children;
              switch (m.type) {
                case "main_menu":
                  children = renderMainMenu(m);
                  break;
                case "prompt":
                  children = renderPrompt(m);
                  break;
                case "list":
                  children = renderList(m);
                  break;
                case "error":
                  children = renderError(m);
                  break;
              }
              return <box orientation={Gtk.Orientation.VERTICAL}>{children}</box>;
            }}
          </With>
        </box>
      </box>
    </window>
  );
}
