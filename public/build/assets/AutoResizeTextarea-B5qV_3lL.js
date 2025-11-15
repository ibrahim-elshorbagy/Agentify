import{r,j as i}from"./app-xZ-CxBFC.js";const d=r.forwardRef(({value:n,onChange:a,onKeyDown:o,placeholder:s,disabled:u,className:l=""},f)=>{const t=r.useRef(null);return r.useImperativeHandle(f,()=>({focus:()=>t.current?.focus()})),r.useEffect(()=>{const e=t.current;e&&(e.style.height="auto",e.style.height=`${e.scrollHeight}px`)},[n]),i.jsx("textarea",{ref:t,value:n,onChange:a,onKeyDown:o,placeholder:s,disabled:u,rows:1,className:`w-full resize-none overflow-hidden rounded-lg border border-neutral-300 dark:border-neutral-700
        bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-neutral-100
        focus:border-green-500 focus:ring-2 focus:ring-green-200
        dark:focus:border-green-400 dark:focus:ring-green-900 transition-all
        min-h-[40px] max-h-48 ${l}`,style:{lineHeight:"1.5",fontSize:"0.95rem"}})});export{d as A};
