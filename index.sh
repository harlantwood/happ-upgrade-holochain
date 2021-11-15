#!/usr/bin/env bash
set -euxo pipefail

package_dir=${BASH_SOURCE[0]}/../..
which node
node --loader ${package_dir}/node_modules/ts-node/esm --experimental-specifier-resolution=node index.ts $*
