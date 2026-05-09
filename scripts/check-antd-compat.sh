#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

SEARCH_TOOL=""
if command -v rg >/dev/null 2>&1; then
  SEARCH_TOOL="rg"
elif command -v grep >/dev/null 2>&1; then
  SEARCH_TOOL="grep"
else
  echo "[antd-guard] Neither rg nor grep is available." >&2
  exit 1
fi

# Format: rule_name|||pattern|||suggestion
RULES=(
  'legacy-visible-prop|||visible\s*=|||Use open={...} for popup-like components instead of visible={...}.'
  'select-dropdown-render|||dropdownRender\s*=|||Use popupRender={...} where supported in antd@6, and verify with official docs.'
  'dropdown-overlay-prop|||overlay\s*=|||Use menu={{ items }} or popupRender based on component API; avoid overlay={...}.'
  'global-message-method|||message\.(success|error|info|warning|open)\(|||Prefer const [messageApi, contextHolder] = message.useMessage(); then messageApi.success(...).'
  'global-notification-method|||notification\.(success|error|info|warning|open)\(|||Prefer notification.useNotification() and call api.open/success/etc from the returned api instance.'
  'static-modal-method|||Modal\.(info|success|error|warning|confirm)\(|||Prefer App/useApp context APIs or controlled <Modal open={...}> instead of static Modal.xxx methods.'
  'space-direction-prop|||direction="vertical"|||Use <Flex vertical ...> for vertical stacks in antd@6-oriented code style.'
  'legacy-bordered-prop|||bordered\s*=|||Check the current component API. Some components replaced bordered with variant/borderless style controls.'
  'antd-list-import|||import\s+\{[^}]*\bList\b[^}]*\}\s+from\s+"antd"|||Do not use deprecated List. Prefer Table, Card + Flex, or other maintained antd components.'
  'antd-list-component|||<List\b|||Replace <List> with Table or Card-based compositions per AGENTS.md rules.'
)

HAS_ERROR=0
for rule in "${RULES[@]}"; do
  rule_name="${rule%%|||*}"
  rest="${rule#*|||}"
  pattern="${rest%%|||*}"
  tip="${rest#*|||}"

  if [[ "$SEARCH_TOOL" == "rg" ]]; then
    if rg -n -S "$pattern" src \
      --glob '!**/node_modules/**' \
      --glob '!**/.next/**' \
      --glob '!**/.agents/**' >/tmp/antd-guard-match.txt 2>/dev/null; then
      :
    fi
  else
    if grep -R -n -E "$pattern" src \
      --exclude-dir=node_modules \
      --exclude-dir=.next \
      --exclude-dir=.agents >/tmp/antd-guard-match.txt 2>/dev/null; then
      :
    fi
  fi

  if [[ -s /tmp/antd-guard-match.txt ]]; then
    echo "[antd-guard] Rule hit: $rule_name"
    echo "[antd-guard] Pattern: $pattern"
    echo "[antd-guard] Suggestion: $tip"
    cat /tmp/antd-guard-match.txt
    echo
    HAS_ERROR=1
  fi
done

rm -f /tmp/antd-guard-match.txt

if [[ "$HAS_ERROR" -eq 1 ]]; then
  echo "[antd-guard] Failed. Please migrate the patterns above." >&2
  exit 1
fi

echo "[antd-guard] Passed. No blocked Ant Design patterns found. (tool: $SEARCH_TOOL)"
