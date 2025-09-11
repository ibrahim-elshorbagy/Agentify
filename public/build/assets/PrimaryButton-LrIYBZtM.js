import{j as a}from"./app-TmW7H2Wv.js";function j({className:t="",disabled:s,children:l,icon:e=null,rounded:r="rounded-xl",withShadow:i=!0,size:n="default",as:o="button",type:c="button",...u}){const g=n==="large"?"md:text-base":"",x=i?"shadow":"",b=e?a.jsx("i",{className:`fa-solid ${e}`}):null,m=n==="large"?"gap-2":"gap-1",p=/\bbg-/.test(t)?"":"bg-green-500 hover:bg-green-600",d=`
      flex items-center ${m} px-4 py-2 text-sm font-semibold text-white
      ${p} ${r} transition-all ${x} ${g}
      ${s?"opacity-70":""} ${t}
  `.trim(),f=o==="button"?{type:c}:{};return a.jsxs(o,{...f,...u,className:d,disabled:s,children:[b,l]})}export{j as P};
