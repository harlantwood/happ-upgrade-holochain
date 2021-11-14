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

    holochainVersionId = "custom";

    holochainVersion = {
      rev = "holochain-0.0.115";
      sha256 = "163fvii27wqpni7f5f0m0nxivjjdgsycb2pnd1jcadx9i9d70ziv";
      cargoSha256 = "1nmyk14d1v8y3wipjlff7bn38ay7zkp5fkzr7qbgm28kbai4ji3v";
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
  ];
}
