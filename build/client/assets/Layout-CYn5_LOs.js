import{R as t}from"./index-D0piyJ7G.js";import{d as l,v as d,T as r,a as y}from"./Page-BXg2R-om.js";var o={Layout:"Polaris-Layout",Section:"Polaris-Layout__Section","Section-fullWidth":"Polaris-Layout__Section--fullWidth","Section-oneHalf":"Polaris-Layout__Section--oneHalf","Section-oneThird":"Polaris-Layout__Section--oneThird",AnnotatedSection:"Polaris-Layout__AnnotatedSection",AnnotationWrapper:"Polaris-Layout__AnnotationWrapper",AnnotationContent:"Polaris-Layout__AnnotationContent",Annotation:"Polaris-Layout__Annotation"},c={TextContainer:"Polaris-TextContainer",spacingTight:"Polaris-TextContainer--spacingTight",spacingLoose:"Polaris-TextContainer--spacingLoose"};function S({spacing:n,children:a}){const e=l(c.TextContainer,n&&c[d("spacing",n)]);return t.createElement("div",{className:e},a)}function p({children:n,title:a,description:e,id:i}){const s=typeof e=="string"?t.createElement(r,{as:"p",variant:"bodyMd"},e):e;return t.createElement("div",{className:o.AnnotatedSection},t.createElement("div",{className:o.AnnotationWrapper},t.createElement("div",{className:o.Annotation},t.createElement(S,{spacing:"tight"},t.createElement(r,{id:i,variant:"headingMd",as:"h2"},a),s&&t.createElement(y,{color:"text-secondary"},s))),t.createElement("div",{className:o.AnnotationContent},n)))}function m({children:n,variant:a}){const e=l(o.Section,o[`Section-${a}`]);return t.createElement("div",{className:e},n)}const u=function({sectioned:a,children:e}){const i=a?t.createElement(m,null,e):e;return t.createElement("div",{className:o.Layout},i)};u.AnnotatedSection=p;u.Section=m;export{u as L,S as T};
