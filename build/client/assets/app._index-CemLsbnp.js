import{j as e}from"./index-D0piyJ7G.js";import{u as o,a as l,b as p,c,F as u}from"./components-B1afT1Y1.js";import{P as h,B as r,C as x,T as m}from"./Page-BXg2R-om.js";import{L as n}from"./Layout-CYn5_LOs.js";function v(){const t=o(),s=l();p(),["loading","submitting"].includes(t.state)&&t.formMethod;const{apiKeyGreenlease:a,deliveryFee:d,shop:i}=c();return e.jsx(h,{children:e.jsx(r,{gap:"500",children:e.jsx(n,{children:e.jsx(n.Section,{children:e.jsx(x,{children:e.jsxs(r,{gap:"500",children:[e.jsx(r,{gap:"200",children:e.jsx(m,{as:"h1",variant:"headingMd",children:"Bienvenue dans votre app Greenlease 🎉"})}),e.jsxs(r,{gap:"200",children:[e.jsx("h2",{style:{fontSize:20,fontWeight:"bold",paddingBottom:30},children:"Configuration"}),(s==null?void 0:s.error)&&e.jsx("p",{style:{color:"red"},children:s.error}),(s==null?void 0:s.success)&&e.jsx("p",{style:{color:"green"},children:s.success}),e.jsxs(u,{method:"post",action:`?shop=${i}`,children:[e.jsx("input",{type:"hidden",name:"shop",value:i}),e.jsx("input",{type:"text",name:"apiKeyGreenlease",id:"apiKeyGreenlease",placeholder:"Enter votre clé API",required:!0,style:{padding:5},defaultValue:a}),e.jsx("div",{style:{paddingTop:20,paddingBottom:20},children:e.jsx("input",{type:"text",style:{padding:5},name:"deliveryFee",id:"deliveryFee",placeholder:"Enter votre frais de livraison",required:!0,defaultValue:d})}),e.jsx("button",{type:"submit",style:{padding:10,background:"#0D5537",color:"white",borderRadius:20},children:"Enregistrer vos informations"})]})]})]})})})})})})}export{v as default};