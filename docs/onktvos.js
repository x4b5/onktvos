/* Gedeeld door alle pagina's van onktvos: ankerlinks per item en "iets anders" */
(function () {
  var basis = new URL('.', document.currentScript.src);
  var rubrieken = ['cartoons/', 'koans/', 'teksten/', 'filmpjes/'];

  // Ankerlink naast elke titel; klikken kopieert de link
  document.querySelectorAll('section[id] > h2').forEach(function (h2) {
    var id = h2.parentNode.id;
    var a = document.createElement('a');
    a.className = 'anker';
    a.href = '#' + id;
    a.textContent = '#';
    a.setAttribute('aria-label', 'link naar ' + h2.textContent);
    a.addEventListener('click', function (e) {
      if (!navigator.clipboard) return;
      e.preventDefault();
      history.replaceState(null, '', '#' + id);
      navigator.clipboard.writeText(location.href).then(function () {
        a.textContent = 'gekopieerd';
        setTimeout(function () { a.textContent = '#'; }, 1600);
      });
    });
    h2.appendChild(document.createTextNode(' '));
    h2.appendChild(a);
  });

  // "iets anders": verzamel alle items uit de rubrieken en kies er één
  var items;
  function verzamel() {
    if (!items) {
      items = Promise.all(rubrieken.map(function (r) {
        var url = new URL(r, basis);
        return fetch(url).then(function (res) { return res.text(); }).then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          return Array.from(doc.querySelectorAll('section[id]')).map(function (s) {
            return url.href + '#' + s.id;
          });
        }).catch(function () { return []; });
      })).then(function (lijsten) { return [].concat.apply([], lijsten); });
    }
    return items;
  }

  document.querySelectorAll('.verras').forEach(function (a) {
    a.hidden = false;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      verzamel().then(function (lijst) {
        lijst = lijst.filter(function (u) { return u !== location.href; });
        if (lijst.length) location.href = lijst[Math.floor(Math.random() * lijst.length)];
      });
    });
  });
})();
