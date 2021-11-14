// export { }

import { join, resolve } from "path"
import { readFileSync, writeFileSync } from "fs"
import { run } from './run'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log({ __dirname })

const args = process.argv.slice(2)

const version = args[0]
let happ_dir = resolve(args[1] || '.')
console.log({ version, happ_dir })

if (!version) {
  console.error("ERROR: Missing holochain version.  Sample usage:")
  console.error("npx harlantwood/happ-upgrade-holochain 0.0.115")
  process.exit(1)
}

const crateVersion = version
const gitVersion = `holochain-${version}`

// update - hc - sha:

console.log(`⚙️  Updating happ using hdk/holochain version: ${version}`)
console.log("✔  Updating hdk and holo_hash rev in Cargo.toml...")

let cargo_toml = readFileSync(join(happ_dir, 'zomes/example_happ/Cargo.toml'), 'utf8');
cargo_toml = cargo_toml.replace(/^hdk\s*=\s*".+$/m, `hdk = "${crateVersion}"`)
cargo_toml = cargo_toml.replace(/^holochain\s*=\s*".+$/m, `holochain = "${crateVersion}"`)
cargo_toml = cargo_toml.replace(/^(?<pre>holochain\s*=\s*{.*version\s*=\s*)".+?"/m, `$<pre>"${crateVersion}"`)
console.log(cargo_toml)
writeFileSync(join(happ_dir, 'zomes/example_happ/Cargo.toml'), cargo_toml)

console.log("✔  Replacing rev...")
let default_nix = readFileSync(join(happ_dir, 'default.nix'), 'utf8');
default_nix = default_nix.replace(
  /(?<pre>holochainVersion\s*=\s*{\s*rev\s*=\s*)".+?"/m,
  `$<pre>"${gitVersion}"`)
console.log(default_nix)
writeFileSync(join(happ_dir, 'default.nix'), default_nix)

console.log("✔  Replacing sha256...")
const sha256 = run(`nix-prefetch-url --unpack "https://github.com/holochain/holochain/archive/${gitVersion}.tar.gz"`)
console.log({ sha256 })
default_nix = readFileSync(join(happ_dir, 'default.nix'), 'utf8');
default_nix = default_nix.replace(
  /(?<pre>holochainVersion\s*=\s*{[^{]*\n\s*sha256\s*=\s*)".+?"/ms,
  `$<pre>"${sha256}"`)
console.log(default_nix)
writeFileSync(join(happ_dir, 'default.nix'), default_nix)

// update - nix - by - failure:

console.log("➳  Corrupting cargoSha256...")

// sed - i - e 's/^     cargoSha256 = .*/     cargoSha256 = "000000000000000000000000000000000000000000000000000a";/' default.nix
default_nix = readFileSync(join(happ_dir, 'default.nix'), 'utf8');
default_nix = default_nix.replace(
  /(?<pre>holochainVersion\s*=\s*{[^{]*\n\s*cargoSha256\s*=\s*)".+?"/ms,
  `$<pre>"000000000000000000000000000000000000000000000000000a"`)
console.log(default_nix)
writeFileSync(join(happ_dir, 'default.nix'), default_nix)

const nixLogPath = join(__dirname, "nix.log")

console.log("➳  Getting cargoSha256... This may take a looooooong time...")
run(`nix-shell &> ${nixLogPath}`, { relaxed: true, cwd: happ_dir })
// console.log({ nixOutput })

// update - hc - cargoSha:

console.log("✔  Replacing cargoSha256...")
const pattern = /wanted:\s*sha256:000000000000000000000000000000000000000000000000000a\s*got:\s*sha256:(?<cargoSha256>.+?)\b/
let nix_log = readFileSync(nixLogPath, 'utf8');
const match = pattern.exec(nix_log)
console.log({ match })
console.log({ 'match?.groups': match?.groups })
console.log({ 'match?.groups?.cargoSha256': match?.groups?.cargoSha256 })
const cargoSha256 = match?.groups?.cargoSha256

default_nix = readFileSync(join(happ_dir, 'default.nix'), 'utf8');
default_nix = default_nix.replace(
  /(?<pre>holochainVersion\s*=\s*{[^{]*\n\s*cargoSha256\s*=\s*)".+?"/ms,
  `$<pre>"${cargoSha256}"`)
console.log(default_nix)
writeFileSync(join(happ_dir, 'default.nix'), default_nix)
