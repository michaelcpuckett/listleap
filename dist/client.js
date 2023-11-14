!// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
function(e,t,n,r,o){/* eslint-disable no-undef */var l="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},s="function"==typeof l[r]&&l[r],a=s.cache||{},i="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function u(t,n){if(!a[t]){if(!e[t]){// if we cannot find the module within our internal map or
// cache jump to the current global require ie. the last bundle
// that was added to the page.
var o="function"==typeof l[r]&&l[r];if(!n&&o)return o(t,!0);// If there are other bundles on this page the require from the
// previous one is saved to 'previousRequire'. Repeat this as
// many times as there are bundles until the module is found or
// we exhaust the require chain.
if(s)return s(t,!0);// Try the node require function if it exists.
if(i&&"string"==typeof t)return i(t);var d=Error("Cannot find module '"+t+"'");throw d.code="MODULE_NOT_FOUND",d}m.resolve=function(n){var r=e[t][1][n];return null!=r?r:n},m.cache={};var c=a[t]=new u.Module(t);e[t][0].call(c.exports,m,c,c.exports,this)}return a[t].exports;function m(e){var t=m.resolve(e);return!1===t?{}:u(t)}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=a,u.parent=s,u.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(u,"root",{get:function(){return l[r]}}),l[r]=u;for(var d=0;d<t.length;d++)u(t[d]);if(n){// Expose entry point to Node, AMD or browser globals
// Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
var c=u(n);// CommonJS
"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):o&&(this[o]=c)}}({gUvsp:[function(e,t,n){e("elements/AutoSaveTextElement"),e("elements/AutoSaveCheckboxElement"),e("elements/AutoSaveSearchElement"),e("elements/ClearSearchElement"),e("elements/UnloadHandlerElement"),e("elements/PostFormElement");let r="scroll-position-y",o="focus-element-id",l=sessionStorage.getItem(r)||0;window.scrollTo(0,Number(l));let s=window.document.querySelector('[data-auto-focus="true"]'),a=sessionStorage.getItem(o)||"",i=window.document.getElementById(a),u=s||i;u instanceof HTMLElement&&(u.focus({preventScroll:!0}),u instanceof HTMLInputElement&&u.value.length>0&&("text"===u.type||"search"===u.type)&&(u.selectionStart=u.selectionEnd=u.value.length)),window.addEventListener("scroll",()=>{window.sessionStorage.setItem(r,`${window.scrollY}`)}),window.document.body.addEventListener("focusin",()=>{sessionStorage.setItem(o,window.document.activeElement?.id||"")})},{"elements/AutoSaveTextElement":"jpb0K","elements/AutoSaveCheckboxElement":"3MJok","elements/UnloadHandlerElement":"bGTnF","elements/PostFormElement":"cKAw4","elements/AutoSaveSearchElement":"8q7LM","elements/ClearSearchElement":"foex1"}],jpb0K:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"AutoSaveTextElement",()=>a);var o=e("escape-string-regexp"),l=r.interopDefault(o),s=e("elements/BaseAutoSaveElement");class a extends s.BaseAutoSaveElement{connectedCallback(){this.inputElement.addEventListener("change",this.boundChangeHandler)}disconnectedCallback(){this.inputElement.removeEventListener("change",this.boundChangeHandler)}handleChange(){let e=this.inputElement.value,t=this.inputElement.form;if(!t)return;let n=t.getAttribute("action");if(!n)return;let r=new FormData(t).get("_method")?.toString()||"";["PUT","PATCH"].includes(r)?this.patch(n,e).then(()=>{let t=e?"^"+(0,l.default)(e)+"$":"^$";this.inputElement.setAttribute("pattern",t)}):"POST"===r&&this.inputElement.validity.patternMismatch&&t.submit()}}window.customElements.define("auto-save-text",a)},{"escape-string-regexp":"9RGhI","elements/BaseAutoSaveElement":"gOsXZ","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"9RGhI":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");function o(e){if("string"!=typeof e)throw TypeError("Expected a string");// Escape characters with special meaning either inside or outside character sets.
// Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
return e.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}r.defineInteropFlag(n),r.export(n,"default",()=>o)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],k3151:[function(e,t,n){n.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},n.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.exportAll=function(e,t){return Object.keys(e).forEach(function(n){"default"===n||"__esModule"===n||t.hasOwnProperty(n)||Object.defineProperty(t,n,{enumerable:!0,get:function(){return e[n]}})}),t},n.export=function(e,t,n){Object.defineProperty(e,t,{enumerable:!0,get:n})}},{}],gOsXZ:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"BaseAutoSaveElement",()=>s);var o=e("shared/getUniqueId"),l=e("elements/UnloadHandlerElement");class s extends HTMLElement{constructor(){if(super(),!this.shadowRoot)throw Error("Declarative shadow root not supported");let e=this.shadowRoot.querySelector("slot");if(!(e instanceof HTMLSlotElement))throw Error("No slot element provided");let t=e.assignedNodes();if(!t||!t.length)throw Error("No content provided");let n=t.find(function(e){return e instanceof HTMLInputElement});if(!n)throw Error("No input element provided");let r=window.document.querySelector("unload-handler");if(!(r instanceof HTMLElement))throw Error("No unload handler element found");this.inputElement=n,this.inputId=n.id||(0,o.getUniqueId)(),this.unloadHandlerElement=r,this.boundChangeHandler=this.handleChange.bind(this),this.boundInputHandler=this.handleInput.bind(this)}handleChange(){}handleInput(){}markDirty(){let e=this.unloadHandlerElement.getAttribute(l.DIRTY_ELEMENTS_KEY)||"",t=e?e.split(","):[];t.push(this.inputId);let n=Array.from(new Set(t)),r=n.join(",");this.unloadHandlerElement.setAttribute(l.DIRTY_ELEMENTS_KEY,r)}markClean(){let e=this.unloadHandlerElement.getAttribute(l.DIRTY_ELEMENTS_KEY)||"",t=e?e.split(","):[],n=t.filter(e=>e!==this.inputId).join(",");this.unloadHandlerElement.setAttribute(l.DIRTY_ELEMENTS_KEY,n)}async patch(e,t){let n=new FormData;return n.append("_method","PATCH"),n.append(this.inputElement.name,t),window.fetch(e,{method:"POST",body:n}).then(e=>{if(404===e.status)throw Error("Not found")}).catch(e=>{console.log(e)})}}},{"shared/getUniqueId":"eClT9","elements/UnloadHandlerElement":"bGTnF","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],eClT9:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"getUniqueId",()=>l);var o=e("uuid");function l(){return`${Date.now()}-${(0,o.v4)()}`}},{uuid:"klst7","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],klst7:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"v1",()=>l.default),r.export(n,"v3",()=>a.default),r.export(n,"v4",()=>u.default),r.export(n,"v5",()=>c.default),r.export(n,"NIL",()=>f.default),r.export(n,"version",()=>h.default),r.export(n,"validate",()=>v.default),r.export(n,"stringify",()=>j.default),r.export(n,"parse",()=>w.default);var o=e("./v1.js"),l=r.interopDefault(o),s=e("./v3.js"),a=r.interopDefault(s),i=e("./v4.js"),u=r.interopDefault(i),d=e("./v5.js"),c=r.interopDefault(d),m=e("./nil.js"),f=r.interopDefault(m),p=e("./version.js"),h=r.interopDefault(p),E=e("./validate.js"),v=r.interopDefault(E),g=e("./stringify.js"),j=r.interopDefault(g),b=e("./parse.js"),w=r.interopDefault(b)},{"./v1.js":!1,"./v3.js":!1,"./v4.js":"fpA4M","./v5.js":!1,"./nil.js":!1,"./version.js":!1,"./validate.js":!1,"./stringify.js":!1,"./parse.js":!1,"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],fpA4M:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n);var o=e("./native.js"),l=r.interopDefault(o),s=e("./rng.js"),a=r.interopDefault(s),i=e("./stringify.js");n.default=function(e,t,n){if(l.default.randomUUID&&!t&&!e)return(0,l.default).randomUUID();e=e||{};let r=e.random||(e.rng||(0,a.default))();// Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,t){n=n||0;for(let e=0;e<16;++e)t[n+e]=r[e];return t}return(0,i.unsafeStringify)(r)}},{"./native.js":"2mj2P","./rng.js":"lpvWd","./stringify.js":"fHrI1","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"2mj2P":[function(e,t,n){e("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(n);let r="undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto);n.default={randomUUID:r}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],lpvWd:[function(e,t,n){let r;// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(n),o.export(n,"default",()=>s);let l=new Uint8Array(16);function s(){// lazy load so that environments that need to polyfill have a chance to do so
if(!r&&!// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
(r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return r(l)}},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],fHrI1:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"unsafeStringify",()=>a);var o=e("./validate.js"),l=r.interopDefault(o);/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */let s=[];for(let e=0;e<256;++e)s.push((e+256).toString(16).slice(1));function a(e,t=0){// Note: Be careful editing this code!  It's been tuned for performance
// and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
return s[e[t+0]]+s[e[t+1]]+s[e[t+2]]+s[e[t+3]]+"-"+s[e[t+4]]+s[e[t+5]]+"-"+s[e[t+6]]+s[e[t+7]]+"-"+s[e[t+8]]+s[e[t+9]]+"-"+s[e[t+10]]+s[e[t+11]]+s[e[t+12]]+s[e[t+13]]+s[e[t+14]]+s[e[t+15]]}n.default=function(e,t=0){let n=a(e,t);// Consistency check for valid UUID.  If this throws, it's likely due to one
// of the following:
// - One or more input array values don't map to a hex octet (leading to
// "undefined" in the uuid)
// - Invalid input values for the RFC `version` or `variant` fields
if(!(0,l.default)(n))throw TypeError("Stringified UUID is invalid");return n}},{"./validate.js":"d35r5","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],d35r5:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n);var o=e("./regex.js"),l=r.interopDefault(o);n.default=function(e){return"string"==typeof e&&(0,l.default).test(e)}},{"./regex.js":"agidw","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],agidw:[function(e,t,n){e("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(n),n.default=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],bGTnF:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"DIRTY_ELEMENTS_KEY",()=>o),r.export(n,"UnloadHandlerElement",()=>l);let o="dirty-elements";class l extends HTMLElement{constructor(){super(),this.boundBeforeUnloadHandler=this.handleBeforeUnload.bind(this)}static get observedAttributes(){return["dirty-elements"]}attributeChangedCallback(e,t,n){"dirty-elements"===e&&(n?this.triggerBeforeUnload():this.removeBeforeUnload())}triggerBeforeUnload(){window.onbeforeunload||(window.onbeforeunload=this.boundBeforeUnloadHandler)}removeBeforeUnload(){window.onbeforeunload&&(window.onbeforeunload=null)}handleBeforeUnload(e){console.log(e),console.log(e.composedPath()),e.preventDefault(),e.returnValue=""}}window.customElements.define("unload-handler",l)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"3MJok":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"AutoSaveCheckboxElement",()=>l);var o=e("elements/BaseAutoSaveElement");class l extends o.BaseAutoSaveElement{connectedCallback(){this.inputElement.addEventListener("input",this.boundInputHandler)}disconnectedCallback(){this.inputElement.removeEventListener("input",this.boundInputHandler)}handleInput(){let e=this.inputElement.checked,t=e?this.inputElement.value:"",n=this.inputElement.form;if(!n)return;let r=n.getAttribute("action");if(!r)return;let o=new FormData(n).get("_method")?.toString()||"";["PUT","PATCH"].includes(o)?this.patch(r,t).then(()=>{window.location.reload()}):this.inputElement.checked!==this.inputElement.defaultChecked?this.markDirty():this.markClean()}}window.customElements.define("auto-save-checkbox",l)},{"elements/BaseAutoSaveElement":"gOsXZ","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],cKAw4:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"PostFormElement",()=>l);var o=e("elements/UnloadHandlerElement");class l extends HTMLElement{connectedCallback(){let e=this.querySelector("form");if(!(e instanceof HTMLFormElement))throw Error("PostFormElement must contain a form element");this.formElement=e,this.formElement.addEventListener("submit",this.boundSubmitHandler)}disconnectedCallback(){this.formElement&&this.formElement.removeEventListener("submit",this.boundSubmitHandler)}handleFormSubmit(e){if(e.preventDefault(),!this.formElement)return;let t=window.document.querySelector("unload-handler");if(!t)return;let n=t.getAttribute(o.DIRTY_ELEMENTS_KEY)||"",r=n?n.split(","):[],l=Array.from(this.formElement.elements),s=r.filter(e=>{let t=window.document.getElementById(e);return t&&!l.includes(t)}).join(",");t.setAttribute(o.DIRTY_ELEMENTS_KEY,s),this.formElement.submit()}constructor(...e){super(...e),this.boundSubmitHandler=this.handleFormSubmit.bind(this)}}window.customElements.define("post-form",l)},{"elements/UnloadHandlerElement":"bGTnF","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"8q7LM":[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"AutoSaveSearchElement",()=>a);var o=e("debounce"),l=r.interopDefault(o),s=e("elements/BaseAutoSaveElement");class a extends s.BaseAutoSaveElement{connectedCallback(){this.inputElement.addEventListener("input",this.debouncedInputHandler)}disconnectedCallback(){this.inputElement.removeEventListener("input",this.debouncedInputHandler)}handleInput(){let e=this.inputElement.form;e&&e.submit()}constructor(...e){super(...e),this.debouncedInputHandler=(0,l.default)(this.boundInputHandler,350)}}window.customElements.define("auto-save-search",a)},{debounce:"7Bek2","elements/BaseAutoSaveElement":"gOsXZ","@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}],"7Bek2":[function(e,t,n){/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */function r(e,t,n){function r(){var u=Date.now()-a;u<t&&u>=0?o=setTimeout(r,t-u):(o=null,n||(i=e.apply(s,l),s=l=null))}null==t&&(t=100);var o,l,s,a,i,u=function(){s=this,l=arguments,a=Date.now();var u=n&&!o;return o||(o=setTimeout(r,t)),u&&(i=e.apply(s,l),s=l=null),i};return u.clear=function(){o&&(clearTimeout(o),o=null)},u.flush=function(){o&&(i=e.apply(s,l),s=l=null,clearTimeout(o),o=null)},u}// Adds compatibility for ES modules
r.debounce=r,t.exports=r},{}],foex1:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"ClearSearchElement",()=>o);class o extends HTMLElement{connectedCallback(){let e=this.querySelector("button");if(!(e instanceof HTMLButtonElement))throw Error("No button element provided");let t=e.form;if(!(t instanceof HTMLFormElement))throw Error("No form element provided");let n=Array.from(t.elements).find(function(e){return e instanceof HTMLInputElement&&"search"===e.type});if(!n)throw Error("No search input element provided");this.buttonElement=e,this.formElement=t,this.searchInputElement=n,this.buttonElement.addEventListener("click",this.boundClickHandler)}disconnectedCallback(){this.buttonElement&&this.buttonElement.removeEventListener("click",this.boundClickHandler)}handleClick(){if(!this.searchInputElement)throw Error("No search input element provided");if(!this.formElement)throw Error("No form element provided");this.searchInputElement.removeAttribute("name"),this.formElement.submit()}constructor(...e){super(...e),this.boundClickHandler=this.handleClick.bind(this)}}window.customElements.define("clear-search",o)},{"@parcel/transformer-js/src/esmodule-helpers.js":"k3151"}]},["gUvsp"],"gUvsp","parcelRequireb585")//# sourceMappingURL=client.js.map
;
//# sourceMappingURL=client.js.map
