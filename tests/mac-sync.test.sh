#!/bin/bash
# Portable integration checks. All remotes are temporary local bare repositories.
set -eu

test_directory=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
sync_script="$test_directory/../scripts/flick-sync.sh"
test_root=$(mktemp -d "${TMPDIR:-/tmp}/flick sync tests.XXXXXX")
trap 'rm -rf "$test_root"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

# Avoid depending on the machine's Git identity, signing rules, or hooks.
export GIT_CONFIG_GLOBAL=/dev/null
export GIT_CONFIG_SYSTEM=/dev/null
export GIT_TERMINAL_PROMPT=0

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  if [ -f "$test_root/last-sync.log" ]; then
    cat "$test_root/last-sync.log" >&2
  fi
  exit 1
}

assert_equal() {
  [ "$1" = "$2" ] || fail "$3 (expected '$2', got '$1')"
}

identity() {
  git -C "$1" config user.name 'Flick Sync Test'
  git -C "$1" config user.email 'flick-sync-test@example.invalid'
  git -C "$1" config commit.gpgsign false
  git -C "$1" config core.hooksPath "$test_root/no-hooks"
}

fixture() {
  fixture_root="$test_root/$1"
  fixture_remote="$fixture_root/remote.git"
  fixture_publisher="$fixture_root/publisher"
  fixture_checkout="$fixture_root/Flick"
  mkdir -p "$fixture_root" "$test_root/no-hooks"
  git init --bare -q "$fixture_remote"
  git -C "$fixture_remote" symbolic-ref HEAD refs/heads/main
  git init -q "$fixture_publisher"
  git -C "$fixture_publisher" symbolic-ref HEAD refs/heads/main
  identity "$fixture_publisher"
  printf 'Original website\n' > "$fixture_publisher/index.html"
  printf '.DS_Store\n' > "$fixture_publisher/.gitignore"
  git -C "$fixture_publisher" add index.html .gitignore
  git -C "$fixture_publisher" commit -q -m 'Initial website'
  git -C "$fixture_publisher" remote add origin "$fixture_remote"
  git -C "$fixture_publisher" push -q -u origin main
}

run_sync() {
  sync_target=$1
  shift
  FLICK_SYNC_TEST_MODE=1 FLICK_SYNC_TEST_REMOTE="$fixture_remote" \
    /bin/bash "$sync_script" --directory "$sync_target" "$@" \
    > "$test_root/last-sync.log" 2>&1
}

initialize() {
  run_sync "$fixture_checkout" --initialize --pull-only || fail 'Initialize checkout'
  identity "$fixture_checkout"
}

publish_change() {
  printf '%s\n' "$1" > "$fixture_publisher/remote-change.txt"
  git -C "$fixture_publisher" add remote-change.txt
  git -C "$fixture_publisher" commit -q -m "$1"
  git -C "$fixture_publisher" push -q origin main
}

commit_local_change() {
  printf '%s\n' "$1" > "$fixture_checkout/local-change.txt"
  git -C "$fixture_checkout" add local-change.txt
  git -C "$fixture_checkout" commit -q -m "$1"
}

[ -f "$sync_script" ] || fail "Missing sync helper: $sync_script"

fixture 'initialize absent folder'
initialize
assert_equal "$(git -C "$fixture_checkout" rev-parse HEAD)" \
  "$(git -C "$fixture_remote" rev-parse main)" 'Absent folder copied completely'
[ -f "$fixture_checkout/index.html" ] || fail 'Initial website file missing'

fixture 'initialize empty existing folder'
mkdir -p "$fixture_checkout"
initialize
assert_equal "$(git -C "$fixture_checkout" symbolic-ref --short HEAD)" main 'Initial branch'

fixture 'initialize Finder metadata-only folder'
mkdir -p "$fixture_checkout"
printf 'Preserved Finder metadata\n' > "$fixture_checkout/.DS_Store"
initialize
assert_equal "$(cat "$fixture_checkout/.DS_Store")" 'Preserved Finder metadata' 'Finder metadata preserved'
[ -f "$fixture_checkout/index.html" ] || fail 'Website not copied into Finder metadata-only folder'
[ -z "$(git -C "$fixture_checkout" status --porcelain)" ] || fail 'Finder metadata should not dirty checkout'

fixture 'preserve nonempty non-git folder'
mkdir -p "$fixture_checkout"
printf 'Keep this personal file\n' > "$fixture_checkout/personal.txt"
if run_sync "$fixture_checkout" --initialize --pull-only; then
  fail 'Nonempty non-Git folder must be refused'
fi
assert_equal "$(cat "$fixture_checkout/personal.txt")" 'Keep this personal file' 'Personal file preserved'
[ ! -e "$fixture_checkout/.git" ] || fail 'Rejected folder was converted to Git'

fixture 'fast forward clean checkout'
initialize
publish_change 'Website update from GitHub'
run_sync "$fixture_checkout" --pull-only || fail 'Clean fast-forward pull'
assert_equal "$(cat "$fixture_checkout/remote-change.txt")" 'Website update from GitHub' 'Updated file copied'
assert_equal "$(git -C "$fixture_checkout" rev-parse HEAD)" \
  "$(git -C "$fixture_remote" rev-parse main)" 'Clean pull commits match'

fixture 'push local committed change'
initialize
commit_local_change 'Completed local change'
run_sync "$fixture_checkout" --sync || fail 'Push clean local commit'
assert_equal "$(git -C "$fixture_remote" rev-parse main)" \
  "$(git -C "$fixture_checkout" rev-parse HEAD)" 'Local commit pushed to GitHub'

fixture 'preserve dirty tracked file'
initialize
original_head=$(git -C "$fixture_checkout" rev-parse HEAD)
printf 'Unfinished local edit\n' > "$fixture_checkout/index.html"
publish_change 'Incoming remote update'
if run_sync "$fixture_checkout" --pull-only; then
  fail 'Dirty tracked work must block synchronization'
fi
assert_equal "$(cat "$fixture_checkout/index.html")" 'Unfinished local edit' 'Dirty tracked contents preserved'
assert_equal "$(git -C "$fixture_checkout" rev-parse HEAD)" "$original_head" 'Dirty checkout HEAD preserved'

fixture 'preserve untracked file'
initialize
original_head=$(git -C "$fixture_checkout" rev-parse HEAD)
printf 'Not yet committed\n' > "$fixture_checkout/draft.txt"
publish_change 'Remote update with untracked local work'
if run_sync "$fixture_checkout" --sync; then
  fail 'Untracked work must block synchronization'
fi
assert_equal "$(cat "$fixture_checkout/draft.txt")" 'Not yet committed' 'Untracked file preserved'
assert_equal "$(git -C "$fixture_checkout" rev-parse HEAD)" "$original_head" 'Untracked checkout HEAD preserved'

fixture 'reject wrong origin'
initialize
original_head=$(git -C "$fixture_checkout" rev-parse HEAD)
git -C "$fixture_checkout" remote set-url origin "$test_root/unrelated.git"
if run_sync "$fixture_checkout" --sync; then
  fail 'Wrong origin must be refused'
fi
assert_equal "$(git -C "$fixture_checkout" rev-parse HEAD)" "$original_head" 'Wrong-origin checkout preserved'

fixture 'reject different push origin'
initialize
git -C "$fixture_checkout" config remote.origin.pushurl "$test_root/unrelated.git"
if run_sync "$fixture_checkout" --sync; then
  fail 'A different push URL must be refused'
fi

fixture 'reject multiple push origins'
initialize
second_remote="$fixture_root/second-remote.git"
git clone --bare -q "$fixture_remote" "$second_remote"
original_remote_head=$(git -C "$fixture_remote" rev-parse main)
second_remote_head=$(git -C "$second_remote" rev-parse main)
git -C "$fixture_checkout" config --add remote.origin.pushurl "$fixture_remote"
git -C "$fixture_checkout" config --add remote.origin.pushurl "$second_remote"
commit_local_change 'Commit must not go to multiple origins'
if run_sync "$fixture_checkout" --sync; then
  fail 'Multiple push URLs must be refused'
fi
assert_equal "$(git -C "$fixture_remote" rev-parse main)" "$original_remote_head" 'Primary remote preserved'
assert_equal "$(git -C "$second_remote" rev-parse main)" "$second_remote_head" 'Secondary remote preserved'

fixture 'reject nested parent checkout'
initialize
mkdir -p "$fixture_checkout/nested-folder"
if run_sync "$fixture_checkout/nested-folder" --pull-only; then
  fail 'A folder nested in another checkout must be refused'
fi

fixture 'reject wrong branch'
initialize
git -C "$fixture_checkout" checkout -q -b unfinished-feature
if run_sync "$fixture_checkout" --sync; then
  fail 'An unrelated branch must be refused'
fi
assert_equal "$(git -C "$fixture_checkout" symbolic-ref --short HEAD)" unfinished-feature 'Branch preserved'

fixture 'preserve divergent histories'
initialize
commit_local_change 'Local completed work'
original_head=$(git -C "$fixture_checkout" rev-parse HEAD)
publish_change 'Independent completed remote work'
remote_head=$(git -C "$fixture_remote" rev-parse main)
if run_sync "$fixture_checkout" --sync; then
  fail 'Divergent histories must not be rewritten or merged'
fi
assert_equal "$(git -C "$fixture_checkout" rev-parse HEAD)" "$original_head" 'Divergent local history preserved'
assert_equal "$(git -C "$fixture_remote" rev-parse main)" "$remote_head" 'Divergent remote history preserved'
[ -z "$(git -C "$fixture_checkout" status --porcelain)" ] || fail 'Divergence handling changed files'

fixture 'background pull never pushes'
initialize
remote_head=$(git -C "$fixture_remote" rev-parse main)
commit_local_change 'Local commit awaiting explicit push'
local_head=$(git -C "$fixture_checkout" rev-parse HEAD)
run_sync "$fixture_checkout" --pull-only || fail 'Pull-only handles a clean ahead checkout'
assert_equal "$(git -C "$fixture_remote" rev-parse main)" "$remote_head" 'Background mode never pushed'
assert_equal "$(git -C "$fixture_checkout" rev-parse HEAD)" "$local_head" 'Ahead local commit preserved'

fixture 'recover dead process lock'
initialize
lock_directory="$fixture_checkout/.git/flick-sync.lock"
mkdir "$lock_directory"
printf '99999999\n' > "$lock_directory/pid"
publish_change 'Update after a stopped sync'
run_sync "$fixture_checkout" --pull-only || fail 'Dead process lock should recover'
assert_equal "$(git -C "$fixture_checkout" rev-parse HEAD)" \
  "$(git -C "$fixture_remote" rev-parse main)" 'Recovered sync completed'
[ ! -e "$lock_directory" ] || fail 'Recovered lock was not released'

fixture 'preserve live process lock'
initialize
original_head=$(git -C "$fixture_checkout" rev-parse HEAD)
lock_directory="$fixture_checkout/.git/flick-sync.lock"
mkdir "$lock_directory"
printf '%s\n' "$$" > "$lock_directory/pid"
publish_change 'Update while another sync owns lock'
run_sync "$fixture_checkout" --pull-only || fail 'Live lock should skip cleanly'
assert_equal "$(cat "$lock_directory/pid")" "$$" 'Live lock retained'
assert_equal "$(git -C "$fixture_checkout" rev-parse HEAD)" "$original_head" 'Live lock prevented concurrent update'

fixture 'preserve new lock before PID is written'
initialize
original_head=$(git -C "$fixture_checkout" rev-parse HEAD)
lock_directory="$fixture_checkout/.git/flick-sync.lock"
mkdir "$lock_directory"
publish_change 'Update while another sync is starting'
run_sync "$fixture_checkout" --pull-only || fail 'New PID-less lock should skip cleanly'
[ -d "$lock_directory" ] || fail 'New PID-less lock was removed'
[ ! -e "$lock_directory/pid" ] || fail 'New PID-less lock was taken over'
assert_equal "$(git -C "$fixture_checkout" rev-parse HEAD)" "$original_head" 'New lock prevented concurrent update'

printf '%s\n' 'PASS: initialization including Finder metadata, fast-forward pull, committed push, dirty/untracked preservation, origin and branch checks, divergence safety, pull-only isolation, and dead/live/new lock handling'
