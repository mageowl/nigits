{
  description = "nix-powered widgets system.";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

    superspace.url = "github:mageowl/superspace";

    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.astal.follows = "astal";
    };
  };
  outputs = {
    self,
    nixpkgs,
    superspace,
    astal,
    ags,
  }: let
    supportedSystems = ["x86_64-linux"];
    forAllSystems = cb:
      nixpkgs.lib.genAttrs supportedSystems (
        system: let
          inputs = {
            superspace = superspace.packages.${system}.default;
            ags = ags.packages.${system}.default;
            agsFull = ags.packages.${system}.agsFull;
            astal = astal.packages.${system};
          };
          result = cb {
            pkgs = pkgsFor.${system};
            inherit inputs;
          };
        in
          if builtins.isFunction result
          then result system
          else result
      );
    pkgsFor = nixpkgs.legacyPackages;
  in {
    packages = forAllSystems ({
      pkgs,
      inputs,
    }: {
      default = pkgs.callPackage ./nix {inherit inputs;};
    });

    devShells = forAllSystems ({
      pkgs,
      inputs,
    }: {
      default = pkgs.mkShell {
        name = "nigits-shell";
        buildInputs = [inputs.agsFull inputs.superspace];
      };
    });
  };
}
