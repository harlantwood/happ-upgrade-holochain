#!/usr/bin/env bash
set -euxo pipefail

current_dir=${BASH_SOURCE[0]}
which node
node --loader ${current_dir}/node_modules/ts-node/esm --experimental-specifier-resolution=node index.ts $*
