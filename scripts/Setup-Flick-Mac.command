#!/bin/bash
# Run once on the Mac to populate Flick and install safe GitHub-to-folder updates.
set -eu

label=com.flickmobile.github-sync
sync_directory=${FLICK_SYNC_DIR:-"$HOME/Documents/Flick"}
repository=https://github.com/yallarideapp/flickmobile.git
support_directory=$HOME/Library/Application\ Support/FlickSync
agents_directory=$HOME/Library/LaunchAgents
logs_directory=$HOME/Library/Logs
plist=$agents_directory/$label.plist

fail() {
  printf '\nFlick setup: %s\n' "$*" >&2
  exit 1
}

[ "$(uname -s)" = Darwin ] || fail 'Run this setup on your Mac, not in a cloud or Linux session.'
[ -n "$sync_directory" ] || fail 'The Flick folder path is empty.'
case "$sync_directory" in /*) ;; *) fail 'FLICK_SYNC_DIR must be an absolute folder path.' ;; esac
command -v git >/dev/null 2>&1 || fail 'Git is required. Install the Mac command line developer tools first.'
git --version >/dev/null
export GIT_TERMINAL_PROMPT=0

printf '%s\n' 'Setting up the Flick folder and GitHub synchronization...'
if [ ! -e "$sync_directory" ]; then
  mkdir -p -- "$(dirname -- "$sync_directory")"
  git clone --branch main -- "$repository" "$sync_directory"
elif [ ! -d "$sync_directory" ]; then
  fail 'The Flick path is a file. Nothing was overwritten.'
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
          printf 'Flick setup: preserved Finder metadata at %s.\n' "$finder_backup"
        fi
      fi
    }
    trap 'restore_finder' EXIT
    trap 'exit 130' INT
    trap 'exit 143' TERM
    mv -- "$sync_directory/.DS_Store" "$finder_backup"
    git clone --branch main -- "$repository" "$sync_directory"
    restore_finder
    trap - EXIT INT TERM
  else
    [ -z "$entries" ] || fail 'The Flick folder contains existing files without Git. They were preserved. Use an empty folder or an existing Flick checkout.'
    git clone --branch main -- "$repository" "$sync_directory"
  fi
fi

sync_directory=$(CDPATH= cd -- "$sync_directory" && pwd -P)
git_root=$(git -C "$sync_directory" rev-parse --show-toplevel 2>/dev/null) || fail 'The Flick folder is not a Git checkout.'
git_root=$(CDPATH= cd -- "$git_root" && pwd -P)
[ "$git_root" = "$sync_directory" ] || fail 'Flick is nested inside another checkout. Nothing was overwritten.'
validate_remote() {
  case "$1" in
    https://github.com/yallarideapp/flickmobile|https://github.com/yallarideapp/flickmobile.git|https://github.com/yallarideapp/flickmobile.git/|git@github.com:yallarideapp/flickmobile|git@github.com:yallarideapp/flickmobile.git|ssh://git@github.com/yallarideapp/flickmobile|ssh://git@github.com/yallarideapp/flickmobile.git) return 0 ;;
    *) return 1 ;;
  esac
}
validate_remote "$(git -C "$sync_directory" remote get-url --all origin)" || fail 'The folder points to a different GitHub repository.'
validate_remote "$(git -C "$sync_directory" remote get-url --push --all origin)" || fail 'The folder pushes to a different GitHub repository.'
[ "$(git -C "$sync_directory" symbolic-ref --quiet --short HEAD)" = main ] || fail 'Switch the Flick checkout to main before setup. Its current branch was preserved.'
[ -z "$(git -C "$sync_directory" status --porcelain --untracked-files=normal)" ] || fail 'The folder has local changes. They were preserved; commit or move them before setup.'

git -C "$sync_directory" fetch origin refs/heads/main:refs/remotes/origin/main
git -C "$sync_directory" merge --ff-only refs/remotes/origin/main
core_script=$sync_directory/scripts/flick-sync.sh
[ -f "$core_script" ] || fail 'The current GitHub checkout does not contain the sync helper. Nothing was installed.'
/bin/bash -n "$core_script"

mkdir -p -- "$support_directory" "$agents_directory" "$logs_directory"
# The timer runs this installed copy. Later repository updates cannot change the
# executable helper until this setup is deliberately run again.
temporary_helper=$support_directory/flick-sync.sh.new.$$
cp -- "$core_script" "$temporary_helper"
chmod 700 "$temporary_helper"
mv -- "$temporary_helper" "$support_directory/flick-sync.sh"

xml_escape() {
  local value=$1
  value=${value//&/\&amp;}
  value=${value//</\&lt;}
  value=${value//>/\&gt;}
  printf '%s' "$value"
}
helper_xml=$(xml_escape "$support_directory/flick-sync.sh")
folder_xml=$(xml_escape "$sync_directory")
log_xml=$(xml_escape "$logs_directory/Flick-GitHub-Sync.log")
git_executable=$(command -v git)
background_path=$(dirname -- "$git_executable"):/usr/bin:/bin:/usr/sbin:/sbin
path_xml=$(xml_escape "$background_path")
temporary_plist=$agents_directory/$label.plist.new.$$
cat > "$temporary_plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$label</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>$helper_xml</string>
    <string>--directory</string><string>$folder_xml</string>
    <string>--pull-only</string>
  </array>
  <key>EnvironmentVariables</key><dict><key>PATH</key><string>$path_xml</string></dict>
  <key>RunAtLoad</key><true/>
  <key>StartInterval</key><integer>60</integer>
  <key>StandardOutPath</key><string>$log_xml</string>
  <key>StandardErrorPath</key><string>$log_xml</string>
  <key>ProcessType</key><string>Background</string>
</dict>
</plist>
EOF
chmod 600 "$temporary_plist"
/usr/bin/plutil -lint "$temporary_plist" >/dev/null
mv -- "$temporary_plist" "$plist"

user_domain=gui/$(id -u)
/bin/launchctl bootout "$user_domain/$label" >/dev/null 2>&1 || true
/bin/launchctl enable "$user_domain/$label"
/bin/launchctl bootstrap "$user_domain" "$plist"
/bin/bash "$support_directory/flick-sync.sh" --directory "$sync_directory" --pull-only

printf '\n%s\n' 'Flick setup is complete.'
printf 'Website folder: %s\n' "$sync_directory"
printf '%s\n' 'GitHub updates will be checked every minute while you are logged in.'
printf '%s\n' 'Local edits are preserved. The background job does not commit or push them.'
printf '%s\n' 'Changes made locally should still be committed and pushed after each completed update.'
printf 'Sync log: %s\n' "$logs_directory/Flick-GitHub-Sync.log"
