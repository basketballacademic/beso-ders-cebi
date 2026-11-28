const C='ders-cebi-v12';const F=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==SC).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const SC='ders-cebi-ses-v3';
async function audio(r){const c=await caches.open(SC);let m=await c.match(r.url);
 if(!m){let res;try{res=await fetch(r.url)}catch(err){return new Response('',{status:504})}if(!res.ok)return res;await c.put(r.url,res.clone());m=res}
 const range=r.headers.get('range');if(!range)return m;const buf=await m.clone().arrayBuffer();const L=buf.byteLength;const g=/bytes=(\d*)-(\d*)/.exec(range)||[];let a=g[1]?+g[1]:0,b=g[2]?+g[2]:L-1;if(!g[1]&&g[2]){a=L-(+g[2]);b=L-1}b=Math.min(b,L-1);
 return new Response(buf.slice(a,b+1),{status:206,headers:{'Content-Type':m.headers.get('Content-Type')||'audio/mpeg','Content-Range':'bytes '+a+'-'+b+'/'+L,'Content-Length':String(b-a+1),'Accept-Ranges':'bytes'}})}
const put=(req,res)=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(req,cp)).catch(()=>{})}return res};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;if(new URL(r.url).pathname.includes('/ses/')){e.respondWith(audio(r));return}
 const html=r.mode==='navigate'||(r.headers.get('accept')||'').includes('text/html');
 if(html){e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>put(r,res)).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./index.html'))));return}
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>put(r,res))))});
