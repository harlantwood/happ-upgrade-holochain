#!/usr/bin/env ts-node

export { }

import { run } from './run'

console.log("works from ts")

run("pwd")

// # if [-z ${ HC_REF }]; then
// #   echo "Error: no holochain rev provided: please pass in HC_REF env var (tag or commit on holochain repo)"
// #     exit 1
// # fi

// # # update - hc - sha:
// # echo "⚙️  Updating elemental-chat using holochain rev: ${HC_REF}"
// # echo "✔  Updating hdk and holo_hash rev in Cargo.toml..."
// # sed - i - e 's/^hdk = .*/hdk = {git ="https:\/\/github.com\/holochain\/holochain", rev = "${HC_REF}", package = "hdk"}/' Cargo.toml
// # sed - i - e 's/^holo_hash = .*/holo_hash = {git ="https:\/\/github.com\/holochain\/holochain", rev = "${HC_REF}", package = "holo_hash"}/' Cargo.toml
// # echo "✔  Replacing rev..."
// # sed - i - e 's/^     rev = .*/     rev = "${HC_REF}";/' default.nix
// # echo "✔  Replacing sha256..."
// # sha256 = $(nix - prefetch - url--unpack "https://github.com/holochain/holochain/archive/${HC_REF}.tar.gz")
// # sed - i - e 's/^     sha256 = .*/     sha256 = "${sha256}";/' default.nix

// # # update - nix - by - failure:
// # echo "➳  Corrupting cargoSha256..."
// # sed - i - e 's/^     cargoSha256 = .*/     cargoSha256 = "000000000000000000000000000000000000000000000000000a";/' default.nix
// # echo "➳  Getting cargoSha256... This can take a while..."
// # nix - shell &> nix.log || echo "This was ment to fail :)..."

// # # update - hc - cargoSha:
// # echo "➳  Waiting for 5s..."$ *
// # sleep 5
// # echo "✔  Replacing cargoSha256..."
// # $(eval CARGOSHA256 = $(sh - c "grep "got" ./nix.log" | awk '{print $$2}')) \
// # sed - i - e 's/^     cargoSha256 = .*/     cargoSha256 = "$(CARGOSHA256)";/' default.nix
