// export { }

import { join, resolve } from "path"
import { readFileSync, writeFileSync } from "fs"
import { run } from './run'

const args = process.argv.slice(2)

const version = args[0]
let happ_dir = resolve(args[1] || '.')
console.log({ version, happ_dir })

run("pwd")

if (!version) {
  console.error("ERROR: Missing holochain version.  Sample usage:")
  console.error("npx harlantwood/happ-upgrade-holochain 0.0.115")
  process.exit(1)
}

// update - hc - sha:

console.log(`⚙️  Updating happ using hdk/holochain version: ${version}`)
console.log("✔  Updating hdk and holo_hash rev in Cargo.toml...")

let cargo_toml = readFileSync(join(happ_dir, 'zomes/example_happ/Cargo.toml'), 'utf8');

cargo_toml = cargo_toml.replace(/^hdk\s*=\s*".+$/m, `hdk = "${version}"`)
cargo_toml = cargo_toml.replace(/^holochain\s*=\s*".+$/m, `holochain = "${version}"`)
cargo_toml = cargo_toml.replace(/^(?<pre>holochain\s*=\s*{.*)version\s*=\s*".+?"/m, `$<pre>version = "${version}"`)

console.log(cargo_toml)

writeFileSync(join(happ_dir, 'zomes/example_happ/Cargo.toml'), cargo_toml)

console.log("✔  Replacing rev...")
// sed - i - e 's/^     rev = .*/     rev = "${HC_REF}";/' default.nix

// console.log("✔  Replacing sha256...")
// sha256 = $(nix - prefetch - url--unpack "https://github.com/holochain/holochain/archive/${HC_REF}.tar.gz")
// sed - i - e 's/^     sha256 = .*/     sha256 = "${sha256}";/' default.nix

// # update - nix - by - failure:

// console.log("➳  Corrupting cargoSha256...")
// sed - i - e 's/^     cargoSha256 = .*/     cargoSha256 = "000000000000000000000000000000000000000000000000000a";/' default.nix

// console.log("➳  Getting cargoSha256... This can take a while...")
// nix - shell &> nix.log || echo "This was ment to fail :)..."

// # update - hc - cargoSha:

// console.log("➳  Waiting for 5s...")
// sleep 5

// console.log("✔  Replacing cargoSha256...")
// $(eval CARGOSHA256 = $(sh - c "grep "got" ./nix.log" | awk '{print $$2}')) \
// sed - i - e 's/^     cargoSha256 = .*/     cargoSha256 = "$(CARGOSHA256)";/' default.nix
