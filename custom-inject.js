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
    textDiv.innerHTML = '<a href="' + MAP_URL + '" target="_blank" rel="noopener noreferrer" style="font-family:sans-serif;font-weight:600;font-size:1rem;color:inherit;text-decoration:none;">M.N. Islam</a>';
  }

  function patchLocation() {
    document.querySelectorAll("span").forEach(function (span) {
      if (span.dataset.locPatched || !span.querySelector("svg")) return;
      Array.prototype.forEach.call(span.childNodes, function (node) {
        if (node.nodeType !== 3 || node.textContent.indexOf("Sirajganj") === -1) return;
        span.dataset.locPatched = "1";
        var link = document.createElement("a");
        link.href = MAP_URL;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = node.textContent;
        link.style.cssText = "color:inherit;text-decoration:none;";
        span.replaceChild(link, node);
      });
    });
  }

  function researchGateIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="img"><circle cx="12" cy="12" r="11" fill="#000"/><text x="12" y="15" text-anchor="middle" font-size="7" font-family="Arial,Helvetica,sans-serif" font-weight="700" fill="#fff" letter-spacing="-.4">RG</text></svg>';
  }

  function patchResearchGateLinks() {
    document.querySelectorAll('a[href*="scholar.google"]').forEach(function (scholar) {
      var scope = scholar.closest("footer") ? "footer" : "hero";
      var key = "researchgateAdded" + scope;
      if (scholar.dataset[key]) return;
      scholar.dataset[key] = "1";
      var link = document.createElement("a");
      link.href = RESEARCHGATE_URL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.title = "ResearchGate";
      link.setAttribute("aria-label", "ResearchGate profile");
      link.className = "researchgate-link researchgate-link-" + scope;
      link.innerHTML = researchGateIcon() + (scope === "footer" ? "" : '<span>ResearchGate</span>');
      scholar.parentNode.insertBefore(link, scholar.nextSibling);
    });
  }

  function patchReferences() {
    document.querySelectorAll("h2,h3,h4").forEach(function (heading) {
      if (heading.textContent.trim().toLowerCase() !== "references") return;
      var section = heading.closest("section") || heading.parentElement;
      if (!section || section.dataset.referencesPatched) return;
      section.dataset.referencesPatched = "1";
      var list = document.createElement("div");
      list.className = "custom-references-list";
      list.innerHTML = '<div><strong>Dr. Md. Shariful Islam</strong><br>Professor, Mechanical Engineering, KUET<br><a href="mailto:msislam@me.kuet.ac.bd">msislam@me.kuet.ac.bd</a></div><div><strong>Dr. Md. Arifuzzaman</strong><br>Professor, Mechanical Engineering, KUET<br><a href="mailto:arif48@me.kuet.ac.bd">arif48@me.kuet.ac.bd</a></div><div><strong>Dr. Md. Mahbubur Rahman</strong><br>Professor, Mechanical Engineering, KUET<br><a href="mailto:mahb.rahman@me.kuet.ac.bd">mahb.rahman@me.kuet.ac.bd</a></div><div><strong>Somnath Somadder</strong><br>Assistant Professor, Mechanical Engineering, KUET<br><a href="mailto:somnath@me.kuet.ac.bd">somnath@me.kuet.ac.bd</a></div>';
      while (section.lastElementChild && section.lastElementChild !== heading) section.removeChild(section.lastElementChild);
      section.appendChild(list);
    });
  }

  function hideDetailsColumn() {
    document.querySelectorAll("th,td").forEach(function (cell) {
      if (cell.textContent.trim().toLowerCase() !== "details") return;
      var table = cell.closest("table");
      if (!table || table.dataset.detailsHidden) return;
      table.dataset.detailsHidden = "1";
      var index = Array.prototype.indexOf.call(cell.parentElement.children, cell);
      Array.prototype.forEach.call(table.rows, function (row) { if (row.children[index]) row.children[index].style.display = "none"; });
    });
  }

  function patch() { patchFooter(); patchLocation(); patchResearchGateLinks(); patchReferences(); hideDetailsColumn(); }
  new MutationObserver(patch).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState !== "loading") patch(); else document.addEventListener("DOMContentLoaded", patch);
})();
