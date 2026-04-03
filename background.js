chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    enabled: true,
    shorts: true,
    home: false,
    trending: false,
    autoplay: false,
    comments: false,
    sidebar: false,
    stats: { shortsBlocked: 0, homeBlocked: 0, trendingBlocked: 0 },
    theme: "dark" // default theme
  });
});