#!/usr/bin/env python3
"""统一的 Python 入口，内部转调 fetch-chapters.mjs。

使用示例：
- python3 scripts/fetch-chapters.py shuihuzhuan 1 3
- python3 scripts/fetch-chapters.py jinpingmei 1 5
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path


def main() -> int:
    script_dir = Path(__file__).resolve().parent
    script_path = script_dir / 'fetch-chapters.mjs'

    runtime = shutil.which('bun') or shutil.which('node')
    if not runtime:
        print('错误：未找到 bun 或 node，无法执行抓取脚本。', file=sys.stderr)
        return 1

    command = [runtime, str(script_path), *sys.argv[1:]]
    completed = subprocess.run(command, check=False)
    return completed.returncode


if __name__ == '__main__':
    raise SystemExit(main())
