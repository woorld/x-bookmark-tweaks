// TODO: ブックマークページでのみ動作するようにする（manifest.jsonで指定すると別ページからの遷移で動作しなくなる）
let currentScrollY = 0;
let currentUrl = location.href;

// documentを監視
const observer = new MutationObserver(() => {
  if (currentUrl === location.href) {
    return;
  }

  // URLが以前から変更されていた場合、スクロール位置を復元
  currentUrl = location.href;
  window.scrollTo(0, currentScrollY);
});

observer.observe(document, {
  childList: true,
  subtree: true
});

document.addEventListener('scroll', () => {
  currentScrollY = window.scrollY;
});
