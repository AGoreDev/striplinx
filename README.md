# StripLinx

A tiny browser extension that removes the tracking part from Xitter post links when you copy them.

When you use **Share → Copy link** on X, the link comes with extra bits on the end, like
`?a=...&s=20`. StripLinx cuts those off, so the clipboard gets just the post:

```
https://x.com/someone/status/1234567890?a=xxxxxxxx&s=20   →   https://x.com/someone/status/1234567890
```

## What it changes

- Only text that is a single X post link (`x.com` or `twitter.com`). Anything else you copy is left alone.
- Everything from the first `?` or `#` is removed.
- A `/photo/N` or `/video/N` right after the post ID is kept; any other path after the ID is removed.
- Links inside longer text, search links and profile links are not touched.

## Install

Works on Brave. Prob works on most other browsers idk.

1. Download the release zip and unzip it.
2. Open `brave://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and pick the unzipped folder.

There will be no updates, unless I use it and find out it broke, in which case I'll probably fix it (no auto update code is present in this version, and you shouldn't accept such a security vulnerability anyway).

## Why it runs inside the page

X's copy buttons write to the clipboard from the page's own scripts, so the extension has to
sit in the page, ahead of X's code, to catch the link on its way out. It asks for no
permissions, makes no network requests and stores nothing. It is one short file
(`hook.js`), so you can read all of it before loading it.

## Limits

- Desktop browser only. The X phone apps can't be reached by this extension.
- Only copies made on x.com / twitter.com pages are cleaned. Links copied from the address bar
  or from other sites are not.
- What the `a=` value means is not public; StripLinx just removes it.
- If Xitter changes how it copies links, this may stop working.

## How this is built

Sloppa lovingly handcoded in-house by a dedicated and passionate AI agent under my all-seeing eye.

Not affiliated with X Corp.

## License

MIT
