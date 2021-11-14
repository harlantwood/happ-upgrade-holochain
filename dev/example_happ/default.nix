{
  # d326ee858e051a2525a1ddb0452cab3085c4aa98 = latest develop as of 10 Nov 2021
  holonixPath ?  builtins.fetchTarball { url = "https://github.com/holochain/holonix/archive/d326ee858e051a2525a1ddb0452cab3085c4aa98.tar.gz"; }
}:

let
  holonix = import (holonixPath) {
    include = {
        # making this explicit even though it's the default
        holochainBinaries = true;
    };

    rustVersion = {
      track = "stable";
      version = "1.55.0";
    };

    holochainVersionId = "custom";

    holochainVersion = {
      rev = "holochain-0.0.114";
      sha256 = "1r3fxmcnc6576cbq12vyzyjgdjf6754mfsivzplzmj47bwvx3hx1";
      cargoSha256 = "15d8h3ivr8xdrccxgmpwn5sv4givhvfvvhihdhdgyv1893gpmzl3";
      bins = {
        holochain = "holochain";
        hc = "hc";
        kitsune-p2p-proxy = "kitsune_p2p/proxy";
      };

      lairKeystoreHashes = {
        sha256 = "1zq8mpxcy8p7kbj4xl4qhp2hb0fjxakixhzcb4y1rnygc90q9v01";
        cargoSha256 = "1ln0vx1blzjr4p9rqfhcl4b34blk6jiyziz2w5gh09wv2xbhyaa5";
      };
    };
  };
  nixpkgs = holonix.pkgs;
in nixpkgs.mkShell {
  inputsFrom = [ holonix.main ];
  buildInputs = with nixpkgs; [
    binaryen
    nodejs-16_x
    cargo-watch
  ];
}
