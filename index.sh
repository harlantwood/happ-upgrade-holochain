#!/usr/bin/env bash
set -euxo pipefail

package_dir=${BASH_SOURCE[0]}/../..
which node
node --loader ${package_dir}/ts-node/esm --experimental-specifier-resolution=node index.ts $*
