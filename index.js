#!/usr/bin/env node

import { join, resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import glob from 'glob'

import { run } from './run.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// console.log({ __dirname })

main()

function main() {
  const args = process.argv.slice(2)

  const version = args[0]
  let happDir = resolve(args[1] || '.')
  // console.log({ version, happDir })

  if (!version) {
    console.error('ERROR: Missing holochain version.  Sample usage:')
    console.error('npx harlantwood/happ-upgrade-holochain 0.0.115')
    process.exit(1)
  }

  const crateVersion = version
  const gitVersion = `holochain-${version}`

  // update - hc - sha:

  console.log(`⚙️  Updating happ using hdk/holochain version: ${version}`)
  console.log('✔  Updating hdk and holo_hash rev in Cargo.toml...')

  const cargoTomlPaths = glob.sync(join(happDir, '**', 'Cargo.toml'))
  for (const cargoTomlPath of cargoTomlPaths) {
    replace(cargoTomlPath, /^hdk\s*=\s*".+$/m, `hdk = "${crateVersion}"`)
    replace(cargoTomlPath, /^holochain\s*=\s*".+$/m, `holochain = "${crateVersion}"`)
    replace(
      cargoTomlPath,
      /^(?<pre>hdk\s*=\s*{.*version\s*=\s*)".+?"/m,
      `$<pre>"${crateVersion}"`
    )
    replace(
      cargoTomlPath,
      /^(?<pre>holochain\s*=\s*{.*version\s*=\s*)".+?"/m,
      `$<pre>"${crateVersion}"`
    )
  }

  console.log('✔  Replacing HC version in default.nix...')
  const defaultNixPath = join(happDir, 'default.nix')
  replace(
    defaultNixPath,
    /(?<pre>holochainVersion\s*=\s*{\s*rev\s*=\s*)".+?"/m,
    `$<pre>"${gitVersion}"`
  )

  console.log('✔  Replacing sha256...')
  const sha256 = run(
    `nix-prefetch-url --unpack "https://github.com/holochain/holochain/archive/${gitVersion}.tar.gz"`
  )
  console.log({ sha256 })
  replace(
    defaultNixPath,
    /(?<pre>holochainVersion\s*=\s*{[^{]*\n\s*sha256\s*=\s*)".+?"/ms,
    `$<pre>"${sha256}"`
  )

  // update - nix - by - failure:

  console.log('➳  Corrupting cargoSha256...')

  replace(
    defaultNixPath,
    /(?<pre>holochainVersion\s*=\s*{[^{]*\n\s*cargoSha256\s*=\s*)".+?"/ms,
    `$<pre>"000000000000000000000000000000000000000000000000000a"`
  )

  const nixLogPath = join(__dirname, 'nix.log') // TODO this should be a tempdir, in case there are multiple runs simultaneously

  console.log('➳  Getting cargoSha256... This may take a looooooong time...')
  run(`nix-shell &> ${nixLogPath}`, { relaxed: true, cwd: happDir })

  // update - hc - cargoSha:

  console.log('✔  Replacing cargoSha256...')
  const pattern =
    /wanted:\s*sha256:000000000000000000000000000000000000000000000000000a\s*got:\s*sha256:(?<cargoSha256>.+?)\b/
  let nixLog = readFileSync(nixLogPath, 'utf8')
  const match = pattern.exec(nixLog)
  // console.log({ match })
  // console.log({ 'match?.groups': match?.groups })
  // console.log({ 'match?.groups?.cargoSha256': match?.groups?.cargoSha256 })
  const cargoSha256 = match && match.groups && match.groups.cargoSha256

  if (cargoSha256) {
    replace(
      defaultNixPath,
      /(?<pre>holochainVersion\s*=\s*{[^{]*\n\s*cargoSha256\s*=\s*)".+?"/ms,
      `$<pre>"${cargoSha256}"`
    )
  }
}

function replace(path, target, replacement) {
  const fileText = readFileSync(path, 'utf8')
  const newFileText = fileText.replace(target, replacement)
  // console.log(path)
  // console.log(newFileText)
  writeFileSync(path, newFileText)
}
