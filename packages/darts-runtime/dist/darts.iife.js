"use strict";var __tack_iife__=(()=>{var D=null,k=null,M=null,E=null,oe=80,At=`
  :host { all: initial; }
  *, *::before, *::after { box-sizing: border-box; }

  @keyframes tack-slide-up {
    from { transform: translateX(-50%) translateY(120%); opacity: 0; }
    to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
  }

  @keyframes tack-slide-in-right {
    from { transform: translateX(120%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }

  #tack-toolbar {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: #1a1a2e;
    border: 1px solid rgba(160, 130, 255, 0.25);
    border-radius: 999px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.35);
    font-family: system-ui, -apple-system, sans-serif;
    z-index: 9000;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
  }

  #tack-panel {
    position: fixed;
    top: 16px;
    right: 16px;
    bottom: 16px;
    width: min(340px, calc(100vw - 32px));
    background: rgba(18, 16, 38, 0.88);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    border: 1px solid rgba(160, 130, 255, 0.18);
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.4);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: system-ui, -apple-system, sans-serif;
    color: #e0d7ff;
    z-index: 9000;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
  }

  /* Tooltip for toolbar buttons with title attribute */
  .tack-toolbar-icon, .tack-has-tip {
    position: relative;
  }
  .tack-toolbar-icon::after, .tack-has-tip::after {
    content: attr(title);
    position: absolute;
    bottom: calc(100% + 16px);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(14, 12, 30, 0.97);
    color: #e0d7ff;
    font-size: 11px;
    font-family: system-ui, -apple-system, sans-serif;
    font-weight: 500;
    white-space: nowrap;
    padding: 5px 10px;
    border-radius: 7px;
    border: 1px solid rgba(160,130,255,0.18);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s, transform 0.15s;
    transform: translateX(-50%) translateY(4px);
  }
  .tack-toolbar-icon:hover::after, .tack-has-tip:hover::after {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  button {
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 600;
    font-family: system-ui, -apple-system, sans-serif;
    transition: background 0.15s;
    white-space: nowrap;
  }

  .btn-primary {
    background: #7c5cbf;
    color: #fff;
  }
  .btn-primary:hover { background: #8f6fd4; }

  .btn-ghost {
    color: #c4b5fd;
    padding: 8px;
  }
  .btn-ghost:hover { background: rgba(160,130,255,0.15); }

  .btn-arm {
    background: rgba(160,130,255,0.12);
    color: #c4b5fd;
    border: 1px solid rgba(160,130,255,0.25);
  }
  .btn-arm.is-armed {
    background: #7c5cbf;
    color: #fff;
    box-shadow: 0 0 0 2px rgba(124,92,191,0.4);
  }
  .btn-arm:hover { background: rgba(160,130,255,0.22); }

  .panel-header {
    padding: 14px 16px 10px;
    border-bottom: 1px solid rgba(160,130,255,0.15);
    font-size: 13px;
    font-weight: 700;
    color: #c4b5fd;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .panel-collapse-btn {
    all: unset;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8878b8;
    font-size: 18px;
    line-height: 1;
    border-radius: 6px;
    border: 1px solid rgba(160,130,255,0.18);
    background: rgba(160,130,255,0.08);
    transition: color 0.15s, background 0.15s, border-color 0.15s;
    flex-shrink: 0;
    gap: 0;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .panel-collapse-btn:hover {
    color: #e0d7ff;
    background: rgba(160,130,255,0.18);
    border-color: rgba(160,130,255,0.35);
  }

  #tack-panel.is-collapsed {
    transform: translateX(calc(100% + 20px));
  }
  #tack-panel-tab {
    position: fixed;
    right: 0;
    top: 80px; /* JS sets this; CSS value is just the initial fallback */
    transform: translateX(100%);
    background: #1a1a2e;
    border: 1px solid rgba(160, 130, 255, 0.25);
    border-right: none;
    border-radius: 8px 0 0 8px;
    padding: 12px 6px;
    cursor: grab;
    color: #c4b5fd;
    font-size: 12px;
    font-family: system-ui, -apple-system, sans-serif;
    writing-mode: vertical-rl;
    letter-spacing: 0.05em;
    z-index: 9001;
    gap: 0;
    user-select: none;
    /* Elastic snap-back on hover-release (base transition = out-transition) */
    transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
                padding-left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
                background 0.2s ease;
  }
  #tack-panel-tab.is-visible { transform: translateX(0); }
  #tack-panel-tab.is-visible:active { cursor: grabbing; }
  /* Grow leftward via padding \u2014 no gap, background stays the same dark colour */
  #tack-panel-tab.is-visible:hover {
    padding-left: 12px;
    transition: padding-left 0.15s ease;
  }

  .panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .comment-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(160,130,255,0.15);
    border-radius: 12px;
    padding: 12px;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .comment-card:hover { border-color: rgba(160,130,255,0.4); }
  .comment-card.is-focused { border-color: #7c5cbf; background: rgba(124,92,191,0.1); }

  .comment-num {
    font-size: 11px;
    font-weight: 800;
    color: #7c5cbf;
    margin-bottom: 4px;
  }
  .comment-text {
    font-size: 12px;
    color: #d1c4f9;
    line-height: 1.5;
    margin-bottom: 6px;
  }
  .comment-meta {
    font-size: 10px;
    color: #8878b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .status-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 999px;
    margin-left: 6px;
  }
  .status-badge.open { background: rgba(251,191,36,0.15); color: #fbbf24; }
  .status-badge.resolved { background: rgba(52,211,153,0.15); color: #34d399; }
  .status-badge.orphaned { background: rgba(248,113,113,0.15); color: #f87171; }

  .orphan-section {
    margin-top: 8px;
    border-top: 1px dashed rgba(248,113,113,0.3);
    padding-top: 8px;
  }
  .orphan-label {
    font-size: 10px;
    font-weight: 700;
    color: #f87171;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }

  .filter-bar {
    padding: 8px 12px;
    border-bottom: 1px solid rgba(160,130,255,0.1);
    display: flex;
    gap: 6px;
  }
  .filter-chip {
    all: unset;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid rgba(160,130,255,0.2);
    color: #8878b8;
    transition: all 0.12s;
  }
  .filter-chip.active { background: rgba(124,92,191,0.2); color: #c4b5fd; border-color: rgba(124,92,191,0.4); }

  .storage-banner {
    background: rgba(248,113,113,0.1);
    border-bottom: 1px solid rgba(248,113,113,0.3);
    padding: 8px 14px;
    font-size: 11px;
    color: #f87171;
    font-weight: 600;
    text-align: center;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9500;
  }
  .modal-backdrop.show { display: flex; }

  .modal {
    background: #1e1b3a;
    border: 1px solid rgba(160,130,255,0.25);
    border-radius: 16px;
    padding: 20px;
    width: min(420px, calc(100vw - 32px));
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 20px 48px rgba(0,0,0,0.5);
    font-family: system-ui, -apple-system, sans-serif;
  }
  .modal h3 { margin: 0; font-size: 15px; font-weight: 700; color: #e0d7ff; font-family: system-ui, -apple-system, sans-serif; }
  .modal label { font-size: 12px; font-weight: 600; color: #a89bcc; font-family: system-ui, -apple-system, sans-serif; }
  .modal-reviewer-line { font-size: 11px; color: #8878b8; }
  .modal-reviewer-line button { all: unset; cursor: pointer; color: #c4b5fd; font-size: 11px; margin-left: 4px; text-decoration: underline; }
  .modal input, .modal textarea {
    all: unset;
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(160,130,255,0.25);
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 13px;
    color: #e0d7ff;
    font-family: system-ui, sans-serif;
    box-sizing: border-box;
  }
  .modal textarea { min-height: 80px; resize: vertical; }
  .modal input:focus, .modal textarea:focus {
    outline: 2px solid #7c5cbf;
  }
  .modal-actions { display: flex; gap: 8px; justify-content: flex-end; }

  /* \u2500\u2500 Comment read popover \u2500\u2500 */
  #tack-comment-popover {
    position: fixed;
    z-index: 9800;
    width: 280px;
    background: #1e1b3a;
    border: 1px solid rgba(160,130,255,0.25);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.55);
    font-family: system-ui, -apple-system, sans-serif;
    overflow: visible;
    opacity: 0;
    transform: scale(0.93) translateY(6px);
    transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
  }
  #tack-comment-popover.is-open {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: auto;
  }
  /* Arrow pointing toward the pin \u2014 up by default, down when popover is above pin */
  #tack-comment-popover::before,
  #tack-comment-popover::after {
    content: '';
    position: absolute;
    top: -9px;
    bottom: auto;
    left: var(--tack-arrow-x, 20px);
    transform: translateX(-50%);
    width: 0; height: 0;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 9px solid rgba(160,130,255,0.3);
    border-top: none;
    pointer-events: none;
  }
  #tack-comment-popover::after {
    top: -7px;
    border-left-width: 7px;
    border-right-width: 7px;
    border-bottom-width: 7px;
    border-bottom-color: #1e1b3a;
  }
  /* Flipped: popover is above the pin, arrow points down */
  #tack-comment-popover.is-flipped::before {
    top: auto; bottom: -9px;
    border-bottom: none;
    border-top: 9px solid rgba(160,130,255,0.3);
  }
  #tack-comment-popover.is-flipped::after {
    top: auto; bottom: -7px;
    border-bottom: none;
    border-top: 7px solid #1e1b3a;
  }
  .cp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 12px 10px;
    border-bottom: 1px solid rgba(160,130,255,0.12);
  }
  .cp-header-actions { display: flex; gap: 4px; align-items: center; }
  .cp-icon-btn {
    all: unset;
    cursor: pointer;
    width: 28px; height: 28px;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    color: #8878b8;
    transition: background 0.12s, color 0.12s;
  }
  .cp-icon-btn:hover { background: rgba(160,130,255,0.12); color: #c4b5fd; }
  .cp-resolve:hover { color: #34d399; }
  .cp-close:hover { color: #f87171; }
  .cp-body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
  .cp-row { display: flex; gap: 10px; align-items: flex-start; }
  .cp-avatar {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: #fff; letter-spacing: 0.02em;
  }
  .cp-meta { display: flex; flex-direction: column; gap: 1px; }
  .cp-name { font-size: 13px; font-weight: 700; color: #e0d7ff; }
  .cp-time { font-size: 11px; color: #8878b8; }
  .cp-text { font-size: 13px; color: #d1c4f9; line-height: 1.55; white-space: pre-wrap; word-break: break-word; }
  .cp-actions { display: flex; gap: 8px; align-items: center; }
  .cp-link {
    all: unset; cursor: pointer; font-size: 11px; color: #8878b8;
    text-decoration: underline; text-underline-offset: 2px;
    font-family: system-ui, -apple-system, sans-serif;
    transition: color 0.12s;
  }
  .cp-link:hover { color: #c4b5fd; }
  .cp-delete:hover { color: #f87171 !important; }
  .cp-sep { font-size: 11px; color: #4a4460; user-select: none; }

  /* \u2500\u2500 Panel card enter / exit \u2500\u2500 */
  @keyframes tack-card-enter {
    from { opacity: 0; transform: scale(0.96); max-height: 0;     margin-bottom: 0;  padding: 0 12px; }
    to   { opacity: 1; transform: scale(1);    max-height: 300px; margin-bottom: 8px; padding: 12px; }
  }
  @keyframes tack-card-exit {
    from { opacity: 1; transform: scale(1);    max-height: 300px; margin-bottom: 8px; padding: 12px; }
    to   { opacity: 0; transform: scale(0.96); max-height: 0;     margin-bottom: 0;  padding: 0; }
  }
  .comment-card.is-new {
    animation: tack-card-enter 0.28s ease-out both;
    overflow: hidden;
  }
  .comment-card.is-deleting {
    animation: tack-card-exit 0.22s ease-out forwards;
    overflow: hidden;
    pointer-events: none;
  }

  /* \u2500\u2500 Panel card flash \u2500\u2500 */
  @keyframes tack-card-flash {
    0%   { background: rgba(124, 92, 191, 0.32); border-color: rgba(124,92,191,0.6); }
    70%  { background: rgba(124, 92, 191, 0.10); border-color: rgba(124,92,191,0.3); }
    100% { background: rgba(255,255,255,0.04);   border-color: rgba(160,130,255,0.15); }
  }
  .comment-card.is-flash { animation: tack-card-flash 1.6s ease-out forwards; }
`;function He(){let e=document.createElement("div");e.className="tack-shadow-host",e.setAttribute("data-tack-ui",""),e.style.position="relative",e.style.zIndex="2147483000",document.body.appendChild(e),["pointerdown","mousedown","click"].forEach(n=>{e.addEventListener(n,o=>o.stopPropagation())}),D=e.attachShadow({mode:"closed"});let t=document.createElement("style");t.textContent=At,D.appendChild(t),M=document.createElement("div"),M.id="tack-toolbar",M.style.transform="translateX(-50%) translateY(120%)",M.style.opacity="0",D.appendChild(M),k=document.createElement("div"),k.id="tack-panel",k.style.transform="translateX(120%)",k.style.opacity="0",D.appendChild(k),requestAnimationFrame(()=>requestAnimationFrame(()=>{M&&(M.style.transform="",M.style.opacity=""),setTimeout(()=>{k&&!k.classList.contains("is-collapsed")&&(k.style.transform="",k.style.opacity="")},60)})),E=document.createElement("button"),E.id="tack-panel-tab",E.setAttribute("aria-label","Open comments panel"),E.textContent="\u2039 Comments",E.style.top=`${oe}px`,E.addEventListener("pointerdown",n=>{let o=n.clientY,a=oe,r=!1;E.setPointerCapture(n.pointerId);let i=p=>{let h=p.clientY-o;!r&&Math.abs(h)>5&&(r=!0),r&&(oe=Math.max(20,Math.min(a+h,innerHeight-80)),E.style.top=`${oe}px`)},s=p=>{E.removeEventListener("pointermove",i),E.removeEventListener("pointerup",s),r||(p.stopPropagation(),W(!1))};E.addEventListener("pointermove",i),E.addEventListener("pointerup",s)}),D.appendChild(E)}function Ne(){return!!(k!=null&&k.classList.contains("is-collapsed"))}function W(e){!k||!E||(k.classList.toggle("is-collapsed",e),E.classList.toggle("is-visible",e),e||(k.style.removeProperty("transform"),k.style.removeProperty("opacity")))}function j(){if(!D)throw new Error("Shadow host not initialized");return D}function O(){if(!k)throw new Error("Panel not initialized");return k}function ze(){if(!M)throw new Error("Toolbar not initialized");return M}var Re,re=(Re=window.__TACK_CONFIG__)!=null?Re:{},De,Oe,Ie,P={prototypeId:(De=re.prototypeId)!=null?De:"dev-"+location.hostname,prototypeName:(Oe=re.prototypeName)!=null?Oe:document.title||"Prototype",builtAt:(Ie=re.builtAt)!=null?Ie:0,sinkUrl:re.sinkUrl};var _e=`dd:${P.prototypeId}`,ae="local",Y=null,fe=[];function J(){return{schemaVersion:1,prototypeId:P.prototypeId,prototypeName:P.prototypeName,builtAt:P.builtAt,reviewer:null,comments:[]}}function Ht(){try{let e="__tack_probe__";return localStorage.setItem(e,"1"),localStorage.removeItem(e),"local"}catch(e){return"memory"}}function Nt(e){return!e||typeof e!="object"?J():e.schemaVersion===1?e:J()}function je(e){fe.push(e)}function Ye(){if(ae=Ht(),ae==="memory")return fe.forEach(e=>e()),Y||(Y=J(),Y);try{let e=localStorage.getItem(_e);return e?Nt(JSON.parse(e)):J()}catch(e){return J()}}function A(e){if(ae==="memory"){Y=e;return}try{localStorage.setItem(_e,JSON.stringify(e))}catch(t){ae="memory",Y=e,fe.forEach(n=>n())}}function ge(){return"tack-"+Math.random().toString(36).slice(2,9)+Date.now().toString(36)}function Xe(e,t){return e.length<=t?e:e.slice(0,t-1)+"\u2026"}function he(e,t){let n;return(...o)=>{clearTimeout(n),n=setTimeout(()=>e(...o),t)}}function be(e){let t=5381;for(let n=0;n<e.length;n++)t=t*33^e.charCodeAt(n);return t>>>0}function zt(e){let t=e.match(/#.*$/);return t?t[0]:""}function ie(e){if(!e)return!0;let t=zt(e);return t?t===location.hash:!0}var Rt=/^(is-|has-|js-|active|open|closed|selected|focused|hover|hidden|visible|animate|motion|transition)/;function V(e){var t;return(t=window.CSS)!=null&&t.escape?window.CSS.escape(e):e.replace(/[^a-zA-Z0-9_-]/g,"\\$&")}function Dt(e){return Array.from(e.classList).filter(t=>t&&!Rt.test(t)&&!t.startsWith("tack-"))}function Ot(e){var r,i;let t=e.getAttribute("data-testid");if(t)return`[data-testid="${V(t)}"]`;if(e.id)return`#${V(e.id)}`;let n=[],o=e,a=0;for(;o&&o!==document.body&&a<5;){let s=o.tagName.toLowerCase(),p=Dt(o);if(p.length&&(s+=`.${p.slice(0,2).map(V).join(".")}`),o.id){n.unshift(`#${V(o.id)}`);break}let h=o.getAttribute("data-testid");if(h){n.unshift(`[data-testid="${V(h)}"]`);break}Array.from((i=(r=o.parentElement)==null?void 0:r.children)!=null?i:[]).filter(c=>c.tagName===o.tagName).length>1&&(s+=`:nth-child(${Array.from(o.parentElement.children).indexOf(o)+1})`),n.unshift(s),o=o.parentElement,a++}return n.join(" > ")||e.tagName.toLowerCase()}function It(e){if(e===document.body)return"/html/body";let t=[],n=e;for(;n&&n!==document;){let o=1,a=n.previousSibling;for(;a;)a.nodeType===n.nodeType&&a.nodeName===n.nodeName&&o++,a=a.previousSibling;let r=n.nodeType===Node.TEXT_NODE?"text()":n.nodeName.toLowerCase();if(t.unshift(`${r}[${o}]`),n=n.parentNode,!n||n.nodeType!==Node.ELEMENT_NODE)break}return"/"+t.join("/")}function _t(e){try{let n=document.evaluate(e,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;return n instanceof Element?n:null}catch(t){return null}}function xe(e,t,n){var r,i,s,p,h,d;let o,a;if(t!==void 0&&n!==void 0){let c=e.getBoundingClientRect();c.width>0&&c.height>0&&(o=Math.max(0,Math.min(1,(t-c.left)/c.width)),a=Math.max(0,Math.min(1,(n-c.top)/c.height)))}return{cssSelector:Ot(e),xpath:It(e),textSnippet:Xe((p=(s=(r=e.innerText)==null?void 0:r.trim())!=null?s:(i=e.textContent)==null?void 0:i.trim())!=null?p:"",80),pathname:location.pathname+location.search+location.hash,screenState:(h=window.Tack)==null?void 0:h._screenState,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},sourceLocation:(d=e.getAttribute("data-tack-src"))!=null?d:void 0,clickPctX:o,clickPctY:a}}function G(e){var n;try{let o=document.querySelector(e.cssSelector);if(o)return o}catch(o){}let t=_t(e.xpath);if(t)return t;if(e.textSnippet.length>=4){let o=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),a;for(;a=o.nextNode();)if(((n=a.nodeValue)!=null?n:"").includes(e.textSnippet))return a.parentElement}return null}var X=!1,Be=[],qe=[],Fe=[],H=null,N=null,jt=`url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g stroke="rgba(0,0,0,0.45)" stroke-width="2.5" fill="none" stroke-linecap="round"><circle cx="16" cy="16" r="7"/><line x1="16" y1="0" x2="16" y2="8"/><line x1="16" y1="24" x2="16" y2="32"/><line x1="0" y1="16" x2="8" y2="16"/><line x1="24" y1="16" x2="32" y2="16"/></g><g stroke="#c4b5fd" stroke-width="1.5" fill="none" stroke-linecap="round"><circle cx="16" cy="16" r="7"/><line x1="16" y1="0" x2="16" y2="8"/><line x1="16" y1="24" x2="16" y2="32"/><line x1="0" y1="16" x2="8" y2="16"/><line x1="24" y1="16" x2="32" y2="16"/></g><circle cx="16" cy="16" r="1.5" fill="#c4b5fd"/></svg>')}") 16 16, crosshair`;function Yt(){let e=document.createElement("div");return e.className="tack-mode-banner",e.setAttribute("aria-live","polite"),e.textContent="Click any element to pin a comment \xB7 Esc to cancel",Object.assign(e.style,{position:"fixed",bottom:"82px",left:"50%",transform:"translateX(-50%)",zIndex:"2147483000",background:"rgba(26, 26, 46, 0.95)",color:"#e0d7ff",padding:"7px 16px",borderRadius:"999px",fontSize:"12px",fontFamily:"system-ui, -apple-system, sans-serif",fontWeight:"600",border:"1px solid rgba(160, 130, 255, 0.3)",boxShadow:"0 4px 16px rgba(0,0,0,0.4)",whiteSpace:"nowrap",pointerEvents:"none",letterSpacing:"0.01em"}),e}function Xt(){let e=document.createElement("div");return e.setAttribute("data-tack-ui",""),Object.assign(e.style,{position:"fixed",inset:"0",zIndex:"2147482999",cursor:jt}),e.addEventListener("click",t=>{if(!X)return;e.style.display="none";let n=document.elementFromPoint(t.clientX,t.clientY);e.style.display="",!(!n||!ye(n))&&(t.stopPropagation(),Fe.forEach(o=>o(n,t.clientX,t.clientY)))}),e}function ye(e){return e.closest("[data-tack-ignore]")?!1:e.closest("[data-tack-allow]")?!0:!e.closest(".tack-shadow-host, [data-tack-ui]")}function Z(){return X}function Ke(e){Be.push(e)}function Ue(e){qe.push(e)}function We(e){Fe.push(e)}function Q(){X||(X=!0,N=Xt(),document.body.appendChild(N),H=Yt(),document.body.appendChild(H),Be.forEach(e=>e()))}function B(){X&&(X=!1,N!=null&&N.parentNode&&N.parentNode.removeChild(N),N=null,H!=null&&H.parentNode&&H.parentNode.removeChild(H),H=null,qe.forEach(e=>e()))}var Je=`tack-reviewer:${P.prototypeId}`;function Ve(){try{let e=localStorage.getItem(Je);if(!e)return null;let t=JSON.parse(e);if(typeof(t==null?void 0:t.name)=="string"&&t.name)return t}catch(e){}return null}function Ge(e){try{localStorage.setItem(Je,JSON.stringify(e))}catch(t){}}var q=null,ee=null;function Bt(e){if(e.querySelector("#tack-popover-style"))return;let t=document.createElement("style");t.id="tack-popover-style",t.textContent=`
    .tack-popover {
      position: fixed;
      z-index: 9800;
      background: #1e1b3a;
      border: 1px solid rgba(160,130,255,0.3);
      border-radius: 12px;
      padding: 12px;
      width: 280px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      gap: 8px;
      opacity: 0;
      transform: scale(0.92) translateY(6px);
      transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.16,1,0.3,1);
      pointer-events: none;
    }
    .tack-popover.is-open {
      opacity: 1;
      transform: scale(1) translateY(0);
      pointer-events: auto;
    }
    .tack-popover-name {
      font-size: 11px;
      color: #8878b8;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .tack-popover-name button {
      all: unset;
      cursor: pointer;
      color: #c4b5fd;
      font-size: 11px;
      text-decoration: underline;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .tack-popover-row {
      display: flex;
      gap: 6px;
      align-items: flex-end;
    }
    .tack-popover textarea, .tack-popover input[type="text"] {
      all: unset;
      flex: 1;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(160,130,255,0.2);
      border-radius: 8px;
      padding: 9px 10px;
      font-size: 13px;
      color: #e0d7ff;
      font-family: system-ui, -apple-system, sans-serif;
      box-sizing: border-box;
      width: 100%;
      resize: none;
      line-height: 1.45;
    }
    .tack-popover textarea { min-height: 70px; }
    .tack-popover textarea:focus, .tack-popover input[type="text"]:focus {
      outline: 2px solid #7c5cbf;
      border-color: transparent;
    }
    .tack-popover-send {
      all: unset;
      cursor: pointer;
      width: 32px;
      height: 32px;
      min-width: 32px;
      border-radius: 50%;
      background: #7c5cbf;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      transition: background 0.15s, transform 0.1s;
      font-family: system-ui, sans-serif;
    }
    .tack-popover-send:hover { background: #9370e0; }
    .tack-popover-send:active { transform: scale(0.92); }
  `,e.appendChild(t)}function qt(){let e=j();return Bt(e),q||(q=document.createElement("div"),q.className="tack-popover",e.appendChild(q),q)}function Ft(e,t,n){let r=t-140,i=n+16;r=Math.max(12,Math.min(r,innerWidth-280-12)),i+200>innerHeight-12&&(i=n-220),i=Math.max(12,i),e.style.left=`${r}px`,e.style.top=`${i}px`}function ve(e){return new Promise(t=>{var x,v,w,$,C;ee&&(ee(null),ee=null),ee=t;let n=qt(),o=Ve(),a=!!(e!=null&&e.defaultText);if(n.innerHTML="",o!=null&&o.name){let f=document.createElement("div");f.className="tack-popover-name";let l=document.createElement("button");l.textContent="Change",l.addEventListener("click",()=>{r.style.display="",f.style.display="none",r.focus()}),f.innerHTML=`Commenting as <strong>${o.name}</strong>\xA0`,f.appendChild(l),n.appendChild(f)}let r=document.createElement("input");r.type="text",r.placeholder="Your name (required)",r.autocomplete="name",r.value=(x=o==null?void 0:o.name)!=null?x:"",r.style.display=o!=null&&o.name?"none":"",n.appendChild(r);let i=document.createElement("div");i.className="tack-popover-row";let s=document.createElement("textarea");s.placeholder="Add a comment\u2026",s.rows=3,s.value=(v=e==null?void 0:e.defaultText)!=null?v:"";let p=document.createElement("button");p.className="tack-popover-send",p.setAttribute("aria-label",(w=e==null?void 0:e.submitLabel)!=null?w:"Save comment"),p.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z"/></svg>',i.appendChild(s),i.appendChild(p),n.appendChild(i);let h=($=e==null?void 0:e.anchorX)!=null?$:innerWidth/2,d=(C=e==null?void 0:e.anchorY)!=null?C:innerHeight/2;Ft(n,h,d),requestAnimationFrame(()=>n.classList.add("is-open"));let c=f=>{n.classList.remove("is-open"),document.removeEventListener("keydown",g),document.removeEventListener("pointerdown",m,!0),ee=null,t(f)},y=()=>{var S;let f=r.style.display==="none"?(S=o==null?void 0:o.name)!=null?S:"":r.value.trim(),l=s.value.trim();if(!f){r.style.display="",r.style.outline="2px solid #f87171",r.focus();return}if(!l){s.focus();return}r.style.outline="";let b={name:f};Ge(b),c({text:l,reviewer:b})},g=f=>{f.key==="Escape"&&c(null)},m=f=>{let l=j(),b=f.target;!n.contains(b)&&!l.host.contains(b)&&c(null)};s.addEventListener("keydown",f=>{f.stopPropagation(),f.key==="Escape"&&(f.preventDefault(),c(null)),f.key==="Enter"&&!f.shiftKey&&(f.preventDefault(),y())}),r.addEventListener("keydown",f=>{f.stopPropagation(),f.key==="Escape"&&(f.preventDefault(),c(null)),f.key==="Enter"&&!f.shiftKey&&(f.preventDefault(),y())}),p.addEventListener("click",y),document.addEventListener("keydown",g),setTimeout(()=>document.addEventListener("pointerdown",m,!0),100),a||o!=null&&o.name?(s.focus(),a&&s.select()):r.focus()})}var te=new Map,et=[],I=null,Ze=!1,Kt="M13,0 C20.2,0 26,5.8 26,13 C26,18.6 22.6,23.3 17.8,25.3 L13,32 L8.2,25.3 C3.4,23.3 0,18.6 0,13 C0,5.8 5.8,0 13,0 Z";function Ut(){if(Ze)return;Ze=!0;let e=document.createElement("style");e.textContent=`
    @keyframes tack-pin-float-in {
      0%   { opacity: 0;   transform: translateY(-28px) scale(0.55); }
      55%  { opacity: 1;   transform: translateY(5px)   scale(1.08); }
      75%  { transform: translateY(-3px) scale(0.96); }
      90%  { transform: translateY(2px)  scale(1.02); }
      100% { opacity: 1;   transform: translateY(0)    scale(1); }
    }
    .tack-marker.is-floating-in {
      animation: tack-pin-float-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
      animation-delay: var(--tack-float-delay, 0ms);
    }
    /* Lawn-dart drop: rise \u2192 fall \u2192 squash \u2192 light bounce settle */
    @keyframes tack-dart-drop {
      0%   { transform: translateY(0)     scaleX(1)    scaleY(1); }
      20%  { transform: translateY(-24px) scaleX(0.93) scaleY(1.05); }
      50%  { transform: translateY(4px)   scaleX(1.3)  scaleY(0.76); }
      65%  { transform: translateY(-5px)  scaleX(0.97) scaleY(1.05); }
      80%  { transform: translateY(1px)   scaleX(1.02) scaleY(0.98); }
      90%  { transform: translateY(-2px)  scaleX(1)    scaleY(1.01); }
      100% { transform: translateY(0)     scaleX(1)    scaleY(1); }
    }
    .tack-marker.is-dart-drop {
      animation: tack-dart-drop 0.52s cubic-bezier(0.4, 0, 0.2, 1) both;
      transform-origin: bottom center;
    }

    @keyframes tack-ring {
      0%   { transform: scale(1);   opacity: 0.65; }
      100% { transform: scale(2.5); opacity: 0; }
    }
    /* Ring lives on the button (no clip-path), circle matches the circular part of the pin */
    .tack-marker::after {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 26px; height: 26px;
      border-radius: 50%;
      border: 1.5px solid var(--tack-ring-color, rgba(124,92,191,0.7));
      animation: tack-ring 2.4s ease-out infinite;
      animation-delay: var(--tack-pulse-delay, 0s);
      pointer-events: none;
    }
    /* Pin shape lives on the inner span */
    .tack-pin {
      position: absolute;
      top: 0; left: 0;
      width: 26px; height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 6px;
      clip-path: path('${Kt}');
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 3px 10px rgba(0,0,0,0.45);
      pointer-events: none;
    }
  `,document.head.appendChild(e)}function Wt(){return I||(Ut(),I=document.createElement("div"),Object.assign(I.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"2147480000"}),I.setAttribute("data-tack-ui",""),document.body.appendChild(I),I)}function Jt(e){let t=e.parentElement;for(;t&&t!==document.body;){let n=t.getBoundingClientRect();if(n.width>0||n.height>0)return t;t=t.parentElement}return null}function tt(e,t,n){let o=t.getBoundingClientRect();if(!o.width&&!o.height){let a=Jt(t);if(!a)return e.style.visibility="hidden",!1;let r=a.getBoundingClientRect();return e.style.visibility="visible",e.style.display="block",e.style.left=`${r.right-26}px`,e.style.top=`${r.top+r.height/2-16}px`,!0}if(e.style.visibility="visible",e.style.display="block",(n==null?void 0:n.clickPctX)!==void 0&&(n==null?void 0:n.clickPctY)!==void 0){let a=o.left+o.width*n.clickPctX,r=o.top+o.height*n.clickPctY;e.style.left=`${a-13}px`,e.style.top=`${r-32}px`}else e.style.left=`${o.right-26}px`,e.style.top=`${o.top-32}px`;return!1}function Vt(e,t){let n=document.createElement("button");n.className="tack-marker",n.setAttribute("data-tack-ui",""),n.setAttribute("aria-label",`Comment ${t+1}`);let o=e.status==="resolved"?"#34d399":"#7c5cbf",a=e.status==="resolved"?"rgba(52,211,153,0.65)":"rgba(124,92,191,0.65)",r=(Math.random()*3.5).toFixed(2);Object.assign(n.style,{position:"absolute",width:"26px",height:"32px",background:"transparent",border:"none",padding:"0",cursor:"pointer",pointerEvents:"auto",zIndex:"2147480001","--tack-ring-color":a,"--tack-pulse-delay":`${r}s`});let i=document.createElement("span");return i.className="tack-pin",i.textContent=String(t+1),i.style.background=o,n.appendChild(i),Zt(n,e.id),n}var nt=[],Gt=6;function Zt(e,t){let n=0,o=0,a=!1,r="",i="";e.addEventListener("pointerdown",s=>{if(s.button!==0)return;n=s.clientX,o=s.clientY,r=e.style.left,i=e.style.top,a=!1;let p=d=>{let c=d.clientX-n,y=d.clientY-o;!a&&Math.hypot(c,y)>Gt&&(a=!0,e.setPointerCapture(d.pointerId),e.style.cursor="grabbing",e.style.transition="none",e.style.opacity="1",e.style.pointerEvents="auto"),a&&(e.style.left=`${parseFloat(r)+(d.clientX-n)}px`,e.style.top=`${parseFloat(i)+(d.clientY-o)}px`)},h=d=>{if(document.removeEventListener("pointermove",p),document.removeEventListener("pointerup",h),e.style.cursor="pointer",e.style.transition="",a){a=!1;let c=parseFloat(e.style.left)+13,y=parseFloat(e.style.top)+32;nt.forEach(g=>g(t,c,y))}else et.forEach(c=>c(t))};document.addEventListener("pointermove",p),document.addEventListener("pointerup",h)})}function Qt(e,t){let n=e.querySelector(".tack-pin"),o=t==="resolved"?"#34d399":"#7c5cbf",a=t==="resolved"?"rgba(52,211,153,0.65)":"rgba(124,92,191,0.65)";n&&(n.style.background=o),e.style.setProperty("--tack-ring-color",a)}function ot(e){et.push(e)}function _(e){return te.get(e)}function rt(e){nt.push(e)}function F(e,t,n,o){let a=Wt();ke(e.id);let r=Vt(e,n);tt(r,t,e.anchorData),o!==void 0&&(r.style.setProperty("--tack-float-delay",`${o}ms`),r.classList.add("is-floating-in"),setTimeout(()=>r.classList.remove("is-floating-in"),o+700)),a.appendChild(r),te.set(e.id,r)}function ke(e){let t=te.get(e);t!=null&&t.parentNode&&t.parentNode.removeChild(t),te.delete(e)}function en(e){e.style.transition="opacity 0.08s ease",e.style.opacity="0",e.style.pointerEvents="none"}function Qe(e){e.style.display==="none"&&(e.style.display="block"),e.style.transition="opacity 0.3s ease",e.style.opacity="1",e.style.pointerEvents="auto"}function ne(e,t){e.forEach(n=>{let o=te.get(n.id);if(!ie(n.anchorData.pathname)){o&&en(o);return}let a=t.get(n.id);if(!o)return;if(!a){Qe(o);return}let r=tt(o,a,n.anchorData);Qt(o,n.status),r?(o.style.transition="opacity 0.3s ease",o.style.opacity="0.4",o.style.pointerEvents="auto"):Qe(o)})}function st(){let e=O();if(e.querySelector(".storage-banner"))return;let n=document.createElement("div");n.className="storage-banner",n.textContent="Your comments won't survive a refresh. Send them before you close this tab.",e.prepend(n)}function at(e){var t,n;return e.anchorData.pathname?(n=(t=e.anchorData.pathname.match(/#.*$/))==null?void 0:t[0])!=null?n:e.anchorData.pathname:""}var lt=[{bg:"rgba(255,255,255,0.04)",accent:"rgba(124,92,191,0.55)"},{bg:"rgba(59,130,246,0.07)",accent:"rgba(99,130,246,0.60)"},{bg:"rgba(20,184,166,0.07)",accent:"rgba(20,184,166,0.60)"},{bg:"rgba(234,179,8,0.06)",accent:"rgba(234,179,8,0.55)"},{bg:"rgba(249,115,22,0.06)",accent:"rgba(249,115,22,0.50)"}];function Ee(e,t,n,o,a,r,i){let s=O(),p=s.querySelector(".storage-banner");s.innerHTML="",p&&s.appendChild(p);let h=document.createElement("div");h.className="panel-header";let d=document.createElement("button");d.className="panel-collapse-btn",d.setAttribute("aria-label","Close panel"),d.setAttribute("title","Close panel"),d.innerHTML="\u203A",d.addEventListener("click",()=>W(!0)),h.innerHTML=`<span>Comments (${e.filter(l=>l.anchorStatus!=="orphaned").length})</span>`,h.appendChild(d),s.appendChild(h);let c=document.createElement("div");c.className="filter-bar",["all","open","resolved"].forEach(l=>{let b=document.createElement("button");b.className=`filter-chip${o===l?" active":""}`,b.textContent=l.charAt(0).toUpperCase()+l.slice(1),b.addEventListener("click",()=>{Ee(e,t,n,l)}),c.appendChild(b)}),s.appendChild(c);let y=[...e].sort((l,b)=>l.createdAt-b.createdAt),g=new Map(y.map((l,b)=>[l.id,b+1])),m=new Map;e.forEach(l=>{let b=at(l);m.has(b)||m.set(b,m.size)});let x=m.size>1,v=l=>{var b;return x?((b=m.get(at(l)))!=null?b:0)%lt.length:-1},w=document.createElement("div");w.className="panel-body";let $=[...e].sort((l,b)=>b.createdAt-l.createdAt),C=$.filter(l=>l.anchorStatus!=="orphaned"&&(o==="all"||l.status===o)),f=$.filter(l=>l.anchorStatus==="orphaned");if(C.forEach(l=>{var S;let b=it(l,(S=g.get(l.id))!=null?S:1,v(l),t,n,a,r);l.id===i&&b.classList.add("is-new"),w.appendChild(b)}),f.length){let l=document.createElement("div");l.className="orphan-section";let b=document.createElement("div");b.className="orphan-label",b.textContent=`Orphaned comments (${f.length})`,l.appendChild(b),f.forEach(S=>{var Ae;return l.appendChild(it(S,(Ae=g.get(S.id))!=null?Ae:1,v(S),t,n,a,r))}),w.appendChild(l)}if(!C.length&&!f.length){let l=document.createElement("div");l.style.cssText="color: #8878b8; font-size: 12px; padding: 20px; text-align: center;",l.textContent='No comments yet. Click "Comment" and then click any element.',w.appendChild(l)}s.appendChild(w)}var we="all: unset; cursor: pointer; font-size: 10px; color: #8878b8; text-decoration: underline; text-underline-offset: 2px;";function it(e,t,n,o,a,r,i){let s=document.createElement("div");if(s.className="comment-card",s.dataset.commentId=e.id,n>=0){let x=lt[n];s.style.background=x.bg,s.style.borderLeft=`3px solid ${x.accent}`}let p=document.createElement("div");p.className="comment-num",p.innerHTML=`#${t} <span class="status-badge ${e.anchorStatus==="orphaned"?"orphaned":e.status}">${e.anchorStatus==="orphaned"?"orphaned":e.status}</span>`;let h=document.createElement("div");h.className="comment-text",h.textContent=e.text;let d=document.createElement("div");d.className="comment-meta";let c=new Date(e.createdAt),y=c.toLocaleDateString(void 0,{month:"short",day:"numeric"}),g=c.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});d.textContent=`${e.reviewer.name} \xB7 ${y} ${g}`;let m=document.createElement("div");if(m.style.cssText="display: flex; gap: 10px; margin-top: 6px; align-items: center;",e.anchorStatus!=="orphaned"){let x=document.createElement("button");x.style.cssText=we,x.textContent=e.status==="open"?"Mark resolved":"Reopen",x.addEventListener("click",v=>{v.stopPropagation(),a(e.id)}),m.appendChild(x)}if(r){let x=document.createElement("span");x.style.cssText="color: #4a4460; font-size: 10px; user-select: none;",x.textContent="\xB7";let v=document.createElement("button");v.style.cssText=we,v.textContent="Edit",v.addEventListener("click",w=>{w.stopPropagation(),r(e.id)}),m.appendChild(x),m.appendChild(v)}if(i){let x=document.createElement("span");x.style.cssText="color: #4a4460; font-size: 10px; user-select: none;",x.textContent="\xB7";let v=document.createElement("button");v.style.cssText=we+" color: #f87171;",v.textContent="Delete",v.addEventListener("click",w=>{w.stopPropagation(),i(e.id)}),m.appendChild(x),m.appendChild(v)}return s.appendChild(p),s.appendChild(h),s.appendChild(d),s.appendChild(m),s.addEventListener("click",()=>o(e.id)),s}function ct(e){let t=O();t.querySelectorAll(".comment-card").forEach(o=>o.classList.remove("is-focused"));let n=t.querySelector(`[data-comment-id="${e}"]`);n&&(n.classList.add("is-focused"),n.scrollIntoView({behavior:"smooth",block:"nearest"}))}function dt(e){let n=O().querySelector(`[data-comment-id="${e}"]`);n&&(n.classList.remove("is-flash"),n.offsetWidth,n.classList.add("is-flash"),n.scrollIntoView({behavior:"smooth",block:"nearest"}),setTimeout(()=>n.classList.remove("is-flash"),1700))}var K={pin:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>',send:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',copy:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',eye:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',upload:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>'};var se=null,le=null,ce=null,pt=!1;function mt(e){se=e}function ut(e){le=e}function ft(e){ce=e}function de(e){let t=ze(),n=Z();if(!pt){let a=document.createElement("input");a.type="file",a.accept=".json,application/json",a.style.display="none",a.setAttribute("data-tack-ui",""),a.addEventListener("change",()=>{var r;(r=a.files)!=null&&r[0]&&(ce==null||ce(a.files[0]),a.value="")}),document.body.appendChild(a),t.innerHTML=`
      <button class="btn-arm${n?" is-armed":""}" id="tack-arm-btn" aria-label="${n?"Disarm comment mode":"Add comment"}" title="Add a comment (C)">
        ${K.pin} ${n?"Cancel":"Comment"}
      </button>
      <button class="btn-ghost tack-toolbar-icon" id="tack-import-btn" aria-label="Import feedback" title="Import feedback JSON">
        ${K.upload}
      </button>
      <button class="btn-ghost tack-has-tip" id="tack-send-btn" aria-label="Export feedback" title="Export feedback \u2014 saves JSON to Downloads">
        ${K.send} Export feedback
      </button>
      <button class="btn-ghost tack-toolbar-icon" id="tack-presenter-btn" aria-label="Hide/show overlay" title="Hide/show overlay (Shift+C)">
        ${K.eye}
      </button>
    `,t.querySelector("#tack-arm-btn").addEventListener("click",r=>{r.stopPropagation(),Z()?B():Q()}),t.querySelector("#tack-import-btn").addEventListener("click",r=>{r.stopPropagation(),a.click()}),t.querySelector("#tack-send-btn").addEventListener("click",r=>{r.stopPropagation(),se==null||se()}),t.querySelector("#tack-presenter-btn").addEventListener("click",r=>{r.stopPropagation(),le==null||le()}),pt=!0}let o=t.querySelector("#tack-arm-btn");o.classList.toggle("is-armed",n),o.setAttribute("aria-label",n?"Disarm comment mode":"Add comment"),o.innerHTML=`${K.pin} ${n?"Cancel":"Comment"}`}function Ce(e){var s,p;let t=(p=(s=e.reviewer)==null?void 0:s.name)!=null?p:"reviewer",n=new Date().toISOString().slice(0,10),o=`design-darts-${P.prototypeName.replace(/[^a-z0-9]/gi,"-")}-${t.replace(/\s+/g,"-")}-${n}.json`,a=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),r=URL.createObjectURL(a),i=document.createElement("a");i.href=r,i.download=o,i.click(),URL.revokeObjectURL(r)}async function tn(e){let t=P.sinkUrl;if(!t)return"failed";try{return(await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).ok?"sent":"failed"}catch(n){return"failed"}}async function gt(e,t){Ce(e),t("Feedback saved to Downloads \u2193"),P.sinkUrl&&await tn(e)==="failed"&&t("POST failed \u2014 check your connection.")}var ht=null,bt=null,Se=null,Le=null,pe=null,nn=he(()=>{if(!(!Se||!Le))for(let e of Se()){let t=G(e.anchorData);t&&Le(e.id,t)}},300),on=he(()=>{pe==null||pe()},120);function xt(e,t,n){Se=e,Le=t,pe=n,ht=new MutationObserver(()=>nn()),ht.observe(document.body,{childList:!0,subtree:!0}),bt=new MutationObserver(o=>{o.some(r=>{var s;let i=r.target;return!((s=i.closest)!=null&&s.call(i,"[data-tack-ui]"))})&&on()}),bt.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class","hidden","open","aria-hidden"]})}function yt(e,t,n){document.addEventListener("keydown",o=>{var i;let a=o.composedPath()[0],r=(i=a==null?void 0:a.tagName)!=null?i:o.target.tagName;if(!(r==="INPUT"||r==="TEXTAREA"||r==="SELECT")&&!(a!=null&&a.isContentEditable)){if(o.shiftKey&&(o.key==="C"||o.key==="c")){o.preventDefault(),n();return}(o.key==="c"||o.key==="C")&&(o.preventDefault(),e()),o.key==="Escape"&&t()}})}function vt(){return new URLSearchParams(location.search).get("comments")==="off"}function Te(e){let t=document.querySelector(".tack-shadow-host");t&&(t.style.display=e?"none":""),document.querySelectorAll("[data-tack-ui]").forEach(n=>{n.style.display=e?"none":""})}function kt(e,t){let n=location.hash;if(!n.startsWith("#tack-"))return;let o=parseInt(n.slice(6),10);if(isNaN(o)||o<1||o>e.length)return;let a=e[o-1];a&&setTimeout(()=>t(a.id),300)}var z=null;function rn(e){return e.split(" ").map(t=>t[0]).join("").slice(0,2).toUpperCase()}function an(e){let t=Date.now()-e;return t<6e4?"Just now":t<36e5?`${Math.floor(t/6e4)}m ago`:t<864e5?`${Math.floor(t/36e5)}h ago`:new Date(e).toLocaleDateString(void 0,{month:"short",day:"numeric"})}function sn(){let e=j();return z||(z=document.createElement("div"),z.id="tack-comment-popover",e.appendChild(z)),z}var ln=24;function cn(e,t,n){let r=t-ln,i=n+8;r=Math.max(12,Math.min(r,innerWidth-280-12));let s=i+250>innerHeight-12;s&&(i=n-260),i=Math.max(12,i),e.style.left=`${r}px`,e.style.top=`${i}px`;let p=Math.max(16,Math.min(t-r,264));e.style.setProperty("--tack-arrow-x",`${p}px`),e.classList.toggle("is-flipped",s)}function wt(e,t,n,o){let a=sn(),r=e.anchorStatus==="orphaned"?"#6b6480":e.status==="resolved"?"#2ea87e":"#7c5cbf",i=new Date(e.createdAt),s=i.toLocaleDateString(void 0,{month:"short",day:"numeric"}),p=i.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"}),h=`${s} at ${p}`;a.innerHTML=`
    <div class="cp-header">
      <div class="cp-row">
        <div class="cp-avatar" style="background:${r}">${rn(e.reviewer.name)}</div>
        <div class="cp-meta">
          <span class="cp-name">${e.reviewer.name}</span>
          <span class="cp-time" title="${h}">${an(e.createdAt)}</span>
        </div>
      </div>
      <div class="cp-header-actions">
        <button class="cp-icon-btn cp-resolve" title="${e.status==="open"?"Mark resolved":"Reopen"}">
          ${e.status==="open"?'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>'}
        </button>
        <button class="cp-icon-btn cp-close" title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
    <div class="cp-body">
      <div class="cp-text">${e.text.replace(/\n/g,"<br>")}</div>
      <div class="cp-actions">
        <button class="cp-link cp-edit">Edit</button>
        <span class="cp-sep">\xB7</span>
        <button class="cp-link cp-delete">Delete</button>
      </div>
    </div>
  `,cn(a,t,n),requestAnimationFrame(()=>a.classList.add("is-open"));let d=()=>{a.classList.remove("is-open"),document.removeEventListener("pointerdown",c,!0),document.removeEventListener("keydown",y),o.onClose()};a.querySelector(".cp-close").addEventListener("click",d),a.querySelector(".cp-resolve").addEventListener("click",()=>{o.onToggleStatus(e.id),d()}),a.querySelector(".cp-edit").addEventListener("click",()=>{o.onEdit(e.id),d()}),a.querySelector(".cp-delete").addEventListener("click",()=>{o.onDelete(e.id),d()});let c=g=>{let m=j().host;g.composedPath().includes(m)||d()},y=g=>{g.key==="Escape"&&d()};setTimeout(()=>{document.addEventListener("pointerdown",c,!0),document.addEventListener("keydown",y)},120)}function Et(){z==null||z.classList.remove("is-open")}var u,L=new Map,Pe,dn="all",me=!1,Me,U=null;function pn(){if(document.getElementById("tack-toast-styles"))return;let e=document.createElement("style");e.id="tack-toast-styles",e.textContent=`
    @keyframes tack-icon-pop {
      0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
      65%  { transform: scale(1.35) rotate(6deg);  opacity: 1; }
      100% { transform: scale(1)   rotate(0deg);   opacity: 1; }
    }
    .tack-import-toast { display: flex; align-items: center; gap: 10px; }
    .tack-import-toast .ti-icon {
      width: 22px; height: 22px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 900; flex-shrink: 0;
      animation: tack-icon-pop 0.45s cubic-bezier(0.22,1,0.36,1) both;
    }
    .tack-import-toast .ti-msg { font-size: 12px; font-weight: 600; white-space: nowrap; }
  `,document.head.appendChild(e)}function Tt(e){var n;(n=document.querySelector(".tack-toast"))==null||n.remove(),U&&clearTimeout(U);let t=document.createElement("div");t.className="tack-toast",t.setAttribute("data-tack-ui",""),t.textContent=e,Object.assign(t.style,{position:"fixed",bottom:"80px",left:"50%",transform:"translateX(-50%) translateY(12px)",opacity:"0",zIndex:"2147483000",background:"rgba(26, 26, 46, 0.95)",color:"#e0d7ff",fontSize:"12px",fontFamily:"system-ui, -apple-system, sans-serif",padding:"8px 18px",borderRadius:"999px",border:"1px solid rgba(160,130,255,0.25)",boxShadow:"0 4px 16px rgba(0,0,0,0.4)",pointerEvents:"none",whiteSpace:"nowrap",transition:"transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease"}),document.body.appendChild(t),requestAnimationFrame(()=>{t.style.transform="translateX(-50%) translateY(0)",t.style.opacity="1"}),U=setTimeout(()=>{t.style.transform="translateX(-50%) translateY(12px)",t.style.opacity="0",setTimeout(()=>t.remove(),300)},2500)}function R(e,t){var a;pn(),(a=document.querySelector(".tack-toast"))==null||a.remove(),U&&clearTimeout(U);let n={success:{icon:"\u2713",iconBg:"#34d399",iconColor:"#022c22",border:"rgba(52,211,153,0.4)",bg:"rgba(6,46,32,0.92)",glow:"rgba(52,211,153,0.2)"},partial:{icon:"\u2193",iconBg:"#fbbf24",iconColor:"#1c1100",border:"rgba(251,191,36,0.4)",bg:"rgba(28,20,0,0.92)",glow:"rgba(251,191,36,0.2)"},error:{icon:"\u2715",iconBg:"#f87171",iconColor:"#1a0000",border:"rgba(248,113,113,0.4)",bg:"rgba(30,8,8,0.92)",glow:"rgba(248,113,113,0.2)"},dupe:{icon:"\u21BA",iconBg:"#8878b8",iconColor:"#1a1a2e",border:"rgba(160,130,255,0.3)",bg:"rgba(26,26,46,0.95)",glow:"rgba(124,92,191,0.15)"}}[e],o=document.createElement("div");o.className="tack-toast tack-import-toast",o.setAttribute("data-tack-ui",""),o.innerHTML=`
    <span class="ti-icon" style="background:${n.iconBg};color:${n.iconColor}">${n.icon}</span>
    <span class="ti-msg">${t}</span>
  `,Object.assign(o.style,{position:"fixed",bottom:"80px",left:"50%",transform:"translateX(-50%) translateY(20px) scale(0.88)",opacity:"0",zIndex:"2147483000",background:n.bg,color:"#e0d7ff",fontFamily:"system-ui, -apple-system, sans-serif",padding:"8px 14px 8px 10px",borderRadius:"999px",border:`1px solid ${n.border}`,boxShadow:`0 4px 24px rgba(0,0,0,0.5), 0 0 0 4px ${n.glow}`,pointerEvents:"none",transition:"transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease"}),document.body.appendChild(o),requestAnimationFrame(()=>requestAnimationFrame(()=>{o.style.transform="translateX(-50%) translateY(0) scale(1)",o.style.opacity="1"})),U=setTimeout(()=>{o.style.transform="translateX(-50%) translateY(12px) scale(0.92)",o.style.opacity="0",setTimeout(()=>o.remove(),400)},3500)}function Ct(e,t){let n=document.createElement("div");Object.assign(n.style,{position:"fixed",left:`${e-18}px`,top:`${t-5}px`,width:"36px",height:"10px",borderRadius:"50%",border:"1.5px solid rgba(124, 92, 191, 0.55)",transform:"scale(0.2)",opacity:"0.9",pointerEvents:"none",zIndex:"2147483000",transition:"transform 0.45s cubic-bezier(0.2, 0, 0.8, 1), opacity 0.45s ease-out"}),document.body.appendChild(n),requestAnimationFrame(()=>{n.style.transform="scale(1)",n.style.opacity="0"}),setTimeout(()=>n.remove(),500)}function T(e){e!==void 0&&(Me=e),ne(u.comments,L),Ee(u.comments,ue,Pt,dn,Mt,$t,Me),de(u.comments.length),Me=void 0}function mn(){return!Ne()}function un(){return location.pathname+location.search+location.hash}function ue(e){var y,g;let t=u.comments.find(m=>m.id===e);if(!t)return;let n=t.anchorData.pathname;if(n&&n!==un()){let m=n.match(/#.*$/);m&&(location.hash=m[0]),setTimeout(()=>ue(e),350);return}mn()&&(ct(e),dt(e));let a=L.get(e),r=_(e),i=r==null?void 0:r.getBoundingClientRect(),s=i&&(i.width>0||i.height>0)&&r.style.opacity!=="0",p,h;if(s)p=i.left+13,h=i.top+32;else{let m=a==null?void 0:a.getBoundingClientRect();p=m?m.left+m.width*((y=t.anchorData.clickPctX)!=null?y:.5):innerWidth/2,h=m?m.top+m.height*((g=t.anchorData.clickPctY)!=null?g:.3):innerHeight/3}let d=p,c=h;a&&a.scrollIntoView({block:"center"}),wt(t,d,c,{onToggleStatus:m=>{Pt(m),T()},onEdit:m=>Mt(m),onDelete:m=>$t(m),onClose:()=>{}})}function Pt(e){let t=u.comments.find(n=>n.id===e);t&&(t.status=t.status==="open"?"resolved":"open",A(u),T())}async function Mt(e){let t=u.comments.find(s=>s.id===e);if(!t)return;let n=document.querySelector(`.tack-marker[aria-label="Comment ${u.comments.indexOf(t)+1}"]`),o=n==null?void 0:n.getBoundingClientRect(),a=o?o.left+o.width/2:innerWidth/2,r=o?o.bottom:innerHeight/2,i=await ve({defaultText:t.text,submitLabel:"Save changes",anchorX:a,anchorY:r});i&&(t.text=i.text,t.reviewer=i.reviewer,A(u),T())}function fn(e,t){let n=["#7c5cbf","#c4b5fd","#a78bfa","#8b5cf6","#ede9fe"];for(let o=0;o<12;o++){let a=document.createElement("div"),r=o/12*Math.PI*2,i=30+Math.random()*30,s=4+Math.random()*4;Object.assign(a.style,{position:"fixed",left:`${e-s/2}px`,top:`${t-s/2}px`,width:`${s}px`,height:`${s}px`,borderRadius:"50%",background:n[Math.floor(Math.random()*n.length)],pointerEvents:"none",zIndex:"2147483000",transition:"transform 0.45s cubic-bezier(0.2,0,0.8,1), opacity 0.45s ease",opacity:"1"}),document.body.appendChild(a),requestAnimationFrame(()=>{a.style.transform=`translate(${Math.cos(r)*i}px, ${Math.sin(r)*i}px) scale(0.1)`,a.style.opacity="0"}),setTimeout(()=>a.remove(),500)}}function $t(e){let t=O().querySelector(`[data-comment-id="${e}"]`),n=()=>{if(u.comments.findIndex(r=>r.id===e)===-1)return;let a=_(e);if(a){let r=a.getBoundingClientRect();fn(r.left+r.width/2,r.top+r.height/2)}u.comments=u.comments.filter(r=>r.id!==e),L.delete(e),ke(e),A(u),T()};t?(t.classList.add("is-deleting"),setTimeout(n,230)):n()}function St(){me=!me,Te(me),me&&Tt("Press Shift + C to bring back commenting")}function $e(){u.comments.forEach((e,t)=>{let n=G(e.anchorData);n?(L.set(e.id,n),e.anchorStatus="resolved",_(e.id)||F(e,n,t)):(L.delete(e.id),ie(e.anchorData.pathname)&&(e.anchorStatus="orphaned"))})}function Lt(){window.Tack||(je(()=>st()),u=Ye(),He(),W(!0),$e(),u.comments.forEach((e,t)=>{let n=L.get(e.id);n&&F(e,n,t)}),ot(ue),rt((e,t,n)=>{let o=u.comments.find(i=>i.id===e);if(!o)return;let a=_(e);a&&(a.style.visibility="hidden",a.style.pointerEvents="none");let r=document.elementFromPoint(t,n);if(a&&(a.style.visibility="",a.style.pointerEvents="auto"),!r||!ye(r)){T();return}o.anchorData=xe(r,t,n),o.anchorData.screenState=Pe,o.anchorStatus="resolved",L.set(e,r),A(u),T(),requestAnimationFrame(()=>{let i=_(e);i&&(i.classList.remove("is-dart-drop"),i.offsetWidth,i.classList.add("is-dart-drop"),setTimeout(()=>i.classList.remove("is-dart-drop"),560)),Ct(t,n)})}),Ke(()=>{Et(),de(u.comments.length)}),Ue(()=>de(u.comments.length)),We(async(e,t,n)=>{B();let o=xe(e,t,n);o.screenState=Pe;let a=await ve({anchorX:t,anchorY:n});if(!a)return;let r={id:ge(),reviewer:a.reviewer,text:a.text,anchorData:o,anchorStatus:"resolved",status:"open",createdAt:Date.now()};u.comments.push(r),A(u),L.set(r.id,e),F(r,e,u.comments.length-1),T(r.id),requestAnimationFrame(()=>{let i=_(r.id);i&&(i.classList.remove("is-dart-drop"),i.offsetWidth,i.classList.add("is-dart-drop"),setTimeout(()=>i.classList.remove("is-dart-drop"),560)),Ct(t,n)})}),mt(async()=>{await gt(u,Tt)}),ft(async e=>{var p,h;let t;try{t=JSON.parse(await e.text())}catch(d){R("error","Invalid JSON file");return}if(!t||typeof t!="object"||t.schemaVersion!==1){R("error","Not a valid tack feedback file");return}let n=t.comments;if(!Array.isArray(n)){R("error","No comments found in file");return}let o=new Set(u.comments.map(d=>`${d.anchorData.cssSelector}::${d.reviewer.name}::${be(d.text)}`)),a=0,r=0,i=0;for(let d of n){if(!d||typeof d!="object")continue;let c=d,y=typeof c.text=="string"?c.text:"",g=c.anchorData&&typeof c.anchorData=="object"?c.anchorData:{},m=typeof g.cssSelector=="string"?g.cssSelector:"",x=c.reviewer&&typeof c.reviewer=="object"?c.reviewer:{},v=typeof x.name=="string"?x.name:"Unknown";if(!y)continue;let w=`${m}::${v}::${be(y)}`;if(o.has(w))continue;o.add(w);let $=typeof g.pathname=="string"?g.pathname:"",C={id:ge(),text:y,reviewer:{name:v},anchorData:{cssSelector:m,xpath:typeof g.xpath=="string"?g.xpath:"",textSnippet:typeof g.textSnippet=="string"?g.textSnippet:"",pathname:$,screenState:typeof g.screenState=="string"?g.screenState:void 0,viewport:g.viewport&&typeof g.viewport=="object"?g.viewport:{width:0,height:0,dpr:1},clickPctX:typeof g.clickPctX=="number"?g.clickPctX:void 0,clickPctY:typeof g.clickPctY=="number"?g.clickPctY:void 0},anchorStatus:"resolved",status:c.status==="resolved"?"resolved":"open",createdAt:typeof c.createdAt=="number"?c.createdAt:Date.now()},f=(h=(p=$.match(/#.*$/))==null?void 0:p[0])!=null?h:"",l=location.hash;if(f?f===l:!0){let S=G(C.anchorData);S?(L.set(C.id,S),C.anchorStatus="resolved",F(C,S,u.comments.length,a*80),a++):(C.anchorStatus="orphaned",i++)}else C.anchorStatus="resolved",r++;u.comments.push(C)}let s=a+r+i;if(s===0){R("dupe","Already imported \u2014 no new comments");return}A(u),T(),i>0&&r===0?R("partial",`${s} imported \xB7 ${i} couldn't be placed`):r>0&&i===0?R("success",`${s} imported \xB7 ${r} will appear on other screens`):r>0&&i>0?R("partial",`${s} imported \xB7 ${r} on other screens \xB7 ${i} unresolved`):R("success",`${s} comment${s!==1?"s":""} imported`)}),ut(St),xt(()=>u.comments.filter(e=>e.anchorStatus==="orphaned"),(e,t)=>{let n=u.comments.find(o=>o.id===e);n&&(n.anchorStatus="resolved",L.set(e,t),F(n,t,u.comments.indexOf(n)),A(u),T())},()=>ne(u.comments,L)),yt(Q,B,St),vt()&&Te(!0),kt(u.comments,ue),window.addEventListener("resize",()=>ne(u.comments,L)),window.addEventListener("scroll",()=>ne(u.comments,L),{passive:!0}),window.addEventListener("hashchange",()=>{setTimeout(()=>{$e(),T()},100)}),T(),window.Tack={setScreenState(e){Pe=e},refresh(){$e(),T()},arm:Q,disarm:B,isArmed:Z,download:()=>Ce(u)})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Lt):Lt();})();
