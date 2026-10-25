# Privacy Policy — ShikimoriSync

_Last updated: 2026-10-23_

ShikimoriSync is a Seanime extension that syncs your anime/manga list between AniList and Shikimori. It is designed to handle as little data as possible: no analytics, no tracking, no third-party servers.

## What the extension stores

Everything is stored **locally on your device**:

- **Shikimori OAuth access token** — obtained when you sign in via Shikimori's own authorization page. Used to read and update your Shikimori list. Stored in the extension's local storage (`$store` / `$storage`).
- **Your Shikimori user ID** — used to scope API queries to your list.
- **A cached copy of your Shikimori list** — anime/manga entries (IDs, scores, statuses, progress, notes, timestamps). Used to avoid re-fetching the entire list on every sync. Stored locally, refreshed on each sync.
- **A `last_sync` timestamp** — used to determine which entries changed since the last successful sync.

The extension **never** sees or stores your Shikimori password. Sign-in goes through Shikimori's official OAuth page (`shikimori.io/oauth/authorize`).

## What is sent, and where

The extension communicates only with:

- **Shikimori** (`shikimori.io`) — to read your user list (`GET /api/v2/user_rates`, GraphQL `userRates`) and to update entries you choose to sync (`PATCH`/`POST`/`DELETE /api/v2/user_rates`). Requests are authenticated with your Bearer token.
- **AniList** (`graphql.anilist.co`) — to read your AniList list for comparison. This is handled by Seanime's built-in AniList integration, not by this extension.

No data is sent to the extension author or any other party.

## What the sync does

When you run a manual sync, the extension:

1. Reads your AniList list (via Seanime's AniList client).
2. Reads your Shikimori list (via the Shikimori API, using your token).
3. Compares the two and sends **only the differences** (score, status, progress, notes) to Shikimori.
4. Optionally deletes entries from Shikimori that are no longer in your AniList list (only in `fullsync` mode).
5. Runs an existence check against Shikimori to prune locally cached entries that have been deleted on Shikimori.

## Data sharing & sale

Your data is **not** sold, rented, or shared with anyone. It is used solely to provide the sync functionality you requested.

## Your control

- Sign out anytime from the extension UI — this removes the stored token.
- You can also revoke access from your [Shikimori OAuth applications page](https://shikimori.io/oauth/applications).
- Removing the extension deletes all locally stored data (token, cache, timestamps).

## Security notes

- All requests to Shikimori and AniList use HTTPS.
- The extension does not run a server, proxy, or relay. Tokens go directly from your device to Shikimori.
- Shikimori's `/oauth/token` endpoint requires a `client_secret` even for browser-based clients. If this extension ships with an embedded secret, it is only used to exchange your authorization code for a token — it does not grant access to any other user's data, and it cannot be used without your per-user authorization code.

## Contact

Questions or requests: open an issue on the [extension repository](https://github.com/nnotwen/n-seanime-extensions) or contact the author.
