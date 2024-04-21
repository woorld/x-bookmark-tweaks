let currentScrollY = 0;
let currentUrl = location.href;

const invalidScrollAmount = 200;
const bookmarkPageUrl = 'https://twitter.com/i/bookmarks';
const isBookmarkPage = (url: string): boolean => url.startsWith(bookmarkPageUrl);

function onScroll(): void {
  // 1回のスクロール量が一定より多い場合は戻す
  // （ポスト展開時に前回右ペインを閉じたときの位置に戻ってしまうのを抑制）
  if (window.scrollY <= currentScrollY - invalidScrollAmount
    || window.scrollY >= currentScrollY + invalidScrollAmount) {
    window.scrollTo(0, currentScrollY);
    return;
  }

  currentScrollY = window.scrollY;
};

// documentを監視
const observer = new MutationObserver(() => {
  if (location.href === currentUrl) {
    return;
  }

  const isEnterBookmarkPage = !isBookmarkPage(currentUrl) && isBookmarkPage(location.href);
  if (isEnterBookmarkPage) {
    console.log('enabled');
    document.addEventListener('scroll', onScroll);
  }

  const isLeaveBookmarkPage = isBookmarkPage(currentUrl) && !isBookmarkPage(location.href);
  if (isLeaveBookmarkPage) {
    console.log('disabled');
    document.removeEventListener('scroll', onScroll);
  }

  currentUrl = location.href;

  // URLが以前から変更されていた場合、スクロール位置を復元
  window.scrollTo(0, currentScrollY);
});

observer.observe(document, {
  childList: true,
  subtree: true
});

if (isBookmarkPage(location.href)) {
  document.addEventListener('scroll', onScroll);
}
