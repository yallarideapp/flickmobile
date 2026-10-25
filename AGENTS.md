# Flick project workflow

The user expects each requested Flick update to be saved in both places:

- The local Flick project folder on the user's Mac.
- The GitHub repository `yallarideapp/flickmobile`.

For future updates:

- Prefer working from the local Mac project so its files are saved directly.
- Preserve existing local changes. Do not reset or overwrite unrelated work.
- Commit the source files, assets, and tests needed for the requested update,
  then push the completed changes to GitHub.
- Verify the local project and GitHub contain the update before reporting that
  both copies are saved.
- A cloud workspace is a separate copy, not the user's Mac folder. If Mac access
  is unavailable, finish the authorized GitHub work and report Mac synchronization
  as pending. A ZIP download is not automatic synchronization of the Mac folder.
