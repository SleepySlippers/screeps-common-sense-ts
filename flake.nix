{
  description = "Dev shell with old nixpkgs and rollup";

  inputs = {
    # Pick a channel / revision that still has the rollup you want
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-21.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystemPassThrough (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.${system}.default = (import ./default.nix {
          inherit pkgs;
          system = "${system}";
          nodejs = pkgs.nodejs-12_x;
        }).shell;
      }
    );
}
