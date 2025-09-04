import AstalMpris from "gi://AstalMpris";
import { BarWidget } from "./BarWidget";
import { createBinding, With } from "ags";

interface MusicWidgetOpts {
  bold: boolean;
}

const mpris = AstalMpris.get_default();

function MusicWidget({ opts }: { opts: Partial<MusicWidgetOpts> }) {
  const players = createBinding(mpris, "players");
  return <box class={players((l) => l.length !== 0 ? "" : "empty")}>
    <With value={players}>
      {(players: AstalMpris.Player[]) => {
        const player = players[0];
        if (player == null) return;
        const playbackStatus = createBinding(player, "playback_status");
        return <BarWidget
            icon={playbackStatus((status) => status === AstalMpris.PlaybackStatus.PLAYING ? "music" : "music-paused")}
            content={createBinding(player, "title")}
            classes={playbackStatus((status) => status !== AstalMpris.PlaybackStatus.PLAYING ? "Music paused" : "Music")}
        />;
      }}
    </With>
  </box>;
}
export default MusicWidget;
