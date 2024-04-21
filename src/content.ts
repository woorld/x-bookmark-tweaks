import { bookmarkPageUrl　} from './constants';

let currentScrollY = 0;
let currentUrl = location.href;

const isBookmarkPage = (url: string): boolean => url.startsWith(bookmarkPageUrl);

function onScroll(): void {
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

  // 主に 右ペイン閉じる→他ポスト押下で右ペイン開く でスクロールが巻き戻る挙動の矯正用
  const isOpenRightPane = currentUrl === bookmarkPageUrl && location.href.startsWith(bookmarkPageUrl + '?post_id=');
  if (isOpenRightPane) {
    console.log('right pane opened');
    // 復元するスクロール量を現在のスクロール量に固定（currentScrollYは通常のスクロールイベントで上書きされるため）
    const correctTargetScrollY = currentScrollY;
    const correctScrollPosition = () => window.scrollTo(0, correctTargetScrollY);

    document.addEventListener('scroll', correctScrollPosition);
    setTimeout(() => document.removeEventListener('scroll', correctScrollPosition), 100);
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
