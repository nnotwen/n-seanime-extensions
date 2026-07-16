# Discord RPC Extended - User Configuration Guide

## Overview

Discord RPC Extended enhances your Discord presence by providing detailed information about what you're watching or reading. This guide will help you customize every aspect of your Discord status.

---

## Configuration Fields

### Episode Formatting

**Field:** `episode_format`  
**Type:** Text  
**Default:** `Episode {{EP_NUM}}: {{EP_TITLE}}`

Customize how episodes appear in your Discord status. Use these placeholders:

- `{{EP_NUM}}` - Episode number
- `{{EP_TITLE}}` - Episode title

**Examples:**

- `Episode {{EP_NUM}}: {{EP_TITLE}}` → "Episode 5: The Final Battle"
- `S{{EP_NUM}}` → "S5"
- `Ep. {{EP_NUM}}` → "Ep. 5"

---

### Paused Episode Formatting

**Field:** `episode_paused_format`  
**Type:** Text  
**Default:** `Paused Episode {{EP_NUM}}`

Customize how paused episodes appear. Same placeholders as above.

**Examples:**

- `Paused Episode {{EP_NUM}}` → "Paused Episode 5"
- `⏸️ {{EP_NUM}}` → "⏸️ 5"

---

### Chapter Formatting

**Field:** `chapter_format`  
**Type:** Text  
**Default:** `Reading Chapter {{CH_NUM}}`

Customize how manga chapters appear. Use this placeholder:

- `{{CH_NUM}}` - Chapter number

**Examples:**

- `Reading Chapter {{CH_NUM}}` → "Reading Chapter 42"
- `Ch. {{CH_NUM}}` → "Ch. 42"

---

### Media Title Language

**Field:** `media_title_lang`  
**Type:** Select  
**Default:** `userPreferred`

Choose which title language to display in your Discord status.

| Option          | Description                   |
| --------------- | ----------------------------- |
| `userPreferred` | Uses your AniList preference  |
| `english`       | Shows English title           |
| `romaji`        | Shows Romanized title         |
| `native`        | Shows original language title |

---

### Disable Media Link

**Field:** `disable_media_link`  
**Type:** Switch  
**Default:** `false`

**ON:** Removes clickable links from media titles in Discord  
**OFF:** (Default) Links to AniList entries

---

### Disable RPC Navigation

**Field:** `disable_rpc_navigation`  
**Type:** Switch  
**Default:** `false`

**ON:** Disables Discord presence when navigating the app (browsing, settings, etc.)  
**OFF:** (Default) Shows navigation status

---

### Display Profile on Tooltip

**Field:** `display_profile_on_tooltip`  
**Type:** Switch  
**Default:** `true`

**ON:** (Default) Shows your AniList profile on the tooltip  
**OFF:** Hides profile info

---

---

### Disable tooltip on navigation

**Field:** `disable_tooltip_on_navigation`  
**Type:** Switch  
**Default:** `true`

**ON:** (Default) Hides your AniList profile on the tooltip when only navigating the app  
**OFF:** Display profile tooltip

---

### Hide Private Media

**Field:** `hide_private`  
**Type:** Switch  
**Default:** `true`

**ON:** (Default) Prevents private media from appearing in Discord status  
**OFF:** Shows private media (may include sensitive content)

---

### Hide Adult Content

**Field:** `hide_adult`  
**Type:** Switch  
**Default:** `true`

**ON:** (Default) Filters out adult content from Discord presence  
**OFF:** May show adult media (NSFW content may appear)

---

### Hide by Genre

**Field:** `hide_genre_in`  
**Type:** Text  
**Default:** `(empty)`

Hide media containing specific genres. Enter genres as a comma-separated list.

**Examples:**

- `Horror, Thriller` → Hides horror and thriller content
- `Romance, Slice of Life` → Hides romance and slice of life
- `Ecchi, Harem` → Hides ecchi and harem content

**Note:** Genres are case-insensitive. The system will match partial matches.

---

## Quick Setup Guide

### Step 1: Basic Setup

Start with these essential settings:

1. Set your preferred **Media Title Language**
2. Enable **Display Profile on Tooltip** (recommended)
3. Enable **Hide Private Media** (recommended)
4. Enable **Hide Adult Content** (recommended)

### Step 2: Format Your Display

Customize how your media appears:

1. **Episode Format:** `Episode {{EP_NUM}}: {{EP_TITLE}}`
2. **Paused Format:** `⏸️ Episode {{EP_NUM}}`
3. **Chapter Format:** `📖 Chapter {{CH_NUM}}`

### Step 3: Apply Filters (Optional)

Add genre filters if you want to hide specific content:

```
Horror, Ecchi, Harem, Thriller
```

---

## Troubleshooting

### Discord Not Showing Updates?

1. Ensure Discord is running
2. Check that the plugin is enabled in your app
3. Try restarting the application
4. Verify your Discord settings allow Rich Presence
5. Ensure that Discord is not running as an admin (windows)

### Media Not Displaying?

1. Check if the media is private (if `hide_private` is enabled)
2. Verify the media isn't adult content (if `hide_adult` is enabled)
3. Check if the media has one of your filtered genres

### Custom Formatting Not Working?

1. Use exact placeholder names (case-sensitive)
2. Example: `{{EP_NUM}}` not `{{ep_num}}`
3. Reset to default and test before customizing

---

## Tips & Best Practices

- **Keep it clean**: Use the adult content filter to maintain appropriate Discord presence
- **Be concise**: Short formatting makes the status easier to read
- **Privacy matters**: Keep private media hidden to maintain your privacy

---

## Support

For issues or feature requests, visit the [GitHub repository](https://github.com/nnotwen/n-seanime-extensions).
