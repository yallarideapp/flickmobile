#!/bin/bash
# Sync committed Flick changes without discarding local work. Compatible with macOS Bash 3.2.
set -eu

script_directory=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)
sync_directory=${FLICK_SYNC_DIR:-"$script_directory/.."}
sync_mode=sync
initialize=0

usage() {
  printf '%s\n' 'Usage: flick-sync.sh --directory PATH [--initialize] [--sync | --pull-only]'
}

fail() {
  printf 'Flick sync: %s\n' "$*" >&2
  exit 1
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --directory)
      [ "$#" -ge 2 ] || fail '--directory needs a folder path.'
      sync_directory=$2
      shift 2
      ;;
    --initialize) initialize=1; shift ;;
    --pull-only) sync_mode=pull-only; shift ;;
    --sync) sync_mode=sync; shift ;;
    --help|-h) usage; exit 0 ;;
    *) usage >&2; fail 'Unrecognized argument.' ;;
  esac
done

[ -n "$sync_directory" ] || fail 'The target folder is empty.'
case "$sync_directory" in /*) ;; *) fail 'Use an absolute target folder path.' ;; esac
command -v git >/dev/null 2>&1 || fail 'Git is required. Install the Mac command line developer tools first.'

expected_remote=https://github.com/yallarideapp/flickmobile.git
test_mode=0
# Local fixture support is explicit and never changes production repository defaults.
if [ "${FLICK_SYNC_TEST_MODE:-0}" = 1 ]; then
  expected_remote=${FLICK_SYNC_TEST_REMOTE:-}
  case "$expected_remote" in /*) ;; *) fail 'The test remote must be an absolute local repository path.' ;; esac
  [ -d "$expected_remote" ] || fail 'The local test repository is missing.'
  test_mode=1
fi

remote_matches() {
  if [ "$test_mode" -eq 1 ]; then
    [ "$1" = "$expected_remote" ]
    return
  fi
  case "$1" in
    https://github.com/yallarideapp/flickmobile|https://github.com/yallarideapp/flickmobile.git|https://github.com/yallarideapp/flickmobile.git/|git@github.com:yallarideapp/flickmobile|git@github.com:yallarideapp/flickmobile.git|ssh://git@github.com/yallarideapp/flickmobile|ssh://git@github.com/yallarideapp/flickmobile.git) return 0 ;;
    *) return 1 ;;
  esac
}

export GIT_TERMINAL_PROMPT=0
if [ "$initialize" -eq 1 ]; then
  if [ ! -e "$sync_directory" ]; then
    mkdir -p -- "$(dirname -- "$sync_directory")"
    git clone --branch main -- "$expected_remote" "$sync_directory"
  elif [ ! -d "$sync_directory" ]; then
    fail 'The target path is a file, not a folder. Nothing was overwritten.'
  elif [ ! -e "$sync_directory/.git" ]; then
    entries=$(ls -A -- "$sync_directory")
    if [ "$entries" = .DS_Store ] && [ -f "$sync_directory/.DS_Store" ] && [ ! -L "$sync_directory/.DS_Store" ]; then
      finder_backup=$(mktemp "$(dirname -- "$sync_directory")/.flick-finder.XXXXXX")
      restore_finder() {
        if [ -f "$finder_backup" ]; then
          mkdir -p -- "$sync_directory"
          if [ ! -e "$sync_directory/.DS_Store" ]; then
            mv -- "$finder_backup" "$sync_directory/.DS_Store"
          else
            printf 'Flick sync: preserved Finder metadata at %s.\n' "$finder_backup"
          fi
        fi
      }
      trap 'restore_finder' EXIT
      trap 'exit 130' INT
      trap 'exit 143' TERM
      mv -- "$sync_directory/.DS_Store" "$finder_backup"
      git clone --branch main -- "$expected_remote" "$sync_directory"
      restore_finder
      trap - EXIT INT TERM
    else
      [ -z "$entries" ] || fail 'The target folder has existing files and no Git checkout. Nothing was overwritten.'
      git clone --branch main -- "$expected_remote" "$sync_directory"
    fi
  fi
fi

[ -d "$sync_directory" ] || fail 'The Flick folder is missing. Run the Mac setup first.'
sync_directory=$(CDPATH= cd -- "$sync_directory" && pwd -P)
git_root=$(git -C "$sync_directory" rev-parse --show-toplevel 2>/dev/null) || fail 'This folder is not a Git checkout. Nothing was overwritten.'
git_root=$(CDPATH= cd -- "$git_root" && pwd -P)
[ "$git_root" = "$sync_directory" ] || fail 'The selected folder belongs to a parent Git checkout. Select the Flick checkout itself.'

fetch_remote=$(git -C "$sync_directory" remote get-url --all origin 2>/dev/null) || fail 'The Flick checkout has no origin remote.'
push_remote=$(git -C "$sync_directory" remote get-url --push --all origin 2>/dev/null) || fail 'The Flick checkout has no origin push remote.'
remote_matches "$fetch_remote" || fail 'The origin remote is not yallarideapp/flickmobile. Nothing was changed.'
remote_matches "$push_remote" || fail 'The push remote is not yallarideapp/flickmobile. Nothing was changed.'
branch=$(git -C "$sync_directory" symbolic-ref --quiet --short HEAD 2>/dev/null) || fail 'The checkout has no active branch. Switch to main manually.'
[ "$branch" = main ] || fail 'Only the main branch is synchronized. Existing branch and files were preserved.'

git_directory=$(git -C "$sync_directory" rev-parse --absolute-git-dir)
lock_directory=$git_directory/flick-sync.lock
if ! mkdir -- "$lock_directory" 2>/dev/null; then
  owner=$(cat "$lock_directory/pid" 2>/dev/null || true)
  case "$owner" in
    ''|*[!0-9]*) printf '%s\n' 'Flick sync: a sync is starting or its lock needs inspection; skipped.'; exit 0 ;;
  esac
  if kill -0 "$owner" 2>/dev/null || ! mkdir -- "$lock_directory/recover" 2>/dev/null; then
    printf '%s\n' 'Flick sync: another sync is already running; skipped.'
    exit 0
  fi
  # Recovery is claimed inside the old lock. A new empty lock is never treated as stale.
  if [ "$(cat "$lock_directory/pid" 2>/dev/null || true)" != "$owner" ] || kill -0 "$owner" 2>/dev/null; then
    rmdir -- "$lock_directory/recover" 2>/dev/null || true
    exit 0
  fi
  stale_directory=$(mktemp -d "$git_directory/.flick-sync-stale.XXXXXX")
  rmdir -- "$stale_directory"
  mv -- "$lock_directory" "$stale_directory"
  rm -f -- "$stale_directory/pid"
  rmdir -- "$stale_directory/recover" "$stale_directory" 2>/dev/null || true
  if ! mkdir -- "$lock_directory" 2>/dev/null; then
    printf '%s\n' 'Flick sync: another sync acquired the lock; skipped.'
    exit 0
  fi
fi
printf '%s\n' "$$" > "$lock_directory/pid"
release_lock() {
  if [ "$(cat "$lock_directory/pid" 2>/dev/null || true)" = "$$" ]; then
    rm -f -- "$lock_directory/pid"
    rmdir -- "$lock_directory" 2>/dev/null || true
  fi
}
trap 'release_lock' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

require_clean() {
  [ -z "$(git -C "$sync_directory" status --porcelain --untracked-files=normal)" ] || fail 'Local file changes are waiting. They were preserved; commit or move them before syncing.'
}

require_clean
git -C "$sync_directory" fetch origin refs/heads/main:refs/remotes/origin/main
require_clean
counts=$(git -C "$sync_directory" rev-list --left-right --count HEAD...refs/remotes/origin/main)
read -r ahead behind <<EOF
$counts
EOF

if [ "$ahead" -gt 0 ] && [ "$behind" -gt 0 ]; then
  fail 'Local and GitHub histories have diverged. Resolve them manually; no reset, merge commit, or force push was performed.'
fi
if [ "$behind" -gt 0 ]; then
  git -C "$sync_directory" merge --ff-only refs/remotes/origin/main
fi

if [ "$sync_mode" = sync ] && [ "$ahead" -gt 0 ]; then
  require_clean
  git -C "$sync_directory" push origin HEAD:refs/heads/main
  git -C "$sync_directory" fetch origin refs/heads/main:refs/remotes/origin/main
fi

if [ "$sync_mode" = pull-only ] && [ "$ahead" -gt 0 ]; then
  printf '%s\n' 'Flick sync: local commits were preserved and not pushed by the background sync.'
else
  local_commit=$(git -C "$sync_directory" rev-parse HEAD)
  remote_commit=$(git -C "$sync_directory" rev-parse refs/remotes/origin/main)
  [ "$local_commit" = "$remote_commit" ] || fail 'The final GitHub version changed during sync. Try again.'
  printf 'Flick sync: folder and GitHub match at %s.\n' "$local_commit"
fi
