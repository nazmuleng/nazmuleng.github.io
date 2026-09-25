(function () {
  var MAP_URL = "https://maps.app.goo.gl/7AcFN482aHTaiHBSA";
  var RESEARCHGATE_URL = "https://www.researchgate.net/profile/Md-Nazmul-Islam-31";

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
      'style="font-family:sans-serif;font-weight:600;font-size:1rem;color:inherit;text-decoration:none;">' +
      'M.N. Islam</a>';
  }

  function patchLocation() {
    var spans = document.querySelectorAll("span");
    for (var i = 0; i < spans.length; i++) {
      var span = spans[i];
      if (span.dataset.locPatched || !span.querySelector("svg")) continue;
      var nodes = span.childNodes;
      for (var j = 0; j < nodes.length; j++) {
        var node = nodes[j];
        if (node.nodeType === 3 && node.textContent.indexOf("Sirajganj") !== -1) {
          span.dataset.locPatched = "1";
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

  function researchGateIcon() {
    return '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" role="img">' +
      '<rect x="4" y="4" width="56" height="56" rx="16" fill="#000000" />' +
      '<text x="32" y="40" text-anchor="middle" font-size="24" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#ffffff" letter-spacing="-1">RG</text>' +
      '</svg>';
  }

  function makeResearchGateLink(scope) {
    var link = document.createElement("a");
    link.href = RESEARCHGATE_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "ResearchGate profile");
    link.title = "ResearchGate";
    link.dataset.researchgateLink = "1";
    link.className = "researchgate-link" + (scope === "footer" ? " researchgate-link-footer" : " researchgate-link-hero");

    if (scope === "footer") {
      link.innerHTML = researchGateIcon();
    } else {
      link.innerHTML = researchGateIcon() + '<span class="researchgate-label">ResearchGate</span>';
    }

    return link;
  }

  function patchResearchGateLinks() {
    var scholarLinks = document.querySelectorAll('a[href*="scholar.google"]');
    for (var i = 0; i < scholarLinks.length; i++) {
      var scholar = scholarLinks[i];
      var scope = scholar.closest("footer") ? "footer" : "hero";
      var key = "researchgateAdded" + scope;
      if (scholar.dataset[key]) continue;
      scholar.dataset[key] = "1";

      var rg = makeResearchGateLink(scope);
      var parent = scholar.parentElement;

      if (scope === "footer") {
        scholar.parentNode.insertBefore(rg, scholar.nextSibling);
      } else if (parent && parent.children.length <= 3) {
        var rgWrapper = document.createElement("div");
        rgWrapper.className = "researchgate-wrapper";
        rgWrapper.appendChild(rg);
        parent.parentNode.insertBefore(rgWrapper, parent.nextSibling);
      } else {
        scholar.parentNode.insertBefore(rg, scholar.nextSibling);
      }
    }
  }

  function patchReferences() {
    var headings = document.querySelectorAll("h2, h3, h4");
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].textContent.trim().toLowerCase() !== "references") continue;
      var section = headings[i].closest("section") || headings[i].parentElement;
      if (!section || section.dataset.referencesPatched) continue;
      section.dataset.referencesPatched = "1";
      var list = document.createElement("div");
      list.className = "custom-references-list";
      list.innerHTML =
        '<div><strong>Dr. Md. Shariful Islam</strong><br>Professor, Mechanical Engineering, KUET<br><a href="mailto:msislam@me.kuet.ac.bd">msislam@me.kuet.ac.bd</a></div>' +
        '<div><strong>Dr. Md. Arifuzzaman</strong><br>Professor, Mechanical Engineering, KUET<br><a href="mailto:arif48@me.kuet.ac.bd">arif48@me.kuet.ac.bd</a></div>' +
        '<div><strong>Dr. Md. Mahbubur Rahman</strong><br>Professor, Mechanical Engineering, KUET<br><a href="mailto:mahbub.rahman@me.kuet.ac.bd">mahbub.rahman@me.kuet.ac.bd</a></div>' +
        '<div><strong>Somnath Somadder</strong><br>Assistant Professor, Mechanical Engineering, KUET<br><a href="mailto:somnath@me.kuet.ac.bd">somnath@me.kuet.ac.bd</a></div>';
      while (section.lastElementChild && section.lastElementChild !== headings[i]) section.removeChild(section.lastElementChild);
      section.appendChild(list);
    }
  }

  function hideDetailsColumn() {
    var cells = document.querySelectorAll("th, td");
    for (var i = 0; i < cells.length; i++) {
      if (cells[i].textContent.trim().toLowerCase() !== "details") continue;
      var table = cells[i].closest("table");
      if (!table || table.dataset.detailsHidden) continue;
      table.dataset.detailsHidden = "1";
      var index = Array.prototype.indexOf.call(cells[i].parentElement.children, cells[i]);
      Array.prototype.forEach.call(table.rows, function (row) {
        if (row.children[index]) row.children[index].style.display = "none";
      });
    }
  }

  function patch() {
    patchFooter();
    patchLocation();
    patchResearchGateLinks();
    patchReferences();
    hideDetailsColumn();
  }

  var observer = new MutationObserver(patch);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState !== "loading") patch();
  else document.addEventListener("DOMContentLoaded", patch);
})();
