import { bookmarkPageUrl, tagAddElSelector } from './constants';
import { TagList } from './components/tag-list';
import van from 'vanjs-core';
import './styles/content.scss';

// スクロール復元用
let currentScrollY = 0;
let currentUrl = location.href;

// タグ領域追加用
let latestBookmarkPostsLength = 0;

const isBookmarkPage = (url: string): boolean => url.startsWith(bookmarkPageUrl);

const onScroll = (): void => {
  currentScrollY = window.scrollY;
};

const addTagListToPosts = (): void => {
  const bookmarkPosts = document.querySelectorAll(tagAddElSelector);

  if (bookmarkPosts.length === 0 || bookmarkPosts.length === latestBookmarkPostsLength) {
    return;
  }

  latestBookmarkPostsLength = bookmarkPosts.length;

  for (const el of bookmarkPosts) {
    if (el.querySelector('.bmtweaks-tag-list') != null) {
      // タグ領域追加済みの場合は何もしない
      continue;
    }
    van.add(el, TagList);
  }
};

// documentを監視してURLの変更を検知するオブザーバ
const observer = new MutationObserver(() => {
  // 遷移元・遷移先がどちらもブックマークページではない
  const isNotBookmarkPage = !isBookmarkPage(currentUrl) && !isBookmarkPage(location.href);
  if (isNotBookmarkPage) {
    return;
  }

  // ブックマークページから移動していない
  if (location.href === currentUrl) {
    addTagListToPosts();
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
