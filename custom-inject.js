(function () {
  var MAP_URL = "https://maps.app.goo.gl/7AcFN482aHTaiHBSA";

  /* ── 1. Footer: replace "Md Nazmul Islam / Sirajganj" with map link ── */
  function patchFooter() {
    var footer = document.querySelector("footer");
    if (!footer) return;

    var logoImg = footer.querySelector('img[alt="M.N. Islam logo"]');
    if (!logoImg) return;

    var textDiv = logoImg.nextElementSibling;
    if (!textDiv || textDiv.dataset.patched) return;
    textDiv.dataset.patched = "1";

    textDiv.innerHTML =
      '<a href="' + MAP_URL + '" target="_blank" rel="noopener noreferrer" ' +
      'style="font-family:sans-serif;font-weight:600;font-size:1rem;' +
      'color:inherit;text-decoration:none;">' +
      'M.N. Islam</a>';
  }

  /* ── 2. About sidebar: make "Sirajganj, Bangladesh" a map link ─────── */
  function patchLocation() {
    // Find all spans that contain the exact text "Sirajganj, Bangladesh"
    var spans = document.querySelectorAll("span");
    for (var i = 0; i < spans.length; i++) {
      var span = spans[i];
      // Must have a child SVG (the location pin) and the text node
      if (span.dataset.locPatched) continue;
      var hasSvg = span.querySelector("svg");
      if (!hasSvg) continue;
      // Find the text node with "Sirajganj"
      var nodes = span.childNodes;
      for (var j = 0; j < nodes.length; j++) {
        var node = nodes[j];
        if (node.nodeType === 3 && node.textContent.indexOf("Sirajganj") !== -1) {
          span.dataset.locPatched = "1";
          // Replace the text node with an anchor
          var a = document.createElement("a");
          a.href = MAP_URL;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = node.textContent;
          a.style.cssText = "color:inherit;text-decoration:none;";
          span.replaceChild(a, node);
          break;
        }
      }
    }
  }

  function patch() {
    patchFooter();
    patchLocation();
  }

  var observer = new MutationObserver(patch);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState !== "loading") {
    patch();
  } else {
    document.addEventListener("DOMContentLoaded", patch);
  }
})();
