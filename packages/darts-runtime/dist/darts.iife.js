"use strict";var __tack_iife__=(()=>{var N=null,v=null,M=null,k=null,ne=80,Tt=`
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
`;function $e(){let e=document.createElement("div");e.className="tack-shadow-host",e.setAttribute("data-tack-ui",""),e.style.position="relative",e.style.zIndex="2147483000",document.body.appendChild(e),N=e.attachShadow({mode:"closed"});let t=document.createElement("style");t.textContent=Tt,N.appendChild(t),M=document.createElement("div"),M.id="tack-toolbar",M.style.transform="translateX(-50%) translateY(120%)",M.style.opacity="0",N.appendChild(M),v=document.createElement("div"),v.id="tack-panel",v.style.transform="translateX(120%)",v.style.opacity="0",N.appendChild(v),requestAnimationFrame(()=>requestAnimationFrame(()=>{M&&(M.style.transform="",M.style.opacity=""),setTimeout(()=>{v&&!v.classList.contains("is-collapsed")&&(v.style.transform="",v.style.opacity="")},60)})),k=document.createElement("button"),k.id="tack-panel-tab",k.setAttribute("aria-label","Open comments panel"),k.textContent="\u2039 Comments",k.style.top=`${ne}px`,k.addEventListener("pointerdown",n=>{let o=n.clientY,r=ne,a=!1;k.setPointerCapture(n.pointerId);let i=m=>{let h=m.clientY-o;!a&&Math.abs(h)>5&&(a=!0),a&&(ne=Math.max(20,Math.min(r+h,innerHeight-80)),k.style.top=`${ne}px`)},s=()=>{k.removeEventListener("pointermove",i),k.removeEventListener("pointerup",s),a||K(!1)};k.addEventListener("pointermove",i),k.addEventListener("pointerup",s)}),N.appendChild(k)}function Ae(){return!!(v!=null&&v.classList.contains("is-collapsed"))}function K(e){!v||!k||(v.classList.toggle("is-collapsed",e),k.classList.toggle("is-visible",e),e||(v.style.removeProperty("transform"),v.style.removeProperty("opacity")))}function _(){if(!N)throw new Error("Shadow host not initialized");return N}function z(){if(!v)throw new Error("Panel not initialized");return v}function He(){if(!M)throw new Error("Toolbar not initialized");return M}var Ne,oe=(Ne=window.__TACK_CONFIG__)!=null?Ne:{},ze,De,Re,S={prototypeId:(ze=oe.prototypeId)!=null?ze:"dev-"+location.hostname,prototypeName:(De=oe.prototypeName)!=null?De:document.title||"Prototype",builtAt:(Re=oe.builtAt)!=null?Re:0,sinkUrl:oe.sinkUrl};var Oe=`dd:${S.prototypeId}`,re="local",j=null,me=[];function U(){return{schemaVersion:1,prototypeId:S.prototypeId,prototypeName:S.prototypeName,builtAt:S.builtAt,reviewer:null,comments:[]}}function Mt(){try{let e="__tack_probe__";return localStorage.setItem(e,"1"),localStorage.removeItem(e),"local"}catch(e){return"memory"}}function Pt(e){return!e||typeof e!="object"?U():e.schemaVersion===1?e:U()}function Ie(e){me.push(e)}function _e(){if(re=Mt(),re==="memory")return me.forEach(e=>e()),j||(j=U(),j);try{let e=localStorage.getItem(Oe);return e?Pt(JSON.parse(e)):U()}catch(e){return U()}}function P(e){if(re==="memory"){j=e;return}try{localStorage.setItem(Oe,JSON.stringify(e))}catch(t){re="memory",j=e,me.forEach(n=>n())}}function ue(){return"tack-"+Math.random().toString(36).slice(2,9)+Date.now().toString(36)}function je(e,t){return e.length<=t?e:e.slice(0,t-1)+"\u2026"}function fe(e,t){let n;return(...o)=>{clearTimeout(n),n=setTimeout(()=>e(...o),t)}}function he(e){let t=5381;for(let n=0;n<e.length;n++)t=t*33^e.charCodeAt(n);return t>>>0}function $t(e){let t=e.match(/#.*$/);return t?t[0]:""}function ae(e){if(!e)return!0;let t=$t(e);return t?t===location.hash:!0}var At=/^(is-|has-|js-|active|open|closed|selected|focused|hover|hidden|visible|animate|motion|transition)/;function J(e){var t;return(t=window.CSS)!=null&&t.escape?window.CSS.escape(e):e.replace(/[^a-zA-Z0-9_-]/g,"\\$&")}function Ht(e){return Array.from(e.classList).filter(t=>t&&!At.test(t)&&!t.startsWith("tack-"))}function Nt(e){var a,i;let t=e.getAttribute("data-testid");if(t)return`[data-testid="${J(t)}"]`;if(e.id)return`#${J(e.id)}`;let n=[],o=e,r=0;for(;o&&o!==document.body&&r<5;){let s=o.tagName.toLowerCase(),m=Ht(o);if(m.length&&(s+=`.${m.slice(0,2).map(J).join(".")}`),o.id){n.unshift(`#${J(o.id)}`);break}let h=o.getAttribute("data-testid");if(h){n.unshift(`[data-testid="${J(h)}"]`);break}Array.from((i=(a=o.parentElement)==null?void 0:a.children)!=null?i:[]).filter(l=>l.tagName===o.tagName).length>1&&(s+=`:nth-child(${Array.from(o.parentElement.children).indexOf(o)+1})`),n.unshift(s),o=o.parentElement,r++}return n.join(" > ")||e.tagName.toLowerCase()}function zt(e){if(e===document.body)return"/html/body";let t=[],n=e;for(;n&&n!==document;){let o=1,r=n.previousSibling;for(;r;)r.nodeType===n.nodeType&&r.nodeName===n.nodeName&&o++,r=r.previousSibling;let a=n.nodeType===Node.TEXT_NODE?"text()":n.nodeName.toLowerCase();if(t.unshift(`${a}[${o}]`),n=n.parentNode,!n||n.nodeType!==Node.ELEMENT_NODE)break}return"/"+t.join("/")}function Dt(e){try{let n=document.evaluate(e,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;return n instanceof Element?n:null}catch(t){return null}}function be(e,t,n){var a,i,s,m,h,d;let o,r;if(t!==void 0&&n!==void 0){let l=e.getBoundingClientRect();l.width>0&&l.height>0&&(o=Math.max(0,Math.min(1,(t-l.left)/l.width)),r=Math.max(0,Math.min(1,(n-l.top)/l.height)))}return{cssSelector:Nt(e),xpath:zt(e),textSnippet:je((m=(s=(a=e.innerText)==null?void 0:a.trim())!=null?s:(i=e.textContent)==null?void 0:i.trim())!=null?m:"",80),pathname:location.pathname+location.search+location.hash,screenState:(h=window.Tack)==null?void 0:h._screenState,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},sourceLocation:(d=e.getAttribute("data-tack-src"))!=null?d:void 0,clickPctX:o,clickPctY:r}}function V(e){var n;try{let o=document.querySelector(e.cssSelector);if(o)return o}catch(o){}let t=Dt(e.xpath);if(t)return t;if(e.textSnippet.length>=4){let o=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),r;for(;r=o.nextNode();)if(((n=r.nodeValue)!=null?n:"").includes(e.textSnippet))return r.parentElement}return null}var Y=!1,Ye=[],Xe=[],Be=[],$=null;function Rt(){let e=document.createElement("div");return e.className="tack-mode-banner",e.setAttribute("aria-live","polite"),e.textContent="Design Darts \u2014 click any element to pin a comment. Press Esc to cancel.",Object.assign(e.style,{position:"fixed",top:"0",left:"0",right:"0",zIndex:"2147483000",background:"#1a1a2e",color:"#e0d7ff",textAlign:"center",padding:"10px 16px",fontSize:"13px",fontFamily:"system-ui, sans-serif",fontWeight:"600",pointerEvents:"none"}),e}function qe(e){if(!Y)return;let t=e.target;!t||!ge(t)||(e.preventDefault(),e.stopPropagation(),Be.forEach(n=>n(t,e.clientX,e.clientY)))}function ge(e){return e.closest("[data-tack-ignore]")?!1:e.closest("[data-tack-allow]")?!0:e.closest(".tack-shadow-host, [data-tack-ui]")?!1:!e.closest('dialog, [popover], [role="dialog"], [role="menu"], [role="tooltip"], [aria-modal="true"]')}function G(){return Y}function Fe(e){Ye.push(e)}function We(e){Xe.push(e)}function Ke(e){Be.push(e)}function Z(){Y||(Y=!0,document.body.style.cursor="crosshair",$=Rt(),document.body.appendChild($),document.addEventListener("click",qe,{capture:!0}),Ye.forEach(e=>e()))}function X(){Y&&(Y=!1,document.body.style.cursor="",$!=null&&$.parentNode&&$.parentNode.removeChild($),$=null,document.removeEventListener("click",qe,{capture:!0}),Xe.forEach(e=>e()))}var Ue=`tack-reviewer:${S.prototypeId}`;function Je(){try{let e=localStorage.getItem(Ue);if(!e)return null;let t=JSON.parse(e);if(typeof(t==null?void 0:t.name)=="string"&&t.name)return t}catch(e){}return null}function Ve(e){try{localStorage.setItem(Ue,JSON.stringify(e))}catch(t){}}var B=null,Q=null;function Ot(e){if(e.querySelector("#tack-popover-style"))return;let t=document.createElement("style");t.id="tack-popover-style",t.textContent=`
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
  `,e.appendChild(t)}function It(){let e=_();return Ot(e),B||(B=document.createElement("div"),B.className="tack-popover",e.appendChild(B),B)}function _t(e,t,n){let a=t-140,i=n+16;a=Math.max(12,Math.min(a,innerWidth-280-12)),i+200>innerHeight-12&&(i=n-220),i=Math.max(12,i),e.style.left=`${a}px`,e.style.top=`${i}px`}function xe(e){return new Promise(t=>{var x,f,y,L,E;Q&&(Q(null),Q=null),Q=t;let n=It(),o=Je(),r=!!(e!=null&&e.defaultText);if(n.innerHTML="",o!=null&&o.name){let b=document.createElement("div");b.className="tack-popover-name";let T=document.createElement("button");T.textContent="Change",T.addEventListener("click",()=>{a.style.display="",b.style.display="none",a.focus()}),b.innerHTML=`Commenting as <strong>${o.name}</strong>\xA0`,b.appendChild(T),n.appendChild(b)}let a=document.createElement("input");a.type="text",a.placeholder="Your name (required)",a.autocomplete="name",a.value=(x=o==null?void 0:o.name)!=null?x:"",a.style.display=o!=null&&o.name?"none":"",n.appendChild(a);let i=document.createElement("div");i.className="tack-popover-row";let s=document.createElement("textarea");s.placeholder="Add a comment\u2026",s.rows=3,s.value=(f=e==null?void 0:e.defaultText)!=null?f:"";let m=document.createElement("button");m.className="tack-popover-send",m.setAttribute("aria-label",(y=e==null?void 0:e.submitLabel)!=null?y:"Save comment"),m.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z"/></svg>',i.appendChild(s),i.appendChild(m),n.appendChild(i);let h=(L=e==null?void 0:e.anchorX)!=null?L:innerWidth/2,d=(E=e==null?void 0:e.anchorY)!=null?E:innerHeight/2;_t(n,h,d),requestAnimationFrame(()=>n.classList.add("is-open"));let l=b=>{n.classList.remove("is-open"),document.removeEventListener("keydown",p),document.removeEventListener("pointerdown",c,!0),Q=null,t(b)},g=()=>{var I;let b=a.style.display==="none"?(I=o==null?void 0:o.name)!=null?I:"":a.value.trim(),T=s.value.trim();if(!b){a.style.display="",a.style.outline="2px solid #f87171",a.focus();return}if(!T){s.focus();return}a.style.outline="";let O={name:b};Ve(O),l({text:T,reviewer:O})},p=b=>{b.key==="Escape"&&l(null)},c=b=>{let T=_(),O=b.target;!n.contains(O)&&!T.host.contains(O)&&l(null)};s.addEventListener("keydown",b=>{b.stopPropagation(),b.key==="Escape"&&(b.preventDefault(),l(null)),b.key==="Enter"&&!b.shiftKey&&(b.preventDefault(),g())}),a.addEventListener("keydown",b=>{b.stopPropagation(),b.key==="Escape"&&(b.preventDefault(),l(null)),b.key==="Enter"&&!b.shiftKey&&(b.preventDefault(),g())}),m.addEventListener("click",g),document.addEventListener("keydown",p),setTimeout(()=>document.addEventListener("pointerdown",c,!0),100),r||o!=null&&o.name?(s.focus(),r&&s.select()):a.focus()})}var ee=new Map,Qe=[],D=null,Ge=!1,jt="M13,0 C20.2,0 26,5.8 26,13 C26,18.6 22.6,23.3 17.8,25.3 L13,32 L8.2,25.3 C3.4,23.3 0,18.6 0,13 C0,5.8 5.8,0 13,0 Z";function Yt(){if(Ge)return;Ge=!0;let e=document.createElement("style");e.textContent=`
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
      clip-path: path('${jt}');
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 3px 10px rgba(0,0,0,0.45);
      pointer-events: none;
    }
  `,document.head.appendChild(e)}function Xt(){return D||(Yt(),D=document.createElement("div"),Object.assign(D.style,{position:"fixed",inset:"0",pointerEvents:"none",zIndex:"2147480000"}),D.setAttribute("data-tack-ui",""),document.body.appendChild(D),D)}function et(e,t,n){let o=t.getBoundingClientRect();if(!o.width&&!o.height){e.style.display="block",e.style.visibility="hidden";return}if(e.style.visibility="visible",e.style.display="block",(n==null?void 0:n.clickPctX)!==void 0&&(n==null?void 0:n.clickPctY)!==void 0){let r=o.left+o.width*n.clickPctX,a=o.top+o.height*n.clickPctY;e.style.left=`${r-13}px`,e.style.top=`${a-32}px`}else e.style.left=`${o.right-26}px`,e.style.top=`${o.top-32}px`}function Bt(e,t){let n=document.createElement("button");n.className="tack-marker",n.setAttribute("data-tack-ui",""),n.setAttribute("aria-label",`Comment ${t+1}`);let o=e.status==="resolved"?"#34d399":"#7c5cbf",r=e.status==="resolved"?"rgba(52,211,153,0.65)":"rgba(124,92,191,0.65)",a=(Math.random()*3.5).toFixed(2);Object.assign(n.style,{position:"absolute",width:"26px",height:"32px",background:"transparent",border:"none",padding:"0",cursor:"pointer",pointerEvents:"auto",zIndex:"2147480001","--tack-ring-color":r,"--tack-pulse-delay":`${a}s`});let i=document.createElement("span");return i.className="tack-pin",i.textContent=String(t+1),i.style.background=o,n.appendChild(i),Ft(n,e.id),n}var tt=[],qt=6;function Ft(e,t){let n=0,o=0,r=!1,a="",i="";e.addEventListener("pointerdown",s=>{if(s.button!==0)return;n=s.clientX,o=s.clientY,a=e.style.left,i=e.style.top,r=!1;let m=d=>{let l=d.clientX-n,g=d.clientY-o;!r&&Math.hypot(l,g)>qt&&(r=!0,e.setPointerCapture(d.pointerId),e.style.cursor="grabbing",e.style.transition="none",e.style.opacity="1",e.style.pointerEvents="auto"),r&&(e.style.left=`${parseFloat(a)+(d.clientX-n)}px`,e.style.top=`${parseFloat(i)+(d.clientY-o)}px`)},h=d=>{if(document.removeEventListener("pointermove",m),document.removeEventListener("pointerup",h),e.style.cursor="pointer",e.style.transition="",r){r=!1;let l=parseFloat(e.style.left)+13,g=parseFloat(e.style.top)+32;tt.forEach(p=>p(t,l,g))}else Qe.forEach(l=>l(t))};document.addEventListener("pointermove",m),document.addEventListener("pointerup",h)})}function Wt(e,t){let n=e.querySelector(".tack-pin"),o=t==="resolved"?"#34d399":"#7c5cbf",r=t==="resolved"?"rgba(52,211,153,0.65)":"rgba(124,92,191,0.65)";n&&(n.style.background=o),e.style.setProperty("--tack-ring-color",r)}function nt(e){Qe.push(e)}function R(e){return ee.get(e)}function ot(e){tt.push(e)}function q(e,t,n,o){let r=Xt();ye(e.id);let a=Bt(e,n);et(a,t,e.anchorData),o!==void 0&&(a.style.setProperty("--tack-float-delay",`${o}ms`),a.classList.add("is-floating-in"),setTimeout(()=>a.classList.remove("is-floating-in"),o+700)),r.appendChild(a),ee.set(e.id,a)}function ye(e){let t=ee.get(e);t!=null&&t.parentNode&&t.parentNode.removeChild(t),ee.delete(e)}function Kt(e){e.style.transition="opacity 0.3s ease",e.style.opacity="0",e.style.pointerEvents="none"}function Ze(e){e.style.display==="none"&&(e.style.display="block"),e.style.transition="opacity 0.3s ease",e.style.opacity="1",e.style.pointerEvents="auto"}function te(e,t){e.forEach(n=>{let o=ee.get(n.id);if(!ae(n.anchorData.pathname)){o&&Kt(o);return}let r=t.get(n.id);if(o){if(!r){Ze(o);return}et(o,r,n.anchorData),Wt(o,n.status),Ze(o)}})}function at(){let e=z();if(e.querySelector(".storage-banner"))return;let n=document.createElement("div");n.className="storage-banner",n.textContent="Your comments won't survive a refresh. Send them before you close this tab.",e.prepend(n)}function ke(e,t,n,o,r,a,i){let s=z(),m=s.querySelector(".storage-banner");s.innerHTML="",m&&s.appendChild(m);let h=document.createElement("div");h.className="panel-header";let d=document.createElement("button");d.className="panel-collapse-btn",d.setAttribute("aria-label","Close panel"),d.setAttribute("title","Close panel"),d.innerHTML="\u203A",d.addEventListener("click",()=>K(!0)),h.innerHTML=`<span>Comments (${e.filter(f=>f.anchorStatus!=="orphaned").length})</span>`,h.appendChild(d),s.appendChild(h);let l=document.createElement("div");l.className="filter-bar",["all","open","resolved"].forEach(f=>{let y=document.createElement("button");y.className=`filter-chip${o===f?" active":""}`,y.textContent=f.charAt(0).toUpperCase()+f.slice(1),y.addEventListener("click",()=>{ke(e,t,n,f)}),l.appendChild(y)}),s.appendChild(l);let g=document.createElement("div");g.className="panel-body";let p=[...e].sort((f,y)=>y.createdAt-f.createdAt),c=p.filter(f=>f.anchorStatus!=="orphaned"&&(o==="all"||f.status===o)),x=p.filter(f=>f.anchorStatus==="orphaned");if(c.forEach((f,y)=>{let L=rt(f,y,t,n,r,a);f.id===i&&L.classList.add("is-new"),g.appendChild(L)}),x.length){let f=document.createElement("div");f.className="orphan-section";let y=document.createElement("div");y.className="orphan-label",y.textContent=`Orphaned comments (${x.length})`,f.appendChild(y),x.forEach((L,E)=>f.appendChild(rt(L,E,t,n,r,a))),g.appendChild(f)}if(!c.length&&!x.length){let f=document.createElement("div");f.style.cssText="color: #8878b8; font-size: 12px; padding: 20px; text-align: center;",f.textContent='No comments yet. Click "Comment" and then click any element.',g.appendChild(f)}s.appendChild(g)}var ve="all: unset; cursor: pointer; font-size: 10px; color: #8878b8; text-decoration: underline; text-underline-offset: 2px;";function rt(e,t,n,o,r,a){let i=document.createElement("div");i.className="comment-card",i.dataset.commentId=e.id;let s=document.createElement("div");s.className="comment-num",s.innerHTML=`#${t+1} <span class="status-badge ${e.anchorStatus==="orphaned"?"orphaned":e.status}">${e.anchorStatus==="orphaned"?"orphaned":e.status}</span>`;let m=document.createElement("div");m.className="comment-text",m.textContent=e.text;let h=document.createElement("div");h.className="comment-meta";let d=new Date(e.createdAt),l=d.toLocaleDateString(void 0,{month:"short",day:"numeric"}),g=d.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});h.textContent=`${e.reviewer.name} \xB7 ${l} ${g}`;let p=document.createElement("div");if(p.style.cssText="display: flex; gap: 10px; margin-top: 6px; align-items: center;",e.anchorStatus!=="orphaned"){let c=document.createElement("button");c.style.cssText=ve,c.textContent=e.status==="open"?"Mark resolved":"Reopen",c.addEventListener("click",x=>{x.stopPropagation(),o(e.id)}),p.appendChild(c)}if(r){let c=document.createElement("span");c.style.cssText="color: #4a4460; font-size: 10px; user-select: none;",c.textContent="\xB7";let x=document.createElement("button");x.style.cssText=ve,x.textContent="Edit",x.addEventListener("click",f=>{f.stopPropagation(),r(e.id)}),p.appendChild(c),p.appendChild(x)}if(a){let c=document.createElement("span");c.style.cssText="color: #4a4460; font-size: 10px; user-select: none;",c.textContent="\xB7";let x=document.createElement("button");x.style.cssText=ve+" color: #f87171;",x.textContent="Delete",x.addEventListener("click",f=>{f.stopPropagation(),a(e.id)}),p.appendChild(c),p.appendChild(x)}return i.appendChild(s),i.appendChild(m),i.appendChild(h),i.appendChild(p),i.addEventListener("click",()=>n(e.id)),i}function it(e){let t=z();t.querySelectorAll(".comment-card").forEach(o=>o.classList.remove("is-focused"));let n=t.querySelector(`[data-comment-id="${e}"]`);n&&(n.classList.add("is-focused"),n.scrollIntoView({behavior:"smooth",block:"nearest"}))}function st(e){let n=z().querySelector(`[data-comment-id="${e}"]`);n&&(n.classList.remove("is-flash"),n.offsetWidth,n.classList.add("is-flash"),n.scrollIntoView({behavior:"smooth",block:"nearest"}),setTimeout(()=>n.classList.remove("is-flash"),1700))}var F={pin:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>',send:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',copy:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',eye:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',upload:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>'};var ie=null,se=null,le=null,lt=!1;function ct(e){ie=e}function dt(e){se=e}function pt(e){le=e}function ce(e){let t=He(),n=G();if(!lt){let r=document.createElement("input");r.type="file",r.accept=".json,application/json",r.style.display="none",r.setAttribute("data-tack-ui",""),r.addEventListener("change",()=>{var a;(a=r.files)!=null&&a[0]&&(le==null||le(r.files[0]),r.value="")}),document.body.appendChild(r),t.innerHTML=`
      <button class="btn-arm${n?" is-armed":""}" id="tack-arm-btn" aria-label="${n?"Disarm comment mode":"Add comment"}" title="Add a comment (C)">
        ${F.pin} ${n?"Cancel":"Comment"}
      </button>
      <button class="btn-ghost tack-toolbar-icon" id="tack-import-btn" aria-label="Import feedback" title="Import feedback JSON">
        ${F.upload}
      </button>
      <button class="btn-ghost tack-has-tip" id="tack-send-btn" aria-label="Export feedback" title="Export feedback \u2014 saves JSON to Downloads">
        ${F.send} Export feedback
      </button>
      <button class="btn-ghost tack-toolbar-icon" id="tack-presenter-btn" aria-label="Hide/show overlay" title="Hide/show overlay (Shift+C)">
        ${F.eye}
      </button>
    `,t.querySelector("#tack-arm-btn").addEventListener("click",()=>G()?X():Z()),t.querySelector("#tack-import-btn").addEventListener("click",()=>r.click()),t.querySelector("#tack-send-btn").addEventListener("click",()=>ie==null?void 0:ie()),t.querySelector("#tack-presenter-btn").addEventListener("click",()=>se==null?void 0:se()),lt=!0}let o=t.querySelector("#tack-arm-btn");o.classList.toggle("is-armed",n),o.setAttribute("aria-label",n?"Disarm comment mode":"Add comment"),o.innerHTML=`${F.pin} ${n?"Cancel":"Comment"}`}function we(e){var s,m;let t=(m=(s=e.reviewer)==null?void 0:s.name)!=null?m:"reviewer",n=new Date().toISOString().slice(0,10),o=`design-darts-${S.prototypeName.replace(/[^a-z0-9]/gi,"-")}-${t.replace(/\s+/g,"-")}-${n}.json`,r=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),a=URL.createObjectURL(r),i=document.createElement("a");i.href=a,i.download=o,i.click(),URL.revokeObjectURL(a)}async function Ut(e){let t=S.sinkUrl;if(!t)return"failed";try{return(await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).ok?"sent":"failed"}catch(n){return"failed"}}async function mt(e,t){we(e),t("Feedback saved to Downloads \u2193"),S.sinkUrl&&await Ut(e)==="failed"&&t("POST failed \u2014 check your connection.")}var ut=null,ft=null,Ee=null,Ce=null,de=null,Jt=fe(()=>{if(!(!Ee||!Ce))for(let e of Ee()){let t=V(e.anchorData);t&&Ce(e.id,t)}},300),Vt=fe(()=>{de==null||de()},120);function ht(e,t,n){Ee=e,Ce=t,de=n,ut=new MutationObserver(()=>Jt()),ut.observe(document.body,{childList:!0,subtree:!0}),ft=new MutationObserver(o=>{o.some(a=>{var s;let i=a.target;return!((s=i.closest)!=null&&s.call(i,"[data-tack-ui]"))})&&Vt()}),ft.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class","hidden","open","aria-hidden"]})}function bt(e,t,n){document.addEventListener("keydown",o=>{var i;let r=o.composedPath()[0],a=(i=r==null?void 0:r.tagName)!=null?i:o.target.tagName;if(!(a==="INPUT"||a==="TEXTAREA"||a==="SELECT")&&!(r!=null&&r.isContentEditable)){if(o.shiftKey&&(o.key==="C"||o.key==="c")){o.preventDefault(),n();return}(o.key==="c"||o.key==="C")&&(o.preventDefault(),e()),o.key==="Escape"&&t()}})}function gt(){return new URLSearchParams(location.search).get("comments")==="off"}function Se(e){let t=document.querySelector(".tack-shadow-host");t&&(t.style.display=e?"none":""),document.querySelectorAll("[data-tack-ui]").forEach(n=>{n.style.display=e?"none":""})}function xt(e,t){let n=location.hash;if(!n.startsWith("#tack-"))return;let o=parseInt(n.slice(6),10);if(isNaN(o)||o<1||o>e.length)return;let r=e[o-1];r&&setTimeout(()=>t(r.id),300)}var A=null;function Gt(e){return e.split(" ").map(t=>t[0]).join("").slice(0,2).toUpperCase()}function Zt(e){let t=Date.now()-e;return t<6e4?"Just now":t<36e5?`${Math.floor(t/6e4)}m ago`:t<864e5?`${Math.floor(t/36e5)}h ago`:new Date(e).toLocaleDateString(void 0,{month:"short",day:"numeric"})}function Qt(){let e=_();return A||(A=document.createElement("div"),A.id="tack-comment-popover",e.appendChild(A)),A}var en=24;function tn(e,t,n){let a=t-en,i=n+8;a=Math.max(12,Math.min(a,innerWidth-280-12));let s=i+250>innerHeight-12;s&&(i=n-260),i=Math.max(12,i),e.style.left=`${a}px`,e.style.top=`${i}px`;let m=Math.max(16,Math.min(t-a,264));e.style.setProperty("--tack-arrow-x",`${m}px`),e.classList.toggle("is-flipped",s)}function yt(e,t,n,o){let r=Qt(),a=e.anchorStatus==="orphaned"?"#6b6480":e.status==="resolved"?"#2ea87e":"#7c5cbf",i=new Date(e.createdAt),s=i.toLocaleDateString(void 0,{month:"short",day:"numeric"}),m=i.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"}),h=`${s} at ${m}`;r.innerHTML=`
    <div class="cp-header">
      <div class="cp-row">
        <div class="cp-avatar" style="background:${a}">${Gt(e.reviewer.name)}</div>
        <div class="cp-meta">
          <span class="cp-name">${e.reviewer.name}</span>
          <span class="cp-time" title="${h}">${Zt(e.createdAt)}</span>
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
  `,tn(r,t,n),requestAnimationFrame(()=>r.classList.add("is-open"));let d=()=>{r.classList.remove("is-open"),document.removeEventListener("pointerdown",l,!0),document.removeEventListener("keydown",g),o.onClose()};r.querySelector(".cp-close").addEventListener("click",d),r.querySelector(".cp-resolve").addEventListener("click",()=>{o.onToggleStatus(e.id),d()}),r.querySelector(".cp-edit").addEventListener("click",()=>{o.onEdit(e.id),d()}),r.querySelector(".cp-delete").addEventListener("click",()=>{o.onDelete(e.id),d()});let l=p=>{let c=_().host;p.composedPath().includes(c)||d()},g=p=>{p.key==="Escape"&&d()};setTimeout(()=>{document.addEventListener("pointerdown",l,!0),document.addEventListener("keydown",g)},120)}function vt(){A==null||A.classList.remove("is-open")}var u,w=new Map,Le,nn="all",Te=!1,Me,W=null;function on(){if(document.getElementById("tack-toast-styles"))return;let e=document.createElement("style");e.id="tack-toast-styles",e.textContent=`
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
  `,document.head.appendChild(e)}function rn(e){var n;(n=document.querySelector(".tack-toast"))==null||n.remove(),W&&clearTimeout(W);let t=document.createElement("div");t.className="tack-toast",t.setAttribute("data-tack-ui",""),t.textContent=e,Object.assign(t.style,{position:"fixed",bottom:"80px",left:"50%",transform:"translateX(-50%) translateY(12px)",opacity:"0",zIndex:"2147483000",background:"rgba(26, 26, 46, 0.95)",color:"#e0d7ff",fontSize:"12px",fontFamily:"system-ui, -apple-system, sans-serif",padding:"8px 18px",borderRadius:"999px",border:"1px solid rgba(160,130,255,0.25)",boxShadow:"0 4px 16px rgba(0,0,0,0.4)",pointerEvents:"none",whiteSpace:"nowrap",transition:"transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease"}),document.body.appendChild(t),requestAnimationFrame(()=>{t.style.transform="translateX(-50%) translateY(0)",t.style.opacity="1"}),W=setTimeout(()=>{t.style.transform="translateX(-50%) translateY(12px)",t.style.opacity="0",setTimeout(()=>t.remove(),300)},2500)}function H(e,t){var r;on(),(r=document.querySelector(".tack-toast"))==null||r.remove(),W&&clearTimeout(W);let n={success:{icon:"\u2713",iconBg:"#34d399",iconColor:"#022c22",border:"rgba(52,211,153,0.4)",bg:"rgba(6,46,32,0.92)",glow:"rgba(52,211,153,0.2)"},partial:{icon:"\u2193",iconBg:"#fbbf24",iconColor:"#1c1100",border:"rgba(251,191,36,0.4)",bg:"rgba(28,20,0,0.92)",glow:"rgba(251,191,36,0.2)"},error:{icon:"\u2715",iconBg:"#f87171",iconColor:"#1a0000",border:"rgba(248,113,113,0.4)",bg:"rgba(30,8,8,0.92)",glow:"rgba(248,113,113,0.2)"},dupe:{icon:"\u21BA",iconBg:"#8878b8",iconColor:"#1a1a2e",border:"rgba(160,130,255,0.3)",bg:"rgba(26,26,46,0.95)",glow:"rgba(124,92,191,0.15)"}}[e],o=document.createElement("div");o.className="tack-toast tack-import-toast",o.setAttribute("data-tack-ui",""),o.innerHTML=`
    <span class="ti-icon" style="background:${n.iconBg};color:${n.iconColor}">${n.icon}</span>
    <span class="ti-msg">${t}</span>
  `,Object.assign(o.style,{position:"fixed",bottom:"80px",left:"50%",transform:"translateX(-50%) translateY(20px) scale(0.88)",opacity:"0",zIndex:"2147483000",background:n.bg,color:"#e0d7ff",fontFamily:"system-ui, -apple-system, sans-serif",padding:"8px 14px 8px 10px",borderRadius:"999px",border:`1px solid ${n.border}`,boxShadow:`0 4px 24px rgba(0,0,0,0.5), 0 0 0 4px ${n.glow}`,pointerEvents:"none",transition:"transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease"}),document.body.appendChild(o),requestAnimationFrame(()=>requestAnimationFrame(()=>{o.style.transform="translateX(-50%) translateY(0) scale(1)",o.style.opacity="1"})),W=setTimeout(()=>{o.style.transform="translateX(-50%) translateY(12px) scale(0.92)",o.style.opacity="0",setTimeout(()=>o.remove(),400)},3500)}function kt(e,t){let n=document.createElement("div");Object.assign(n.style,{position:"fixed",left:`${e-18}px`,top:`${t-5}px`,width:"36px",height:"10px",borderRadius:"50%",border:"1.5px solid rgba(124, 92, 191, 0.55)",transform:"scale(0.2)",opacity:"0.9",pointerEvents:"none",zIndex:"2147483000",transition:"transform 0.45s cubic-bezier(0.2, 0, 0.8, 1), opacity 0.45s ease-out"}),document.body.appendChild(n),requestAnimationFrame(()=>{n.style.transform="scale(1)",n.style.opacity="0"}),setTimeout(()=>n.remove(),500)}function C(e){e!==void 0&&(Me=e),te(u.comments,w),ke(u.comments,pe,Ct,nn,St,Lt,Me),ce(u.comments.length),Me=void 0}function an(){return!Ae()}function sn(){return location.pathname+location.search+location.hash}function pe(e){var g,p;let t=u.comments.find(c=>c.id===e);if(!t)return;let n=t.anchorData.pathname;if(n&&n!==sn()){let c=n.match(/#.*$/);c&&(location.hash=c[0]),setTimeout(()=>pe(e),350);return}an()&&(it(e),st(e));let r=w.get(e),a=R(e),i=a==null?void 0:a.getBoundingClientRect(),s=i&&(i.width>0||i.height>0)&&a.style.opacity!=="0",m,h;if(s)m=i.left+13,h=i.top+32;else{let c=r==null?void 0:r.getBoundingClientRect();m=c?c.left+c.width*((g=t.anchorData.clickPctX)!=null?g:.5):innerWidth/2,h=c?c.top+c.height*((p=t.anchorData.clickPctY)!=null?p:.3):innerHeight/3}let d=m,l=h;r&&r.scrollIntoView({block:"center"}),yt(t,d,l,{onToggleStatus:c=>{Ct(c),C()},onEdit:c=>St(c),onDelete:c=>Lt(c),onClose:()=>{}})}function Ct(e){let t=u.comments.find(n=>n.id===e);t&&(t.status=t.status==="open"?"resolved":"open",P(u),C())}async function St(e){let t=u.comments.find(s=>s.id===e);if(!t)return;let n=document.querySelector(`.tack-marker[aria-label="Comment ${u.comments.indexOf(t)+1}"]`),o=n==null?void 0:n.getBoundingClientRect(),r=o?o.left+o.width/2:innerWidth/2,a=o?o.bottom:innerHeight/2,i=await xe({defaultText:t.text,submitLabel:"Save changes",anchorX:r,anchorY:a});i&&(t.text=i.text,t.reviewer=i.reviewer,P(u),C())}function ln(e,t){let n=["#7c5cbf","#c4b5fd","#a78bfa","#8b5cf6","#ede9fe"];for(let o=0;o<12;o++){let r=document.createElement("div"),a=o/12*Math.PI*2,i=30+Math.random()*30,s=4+Math.random()*4;Object.assign(r.style,{position:"fixed",left:`${e-s/2}px`,top:`${t-s/2}px`,width:`${s}px`,height:`${s}px`,borderRadius:"50%",background:n[Math.floor(Math.random()*n.length)],pointerEvents:"none",zIndex:"2147483000",transition:"transform 0.45s cubic-bezier(0.2,0,0.8,1), opacity 0.45s ease",opacity:"1"}),document.body.appendChild(r),requestAnimationFrame(()=>{r.style.transform=`translate(${Math.cos(a)*i}px, ${Math.sin(a)*i}px) scale(0.1)`,r.style.opacity="0"}),setTimeout(()=>r.remove(),500)}}function Lt(e){let t=z().querySelector(`[data-comment-id="${e}"]`),n=()=>{if(u.comments.findIndex(a=>a.id===e)===-1)return;let r=R(e);if(r){let a=r.getBoundingClientRect();ln(a.left+a.width/2,a.top+a.height/2)}u.comments=u.comments.filter(a=>a.id!==e),w.delete(e),ye(e),P(u),C()};t?(t.classList.add("is-deleting"),setTimeout(n,230)):n()}function wt(){Te=!Te,Se(Te)}function Pe(){u.comments.forEach((e,t)=>{let n=V(e.anchorData);n?(w.set(e.id,n),e.anchorStatus="resolved",R(e.id)||q(e,n,t)):(w.delete(e.id),ae(e.anchorData.pathname)&&(e.anchorStatus="orphaned"))})}function Et(){window.Tack||(Ie(()=>at()),u=_e(),$e(),K(!0),Pe(),u.comments.forEach((e,t)=>{let n=w.get(e.id);n&&q(e,n,t)}),nt(pe),ot((e,t,n)=>{let o=u.comments.find(i=>i.id===e);if(!o)return;let r=R(e);r&&(r.style.visibility="hidden",r.style.pointerEvents="none");let a=document.elementFromPoint(t,n);if(r&&(r.style.visibility="",r.style.pointerEvents="auto"),!a||!ge(a)){C();return}o.anchorData=be(a,t,n),o.anchorData.screenState=Le,o.anchorStatus="resolved",w.set(e,a),P(u),C(),requestAnimationFrame(()=>{let i=R(e);i&&(i.classList.remove("is-dart-drop"),i.offsetWidth,i.classList.add("is-dart-drop"),setTimeout(()=>i.classList.remove("is-dart-drop"),560)),kt(t,n)})}),Fe(()=>{vt(),ce(u.comments.length)}),We(()=>ce(u.comments.length)),Ke(async(e,t,n)=>{X();let o=be(e,t,n);o.screenState=Le;let r=await xe({anchorX:t,anchorY:n});if(!r)return;let a={id:ue(),reviewer:r.reviewer,text:r.text,anchorData:o,anchorStatus:"resolved",status:"open",createdAt:Date.now()};u.comments.push(a),P(u),w.set(a.id,e),q(a,e,u.comments.length-1),C(a.id),requestAnimationFrame(()=>{let i=R(a.id);i&&(i.classList.remove("is-dart-drop"),i.offsetWidth,i.classList.add("is-dart-drop"),setTimeout(()=>i.classList.remove("is-dart-drop"),560)),kt(t,n)})}),ct(async()=>{await mt(u,rn)}),pt(async e=>{var m,h;let t;try{t=JSON.parse(await e.text())}catch(d){H("error","Invalid JSON file");return}if(!t||typeof t!="object"||t.schemaVersion!==1){H("error","Not a valid tack feedback file");return}let n=t.comments;if(!Array.isArray(n)){H("error","No comments found in file");return}let o=new Set(u.comments.map(d=>`${d.anchorData.cssSelector}::${d.reviewer.name}::${he(d.text)}`)),r=0,a=0,i=0;for(let d of n){if(!d||typeof d!="object")continue;let l=d,g=typeof l.text=="string"?l.text:"",p=l.anchorData&&typeof l.anchorData=="object"?l.anchorData:{},c=typeof p.cssSelector=="string"?p.cssSelector:"",x=l.reviewer&&typeof l.reviewer=="object"?l.reviewer:{},f=typeof x.name=="string"?x.name:"Unknown";if(!g)continue;let y=`${c}::${f}::${he(g)}`;if(o.has(y))continue;o.add(y);let L=typeof p.pathname=="string"?p.pathname:"",E={id:ue(),text:g,reviewer:{name:f},anchorData:{cssSelector:c,xpath:typeof p.xpath=="string"?p.xpath:"",textSnippet:typeof p.textSnippet=="string"?p.textSnippet:"",pathname:L,screenState:typeof p.screenState=="string"?p.screenState:void 0,viewport:p.viewport&&typeof p.viewport=="object"?p.viewport:{width:0,height:0,dpr:1},clickPctX:typeof p.clickPctX=="number"?p.clickPctX:void 0,clickPctY:typeof p.clickPctY=="number"?p.clickPctY:void 0},anchorStatus:"resolved",status:l.status==="resolved"?"resolved":"open",createdAt:typeof l.createdAt=="number"?l.createdAt:Date.now()},b=(h=(m=L.match(/#.*$/))==null?void 0:m[0])!=null?h:"",T=location.hash;if(b?b===T:!0){let I=V(E.anchorData);I?(w.set(E.id,I),E.anchorStatus="resolved",q(E,I,u.comments.length,r*80),r++):(E.anchorStatus="orphaned",i++)}else E.anchorStatus="resolved",a++;u.comments.push(E)}let s=r+a+i;if(s===0){H("dupe","Already imported \u2014 no new comments");return}P(u),C(),i>0&&a===0?H("partial",`${s} imported \xB7 ${i} couldn't be placed`):a>0&&i===0?H("success",`${s} imported \xB7 ${a} will appear on other screens`):a>0&&i>0?H("partial",`${s} imported \xB7 ${a} on other screens \xB7 ${i} unresolved`):H("success",`${s} comment${s!==1?"s":""} imported`)}),dt(wt),ht(()=>u.comments.filter(e=>e.anchorStatus==="orphaned"),(e,t)=>{let n=u.comments.find(o=>o.id===e);n&&(n.anchorStatus="resolved",w.set(e,t),q(n,t,u.comments.indexOf(n)),P(u),C())},()=>te(u.comments,w)),bt(Z,X,wt),gt()&&Se(!0),xt(u.comments,pe),window.addEventListener("resize",()=>te(u.comments,w)),window.addEventListener("scroll",()=>te(u.comments,w),{passive:!0}),window.addEventListener("hashchange",()=>{setTimeout(()=>{Pe(),C()},100)}),C(),window.Tack={setScreenState(e){Le=e},refresh(){Pe(),C()},arm:Z,disarm:X,isArmed:G,download:()=>we(u)})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Et):Et();})();
