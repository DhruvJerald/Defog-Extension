
function removeShortsLinks() {
    let links = document.querySelectorAll("a");
  
    links.forEach(link => {
      if (link.href && link.href.includes("/shorts/")) {
        link.remove();
      }
    });
  }
  
 
  function removeShortsShelves() {
    let sections = document.querySelectorAll("ytd-rich-section-renderer");
  
    sections.forEach(section => {
      if (section.textContent && section.textContent.includes("Shorts")) {
        section.remove();
      }
    });
  }
  

  function removeShortsSidebar() {
    let items = document.querySelectorAll("ytd-mini-guide-entry-renderer");
  
    items.forEach(item => {
      if (item.textContent && item.textContent.includes("Shorts")) {
        item.remove();
      }
    });
  }
  
 
  function blockVideoPlayer() {
    let player = document.querySelector("#player");
    if (player) {
      player.style.display = "none";
    }
  }
  
  
  function hideFeed() {
    let feed = document.querySelector("ytd-rich-grid-renderer");
    if (feed) {
      feed.style.display = "none";
    }
  }
  

  function cleanSearch() {
    let sidebar = document.querySelector("#secondary");
    if (sidebar) {
      sidebar.style.display = "none";
    }
  }
  
 
  function blockYouTube() {
    let url = window.location.href;
  
  
    if (url.includes("/shorts/") || url.includes("/watch")) {
      window.location.replace("https://www.youtube.com/");
      return;
    }
  
    removeShortsLinks();
    removeShortsShelves();
    removeShortsSidebar();
  
    blockVideoPlayer();
    hideFeed();
  
    if (url.includes("/results")) {
      cleanSearch();
    }
  }
  

  document.addEventListener(
    "click",
    function (e) {
      let link = e.target.closest("a");
  
      if (link && link.href) {
        if (
          link.href.includes("/shorts/") ||
          link.href.includes("/watch")
        ) {
          e.preventDefault();
          e.stopPropagation();
          console.log("Blocked:", link.href);
        }
      }
    },
    true
  );
  
  //mutation observer
  const observer = new MutationObserver(() => {
    blockYouTube();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  
 
  blockYouTube();