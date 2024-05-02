import { bookmarkPageUrl } from './constants';

let currentScrollY = 0;
let currentUrl = location.href;

const isBookmarkPage = (url: string): boolean => url.startsWith(bookmarkPageUrl);

const onScroll = (): void => {
  currentScrollY = window.scrollY;
};

// documentを監視してURLの変更を検知するオブザーバ
const observer = new MutationObserver(() => {
  // 遷移元・遷移先がどちらもブックマークページではない
  const isNotBookmarkPage = !isBookmarkPage(currentUrl) && !isBookmarkPage(location.href);
  if (location.href === currentUrl || isNotBookmarkPage) {
    return;
  }

  const isEnterBookmarkPage = !isBookmarkPage(currentUrl) && isBookmarkPage(location.href);
  if (isEnterBookmarkPage) {
    document.addEventListener('scroll', onScroll);
  }

  const isLeaveBookmarkPage = isBookmarkPage(currentUrl) && !isBookmarkPage(location.href);
  if (isLeaveBookmarkPage) {
    document.removeEventListener('scroll', onScroll);
  }

  // 主に 右ペイン閉じる→他ポスト押下で右ペイン開く でスクロールが巻き戻る挙動の矯正用
  const isOpenRightPane = currentUrl === bookmarkPageUrl && location.href.startsWith(bookmarkPageUrl + '?post_id=');
  if (isOpenRightPane) {
    // 復元するスクロール量を現在のスクロール量に固定（currentScrollYは通常のスクロールイベントで上書きされるため）
    const correctTargetScrollY = currentScrollY;
    const correctScrollPosition = () => window.scrollTo(0, correctTargetScrollY);

    // 右ペインを開いてから0.1秒間はスクロールをさせない
    document.addEventListener('scroll', correctScrollPosition);
    setTimeout(() => document.removeEventListener('scroll', correctScrollPosition), 100);
  }

  currentUrl = location.href;

  // スクロール位置を復元
  window.scrollTo(0, currentScrollY);
});

observer.observe(document, {
  childList: true,
  subtree: true
});

if (isBookmarkPage(location.href)) {
  document.addEventListener('scroll', onScroll);
}
