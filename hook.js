// Runs inside the page, ahead of X's own code, because X's copy buttons write from there.
// Cuts a post link down to the post (plus /photo/N or /video/N) on its way to the clipboard.
(() => {
  'use strict';

  // The whole text must be one post link, so anything else a page copies stays intact.
  // Kept: the link up to the post ID, and a /photo/N or /video/N right after it. Cut: any
  // other path after the ID, and everything from the first ? or #.
  const POST_LINK = /^(https:\/\/(?:(?:www|mobile)\.)?(?:x|twitter)\.com\/[^\s?#]+?\/status(?:es)?\/\d+(?:\/(?:photo|video)\/\d+)?)(?:\/[^\s?#]*)?(?:[?#]\S*)?$/i;
  const bare = (text) => (typeof text === 'string' ? POST_LINK.exec(text.trim())?.[1] ?? text : text);

  const { writeText, write } = Clipboard.prototype;
  const { setData } = DataTransfer.prototype;

  Clipboard.prototype.writeText = function (text) {
    return writeText.call(this, bare(text));
  };

  // A rich copy can repeat the link in its HTML, so a cut link goes out as plain text alone.
  const cleanItem = async (item) => {
    if (!item.types.includes('text/plain')) return item;
    const text = await (await item.getType('text/plain')).text();
    const cut = bare(text);
    if (cut === text) return item;
    return new ClipboardItem({ 'text/plain': new Blob([cut], { type: 'text/plain' }) });
  };

  Clipboard.prototype.write = async function (items) {
    return write.call(this, await Promise.all([...items].map(cleanItem)));
  };

  // Copy handlers that fill in the clipboard themselves.
  DataTransfer.prototype.setData = function (format, data) {
    return setData.call(this, format, bare(data));
  };

  // Pages that select a hidden field and leave the copying to the browser.
  addEventListener('copy', (event) => {
    const field = document.activeElement;
    const text = field && 'selectionStart' in field
      ? field.value.slice(field.selectionStart, field.selectionEnd)
      : String(getSelection());
    const cut = bare(text);
    if (cut === text) return;
    event.clipboardData.setData('text/plain', cut);
    event.preventDefault();
  }, true);
})();
