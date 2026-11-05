(function(){'use strict';
var vaults=window.VZ_VAULTS||[],items=window.VZ_ITEMS||[];var byId={};vaults.forEach(function(v){byId[v.id]=v});
var rarities={Common:'#b5b6ac',Uncommon:'#90bc87',Rare:'#8bbde8',Epic:'#c69aed',Legendary:'#efbd73',Mythic:'#ed8a9c',Secret:'#ed8b5b'};
var st={vault:'all',query:'',status:'all',rarity:'all'};
var menu=document.getElementById('vaultMenu'),results=document.getElementById('archiveResults'),head=document.getElementById('currentHeading');
function esc(str){return String(str).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function count(v){return items.filter(function(i){return i.vault===v}).length}
function setupMenu(){
var options=[{id:'all',name:'Все Vault',symbol:'✧',color:'#d5ba9d'}].concat(vaults);
menu.innerHTML=options.map(function(v){return '<button class="vault-choice" type="button" data-vault="'+v.id+'" style="--choice-color:'+v.color+'" aria-pressed="false"><span class="v-symbol" aria-hidden="true">'+esc(v.symbol)+'</span><span class="v-text">'+esc(v.name)+'</span><span class="v-num">'+(v.id==='all'?items.length:count(v.id))+'</span></button>'}).join('');
menu.addEventListener('click',function(e){var b=e.target.closest('button[data-vault]');if(b)location.hash=b.dataset.vault});
}
function applyHash(){var id=decodeURIComponent(location.hash.replace(/^#/,'')).toLowerCase();st.vault=(id==='all'||byId[id])?id:'all';draw()}
function card(i){var v=byId[i.vault];return '<a class="archive-card" style="--vault-color:'+v.color+';--rarity:'+rarities[i.rarity]+'" href="wiki.html#/'+encodeURIComponent(i.id)+'" aria-label="'+esc(i.name)+', '+esc(i.rarity)+', '+esc(v.name)+'"><div class="archive-card-top"><span class="rarity-token">'+esc(i.rarity)+'</span><span class="archive-status '+(i.status==='ready'?'ready':'')+'">'+(i.status==='ready'?'АРТ ГОТОВ':'В ПРОЦЕССЕ')+'</span></div><div class="archive-card-image"><img src="'+esc(i.preview)+'" alt="'+esc(i.name)+'" loading="lazy" decoding="async"></div><div class="archive-card-bottom"><div><h4>'+esc(i.name)+'</h4><p>'+esc(v.name)+'</p></div><span class="card-arrow" aria-hidden="true">↗</span></div></a>'}
function group(v,entries,all){return '<section class="archive-collection" style="--vault-color:'+v.color+'"><div class="archive-collection-heading"><div><span class="arch-label">'+esc(v.kicker)+' / '+entries.length+' предметов</span><h3>'+esc(v.name)+'</h3></div>'+(all?'<a href="#'+v.id+'">Открыть Vault ↗</a>':'')+'</div><div class="archive-grid">'+entries.map(card).join('')+'</div></section>'}
function draw(){
menu.querySelectorAll('.vault-choice').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.vault===st.vault))});
var selected=byId[st.vault], filtered=items.filter(function(i){if(st.vault!=='all'&&i.vault!==st.vault)return false;if(st.status!=='all'&&i.status!==st.status)return false;if(st.rarity!=='all'&&i.rarity!==st.rarity)return false;if(st.query&&![i.name,byId[i.vault].name,i.rarity].join(' ').toLocaleLowerCase().includes(st.query))return false;return true});
head.style.setProperty('--vault-color',selected?selected.color:'#d7b391');
head.innerHTML='<div><span class="arch-caption">'+(selected?esc(selected.kicker):'ALL COLLECTIONS / 8 VAULTS')+'</span><h2>'+(selected?esc(selected.name):'Все предметы')+'</h2><p class="arch-desc">'+(selected?esc(selected.description):'Выбери Vault слева или используй поиск по всему архиву.')+'</p></div><div class="arch-count">'+filtered.length+' <span style="font-size:12px;color:#8f9ca2">/ '+(selected?count(selected.id):items.length)+'</span></div>';
results.innerHTML=filtered.length?vaults.map(function(v){var a=filtered.filter(function(i){return i.vault===v.id});return a.length?group(v,a,st.vault==='all'):''}).join(''):'<div class="archive-empty">Ничего не найдено. Попробуй изменить запрос или фильтры.</div>';
document.title=(selected?selected.name+' — ':'')+'Архив оружия VAULT ZERO';
}
setupMenu();window.addEventListener('hashchange',applyHash);
document.getElementById('itemSearch').addEventListener('input',function(e){st.query=e.target.value.trim().toLocaleLowerCase();draw()});
document.getElementById('statusFilter').addEventListener('change',function(e){st.status=e.target.value;draw()});
document.getElementById('rarityFilter').addEventListener('change',function(e){st.rarity=e.target.value;draw()});
applyHash();
})();