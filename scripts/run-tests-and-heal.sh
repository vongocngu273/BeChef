#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/.."

echo "Running BeChef Automated QA & Self-Healing Suite..."
node "$DIR/run-tests-and-heal.js"
