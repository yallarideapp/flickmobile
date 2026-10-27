# Flick Mobile

Website repository: <https://github.com/yallarideapp/flickmobile>

Live website: <https://yallarideapp.github.io/flickmobile/>

## Keep the Mac folder and GitHub updated

Run the Mac setup once to copy the website into
`~/Documents/ChatGPT/Flick` and keep that folder updated from GitHub:

1. Download [Flick-Mac-Sync.zip](https://github.com/yallarideapp/flickmobile/raw/refs/heads/main/downloads/Flick-Mac-Sync.zip).
2. Extract it and open `Setup-Flick-Mac.command` on the Mac.
3. Check the completion message in the Terminal window that opens.

The setup uses your user account, without `sudo`. It clones the repository when
the destination is empty or absent. It preserves existing work and refuses to
replace a nonempty folder that is not this repository.

After setup, a user LaunchAgent checks GitHub every minute while you are logged
in and the Mac is running. It fast-forwards a clean `main` checkout. Uncommitted files, another
branch, or conflicting history pause the update so local work is preserved.

For changes made locally on the Mac, save the files in this checkout, commit
the requested update, and push it to GitHub. For changes made in the cloud,
commit and push the update; the installed Mac updater then pulls it into the
clean Mac checkout. The background updater does not automatically commit or
publish unfinished local work.

The sync log is `~/Library/Logs/Flick-GitHub-Sync.log`. To turn off background
updates while keeping all website files:

```bash
launchctl disable "gui/$(id -u)/com.flickmobile.github-sync"
launchctl bootout "gui/$(id -u)/com.flickmobile.github-sync"
```

Running the setup again enables updates again.

To sync completed commits from a Mac Terminal:

```bash
/bin/bash "$HOME/Library/Application Support/FlickSync/flick-sync.sh" \
  --directory "$HOME/Documents/ChatGPT/Flick" --sync
```

The setup installs a stable copy of the sync helper outside the repository.
GitHub updates do not cause the timer to execute newly downloaded project code.
Run the setup again when you want to update the installed helper.

A cloud chat cannot install or verify the Mac updater without a connection to
that Mac. Downloading the setup alone does not activate synchronization.

## Checks

```bash
node tests/device-features.test.cjs
bash tests/mac-sync.test.sh
```
