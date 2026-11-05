(()=>{'use strict';
const vaults=window.VZ_VAULTS||[],items=window.VZ_ITEMS||[];
const colors={Common:'#b5b7b5',Uncommon:'#77c894',Rare:'#68b5ec',Epic:'#be86e8',Legendary:'#efbe62',Mythic:'#f19e76',Secret:'#ef8ac8'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const vaultById=id=>vaults.find(v=>v.id===id);
const itemById=id=>items.find(x=>x.id===id);
const countLabel=n=>n===1?'артефакт':(n>=2&&n<=4?'артефакта':'артефактов');
const statuses={ready:'АРТ ГОТОВ',wip:'В РАЗРАБОТКЕ'};
const itemUrl=x=>'wiki.html#/item/'+encodeURIComponent(x.id);
function itemCard(x){return `<a class="item-card" href="${itemUrl(x)}" style="--rarity-color:${colors[x.rarity]||'#d8b479'}" aria-label="${esc(x.name)}, ${esc(x.rarity)}, открыть запись"><div class="item-card-media"><span class="item-card-rank">NO. ${String(x.order).padStart(2,'0')}</span><span class="item-card-status">${statuses[x.status]||'КОНЦЕПТ'}</span><img src="${esc(x.preview)}" alt="${esc(x.name)}" width="440" height="440" loading="lazy" decoding="async"></div><div class="item-card-info"><div><h4>${esc(x.name)}</h4><p>${esc(x.rarity)}</p></div><span class="item-card-arrow" aria-hidden="true">↗</span></div></a>`}
function initNav(){const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');if(!toggle||!nav)return;toggle.addEventListener('click',()=>{const opened=nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(opened));toggle.setAttribute('aria-label',opened?'Закрыть меню':'Открыть меню')});nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false')}});window.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false')}})}
function initExplorers(){document.querySelectorAll('[data-explorer]').forEach(root=>{
 const grid=root.querySelector('[data-vault-grid]'),panel=root.querySelector('[data-vault-content]');if(!grid||!panel)return;const isArchive=root.dataset.explorer==='archive';const queryVault=new URLSearchParams(location.search).get('vault');let active=(isArchive&&vaultById(queryVault))?queryVault:null;let filter='all';panel.id='vaultDetails';
 grid.innerHTML=vaults.map((v,i)=>{const n=items.filter(x=>x.vault===v.id).length;return `<button type="button" class="vault-card" style="--vault-accent:${esc(v.color)}" data-vault="${esc(v.id)}" aria-expanded="false" aria-controls="vaultDetails" aria-label="Открыть ${esc(v.name)}, ${n} предметов"><span class="vault-card-top"><span>VAULT ${String(i+1).padStart(2,'0')} / 08</span><span class="vault-card-symbol" aria-hidden="true">${esc(v.symbol)}</span></span><span class="vault-card-art"><img src="${esc(v.image)}" width="900" height="900" alt="" loading="${i<4?'eager':'lazy'}" decoding="async"></span><span class="vault-card-bottom"><span><strong>${esc(v.name)}</strong><small>${n} ${countLabel(n)}</small></span><span class="vault-card-open" aria-hidden="true">+</span></span></button>`}).join('');
 function drawButtons(){grid.querySelectorAll('.vault-card').forEach(b=>{const isActive=b.dataset.vault===active;b.classList.toggle('is-active',isActive);b.setAttribute('aria-expanded',String(isActive));b.setAttribute('aria-label',(isActive?'Закрыть ':'Открыть ')+(vaultById(b.dataset.vault)?.name||'хранилище'))})}
 function drawPanel(){drawButtons();if(!active){panel.hidden=true;panel.innerHTML='';panel.style.removeProperty('--vault-accent');return}const v=vaultById(active);if(!v)return;panel.hidden=false;panel.style.setProperty('--vault-accent',v.color);const list=items.filter(x=>x.vault===active);const picked=filter==='all'?list:list.filter(x=>x.rarity===filter);const chips=['all','Common','Uncommon','Rare','Epic','Legendary','Mythic','Secret'].filter(r=>r==='all'||list.some(x=>x.rarity===r));panel.innerHTML=`<div class="expansion-head"><div><span class="expansion-kicker">${esc(v.motif)} / COLLECTION OPENED</span><h3>${esc(v.name)}</h3><p>${esc(v.description)}</p></div><div class="expansion-count"><strong>${list.length}</strong> АРТЕФАКТОВ</div></div><div class="expansion-filters"><div class="filter-chips" role="group" aria-label="Фильтр редкости">${chips.map(r=>`<button type="button" class="filter-chip" data-rarity="${r}" aria-pressed="${String(filter===r)}">${r==='all'?'Все редкости':r}</button>`).join('')}</div><span class="expansion-help">НАЖМИ НА ПРЕДМЕТ, ЧТОБЫ ОТКРЫТЬ ЕГО ИСТОРИЮ ↗</span></div><div class="item-grid">${picked.length?picked.map(itemCard).join(''):'<p class="empty-items">Предметы этой редкости отсутствуют в выбранном хранилище.</p>'}</div>`}
 grid.addEventListener('click',e=>{const b=e.target.closest('button[data-vault]');if(!b)return;active=active===b.dataset.vault?null:b.dataset.vault;filter='all';drawPanel();if(isArchive){const url=new URL(location.href);if(active)url.searchParams.set('vault',active);else url.searchParams.delete('vault');history.replaceState(null,'',url)}if(active){requestAnimationFrame(()=>{panel.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})})}});
 panel.addEventListener('click',e=>{const b=e.target.closest('button[data-rarity]');if(!b)return;filter=b.dataset.rarity;drawPanel()});drawPanel();
 })}
function initWiki(){const root=document.getElementById('wiki-root');if(!root)return;const catalogHTML=root.innerHTML;let chosenVault='all',chosenRarity='all',search='';
 function renderCatalog(){document.title='Летопись артефактов — VAULT ZERO';root.innerHTML=catalogHTML;const s=document.getElementById('wikiSearch'),v=document.getElementById('wikiVault'),r=document.getElementById('wikiRarity'),list=document.getElementById('wikiGrid'),count=document.getElementById('wikiCount');if(!s||!v||!r||!list)return;v.insertAdjacentHTML('beforeend',vaults.map(a=>`<option value="${esc(a.id)}">${esc(a.name)}</option>`).join(''));s.value=search;v.value=chosenVault;r.value=chosenRarity;
 function draw(){const filtered=items.filter(x=>(chosenVault==='all'||x.vault===chosenVault)&&(chosenRarity==='all'||x.rarity===chosenRarity)&&(!search||[x.name,x.vaultName,x.kind,x.rarity].join(' ').toLowerCase().includes(search)));count.textContent=`${filtered.length} ${countLabel(filtered.length).toUpperCase()}`;list.innerHTML=filtered.length?filtered.map(itemCard).join(''):'<p class="empty-items">Не найдено. Измени поиск или фильтры.</p>'}
 s.addEventListener('input',()=>{search=s.value.trim().toLowerCase();draw()});v.addEventListener('change',()=>{chosenVault=v.value;draw()});r.addEventListener('change',()=>{chosenRarity=r.value;draw()});draw()}
 function renderDetail(item){const v=vaultById(item.vault),related=items.filter(x=>x.vault===item.vault&&x.id!==item.id).sort((a,b)=>Math.abs(a.rank-item.rank)-Math.abs(b.rank-item.rank)).slice(0,3);const accent=colors[item.rarity]||'#d8b479';document.title=`${item.name} — Летопись VAULT ZERO`;
 root.innerHTML=`<div class="wrap detail-breadcrumb"><a href="index.html">Главная</a><span>/</span><a href="vaults.html?vault=${encodeURIComponent(item.vault)}">${esc(v.name)}</a><span>/</span><b>${esc(item.name)}</b></div><section class="detail-hero"><div class="wrap detail-layout" style="--rarity-color:${accent}"><div class="detail-art"><span class="detail-art-label">RELIC / ${String(item.order).padStart(2,'0')} — ${esc(item.rarity).toUpperCase()}</span><img src="${esc(item.image)}" width="1254" height="1254" alt="${esc(item.name)} — концепт-арт оружия" loading="eager" fetchpriority="high" decoding="async"></div><div class="detail-copy"><p class="eyebrow">THE ARTIFACT CHRONICLE / ${esc(v.name).toUpperCase()}</p><h1>${esc(item.name)}</h1><p class="detail-subtitle">${esc(item.kind)} · ${esc(v.lead)}</p><div class="detail-labels"><span class="tag tag-rarity">✦ ${esc(item.rarity)}</span><span class="tag">${statuses[item.status]}</span><span class="tag">${esc(v.name)}</span></div><div class="detail-info"><dl><div><dt>Хранилище</dt><dd>${esc(v.name)}</dd></div><div><dt>Редкость</dt><dd style="color:${accent}">${esc(item.rarity)}</dd></div><div><dt>Тип по концепт-арту</dt><dd>${esc(item.kind)}</dd></div><div><dt>Состояние изображения</dt><dd>${item.status==='ready'?'Готовое изображение':'В разработке'}</dd></div></dl></div><div class="detail-actions"><a href="vaults.html?vault=${encodeURIComponent(item.vault)}#vault-collection" class="button button-gold">Все предметы ${esc(v.name)} ↗</a><a href="wiki.html" class="button button-outline">Каталог артефактов →</a></div></div></div></section><section class="lore-section"><div class="wrap lore-layout"><div><p class="eyebrow">CONCEPT LORE / ${esc(item.rarity).toUpperCase()}</p><h2>История<br>артефакта</h2></div><div class="lore-copy"><p>${esc(item.lore[0])}</p><p>${esc(item.lore[1])}</p><div class="lore-foot">Художественный концепт-лор для сайта — не утверждённый канон. Боевые характеристики и игровые эффекты не заявлены.</div></div></div></section><section class="related-section"><div class="wrap"><p class="eyebrow">MORE FROM THE SAME VAULT</p><h2>Другие артефакты ${esc(v.name)}</h2><div class="related-grid">${related.map(itemCard).join('')}</div></div></section>`;
 }
 function route(){const hash=decodeURIComponent(location.hash.replace(/^#\/?/,''));if(!hash||hash==='catalog'){renderCatalog()}else if(hash.startsWith('item/')){const item=itemById(hash.slice(5));if(item)renderDetail(item);else renderMissing()}else renderMissing();window.scrollTo({top:0,behavior:'instant'})}
 function renderMissing(){document.title='Запись не найдена — VAULT ZERO';root.innerHTML='<section class="wrap notfound"><h1>Артефакт не найден</h1><p>Возможно, ссылка устарела. Открой каталог, чтобы найти предмет.</p><a href="wiki.html" class="button button-gold">Вернуться в летопись</a></section>'}
 window.addEventListener('hashchange',route);route()}
// Backwards-compatible image paths for older VAULT ZERO GitHub deployments.
// Older sites stored card images in assets/previews/, whereas Aeterna uses assets/thumbs/.
// Full-size items may also be PNG instead of WebP. Preserve the original artwork.
document.addEventListener('error', e => {
  const el = e.target;
  if (!el || el.tagName !== 'IMG' || el.dataset.failed === 'true') return;
  const src = el.getAttribute('src') || '';
  let next = '';
  if (src.includes('assets/thumbs/')) {
    next = src.replace('assets/thumbs/', 'assets/previews/');
  } else if (src.includes('assets/previews/')) {
    next = src.replace('assets/previews/', 'assets/items/');
  } else if (src.includes('assets/items/') && /\.webp(?:$|[?#])/i.test(src)) {
    next = src.replace(/\.webp(?=$|[?#])/i, '.png');
  }
  if (next && next !== src) {
    el.src = next;
    return;
  }
  el.dataset.failed = 'true';
  el.style.visibility = 'hidden';
  const fallback = document.createElement('span');
  fallback.textContent = 'Изображение временно недоступно';
  fallback.style.cssText = 'position:absolute;inset:20px;display:flex;align-items:center;justify-content:center;text-align:center;color:#a59b91;font-size:12px;pointer-events:none;';
  el.parentNode?.appendChild(fallback);
}, true);
initNav();initExplorers();initWiki();
})();
