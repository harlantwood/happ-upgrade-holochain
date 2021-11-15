#!/usr/bin/env bash
set -euxo pipefail

which node
node --loader ts-node/esm --experimental-specifier-resolution=node index.ts $*
