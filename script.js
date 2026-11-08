(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var events = [
    ['08:02','INFO','<b>menoufia.edu</b> — enrolled, BSc Artificial Intelligence'],
    ['09:14','LOW','<b>freelance.start</b> — first full-stack client engagement'],
    ['10:31','LOW','<b>deploy</b> la-norma-menu — responsive café menu shipped'],
    ['11:47','LOW','<b>deploy</b> simple-ecommerce — product routing + display'],
    ['13:05','LOW','<b>deploy</b> venora-shop — React SPA storefront live'],
    ['14:20','INFO','<b>attackweb.lab</b> — vulnerable Node/MongoDB target deployed'],
    ['15:25','MED','<b>nikto</b> — 8,101 recon requests in 23s from 192.168.56.103'],
    ['15:26','HIGH','<b>nosql.inj</b> — login injection flagged on 334ms timing anomaly'],
    ['14:37','HIGH','<b>regex.dump</b> — payload ".*" exposed full user table'],
    ['14:37','MED','<b>brute.force</b> — 56 failed logins, no lockout triggered'],
    ['15:34','LOW','<b>rbac</b> — mass-assignment + admin token attempts blocked'],
    ['17:55','LOW','<b>dashboard</b> — 6/6 attacks detected, 11,402 entries analysed'],
    ['18:00','INFO','<b>status</b> — open to junior SOC analyst &amp; full-stack roles']
  ];

  var sevClass = {INFO:'sev-info',LOW:'sev-low',MED:'sev-med',HIGH:'sev-high'};
  var feed = document.getElementById('feed');
  var counter = document.getElementById('feedCount');
  if(!feed) return;

  events.forEach(function(e){
    var row = document.createElement('div');
    row.className = 'row';
    row.innerHTML =
      '<span class="row__t">'+e[0]+'</span>' +
      '<span class="row__sev '+sevClass[e[1]]+'">'+e[1]+'</span>' +
      '<span class="row__msg">'+e[2]+'</span>';
    feed.appendChild(row);
  });

  var rows = feed.querySelectorAll('.row');
  var shown = 0;

  function setCount(n){ counter.textContent = n + (n === 1 ? ' event' : ' events'); }

  function stream(){
    if(shown >= rows.length) return;
    rows[shown].classList.add('is-in');
    shown++;
    setCount(shown);
    if(shown > 5){
      feed.scrollTop = feed.scrollHeight;
    }
    setTimeout(stream, 260);
  }

  if(reduce){
    rows.forEach(function(r){ r.classList.add('is-in'); });
    setCount(rows.length);
  } else {
    feed.style.overflowY = 'auto';
    setTimeout(stream, 500);
  }

  // scroll reveals
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});

  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
})();
