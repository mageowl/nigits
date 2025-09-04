{
  pkgs,
  inputs,
}:
pkgs.stdenv.mkDerivation {
  pname = "nigits";
  version = "1.0";

  src = ../src;

  nativeBuildInputs = with pkgs; [
    wrapGAppsHook
    gobject-introspection
    inputs.ags
  ];

  buildInputs = with pkgs; [
    glib
    gjs

    inputs.astal.io
    inputs.astal.astal4
    inputs.astal.battery
    inputs.astal.notifd
    inputs.astal.mpris
    inputs.astal.wireplumber
  ];

  installPhase = ''
    mkdir -p $out/bin
    ags bundle app.tsx $out/bin/nigits
  '';

  preFixup = ''
    gappsWrapperArgs+=(
      --prefix PATH : ${pkgs.lib.makeBinPath [
      "${inputs.superspace}/bin"
    ]}
    )
  '';
}
