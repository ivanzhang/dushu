#!/bin/bash
set -euo pipefail

# 统一的 shell 入口，实际逻辑交给 fetch-chapters.mjs。
# 使用示例：
# ./scripts/fetch-chapters.sh shuihuzhuan 1 3
# ./scripts/fetch-chapters.sh jinpingmei 1 5

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if command -v bun >/dev/null 2>&1; then
  exec bun "$SCRIPT_DIR/fetch-chapters.mjs" "$@"
fi

if command -v node >/dev/null 2>&1; then
  exec node "$SCRIPT_DIR/fetch-chapters.mjs" "$@"
fi

echo '错误：未找到 bun 或 node，无法执行抓取脚本。' >&2
exit 1
