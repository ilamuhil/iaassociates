"use strict";(self.webpackChunkreact_i=self.webpackChunkreact_i||[]).push([[986],{5986:function(e,a,s){s.r(a);var t=s(5861),l=s(9439),r=s(7757),n=s.n(r),i=s(4569),d=s.n(i),o=s(2791),c=s(6871),u=s(2152),v=s(8329),m=s(6960),h=s(7391),p=s(5523),g=s(4454),f=s(6151),x=s(6053),j=s(184);a.default=function(e){var a=e.email,s=e.setEmail,r=(0,o.useContext)(u.Z).useAxiosPrivate(),i=(0,c.UO)().id,N=(0,o.useState)(!0),b=(0,l.Z)(N,2),Z=b[0],C=b[1],S=(0,o.useState)(""),y=(0,l.Z)(S,2),A=y[0],k=y[1],w=(0,o.useState)(""),L=(0,l.Z)(w,2),z=L[0],W=L[1],D=(0,o.useState)(""),I=(0,l.Z)(D,2),P=I[0],F=I[1],T=(0,o.useState)(""),U=(0,l.Z)(T,2),E=U[0],H=U[1],O=(0,o.useState)(""),B=(0,l.Z)(O,2),V=B[0],_=B[1],q=(0,o.useState)(""),G=(0,l.Z)(q,2),M=G[0],Y=G[1],J=(0,o.useState)(""),K=(0,l.Z)(J,2),Q=K[0],R=K[1],X=(0,o.useState)(""),$=(0,l.Z)(X,2),ee=$[0],ae=$[1];(0,o.useEffect)((function(){33!==parseInt(v.Z.get("role"))&&r.get(i?"/addresses/id/".concat(i):"/addresses").then((function(e){var a=e.data;a&&(H(a.adl1),_(a.adl2),ae(a.zipcode+""),F(a.phoneNo),k(a.fName),W(a.lName))}))}),[r,i]);var se=(0,o.useCallback)((function(){var e=Z?"company":"personal",s={adl1:E,adl2:V,zipcode:parseInt(ee),city:M,state:Q,fname:A,lname:z,email:a,phoneNo:P,invoiceType:e};console.log(M,Q);var t=i?"/addresses/billingDetails/id/".concat(i):"/addresses/billingDetails",l=m.Am.loading("Saving address to database");r.post(t,s).then((function(e){m.Am.update(l,{render:e.data.message,type:"success",isLoading:!1,autoClose:1e3})})).catch((function(e){null!==e&&void 0!==e&&e.response?m.Am.update(l,{render:e.response.data,type:"error",isLoading:!1,autoClose:2e3}):(console.error(e.request),m.Am.update(l,{render:"Server Unavailable.Try again later",type:"error",isLoading:!1,autoClose:2e3}))}))}),[E,a,V,ee,Q,M,P,A,z,r,Z,i]),te=(0,o.useCallback)((0,t.Z)(n().mark((function e(){var a,s;return n().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=m.Am.loading("validating address..."),A&&z&&P&&ee||m.Am.update(a,{render:"Please fill in the empty fields",type:"warning",isLoading:!1,autoClose:2e3}),e.prev=2,e.next=5,d().get("https://api.postalpincode.in/pincode/"+ee);case 5:if(null===(s=e.sent)||void 0===s||!s.data||"Error"!==(null===s||void 0===s?void 0:s.data[0].Status)){e.next=11;break}return m.Am.update(a,{render:"You have entered an invalid pincode",type:"error",isLoading:!1,autoClose:2e3}),e.abrupt("return");case 11:null!==s&&void 0!==s&&s.data&&"Success"===(null===s||void 0===s?void 0:s.data[0].Status)&&(m.Am.update(a,{render:"Address validated \u2714\ufe0e",type:"success",isLoading:!1,autoClose:1e3}),R(s.data[0].PostOffice[0].State),Y(s.data[0].PostOffice[0].District),se());case 12:e.next=18;break;case 14:return e.prev=14,e.t0=e.catch(2),m.Am.update(a,{render:"An error occurred try again later",type:"error",isLoading:!1,autoClose:2e3}),e.abrupt("return");case 18:case"end":return e.stop()}}),e,null,[[2,14]])}))),[se,ee,A,z,P]);return(0,j.jsxs)("div",{className:"col",children:[(0,j.jsxs)("div",{className:"row mb-2",children:[(0,j.jsx)("div",{className:"col",children:(0,j.jsx)("div",{className:"form-group",children:(0,j.jsx)(h.Z,{value:A,onChange:function(e){k(e.target.value)},fullWidth:!0,id:"first name",label:Z?"Company/Firm Name":"First Name",variant:"standard"})})}),(0,j.jsx)("div",{className:"col",children:(0,j.jsx)("div",{className:"form-group",children:(0,j.jsx)(h.Z,{value:z,onChange:function(e){W(e.target.value)},fullWidth:!0,id:"last name",label:Z?"GSTIN":"Last Name",variant:"standard"})})})]}),(0,j.jsxs)("div",{className:"row mb-2",children:[(0,j.jsx)("div",{className:"col",children:(0,j.jsx)("div",{className:"form-group",children:(0,j.jsx)(h.Z,{value:a,onChange:function(e){s(e.target.value)},fullWidth:!0,id:"email",label:"email",variant:"standard"})})}),(0,j.jsx)("div",{className:"col",children:(0,j.jsx)("div",{className:"form-group",children:(0,j.jsx)(h.Z,{value:P,onChange:function(e){F(e.target.value)},fullWidth:!0,id:"Phone Number",label:"Phone Number",variant:"standard"})})})]}),(0,j.jsxs)("div",{className:"row",children:[(0,j.jsx)("div",{className:"col-lg-6 mb-3",children:(0,j.jsx)("div",{className:"form-group",children:(0,j.jsx)(h.Z,{value:E,onChange:function(e){H(e.target.value)},fullWidth:!0,id:"Flat Number & Appartment Details",label:"Flat Number & Appartment Details",variant:"standard"})})}),(0,j.jsx)("div",{className:"col-lg-6 mb-3",children:(0,j.jsx)("div",{className:"form-group",children:(0,j.jsx)(h.Z,{value:V,onChange:function(e){_(e.target.value)},fullWidth:!0,id:"Street Address & Locality",label:"Street Address & Locality",variant:"standard",helperText:"Do not provide State/City details"})})})]}),(0,j.jsxs)("div",{className:"row",children:[(0,j.jsx)("div",{className:"col-lg-6 mb-3",children:(0,j.jsx)(p.Z,{control:(0,j.jsx)(g.Z,{checked:Z,size:"small",onChange:function(e){C(e.target.checked)}}),label:"Company Invoice"})}),(0,j.jsx)("div",{className:"col-lg-6 mb-3",children:(0,j.jsx)("div",{className:"form-group",children:(0,j.jsx)(h.Z,{fullWidth:!0,id:"zipcode",label:"zipcode",variant:"standard",value:ee,onChange:function(e){ae(e.target.value)}})})})]}),(0,j.jsxs)("div",{className:"row mb-4",children:[(0,j.jsx)("div",{className:"col-lg-6 mb-3",children:(0,j.jsx)(f.Z,{startIcon:(0,j.jsx)(x.Z,{}),color:"warning",variant:"contained",size:"small",onClick:te,children:"Update Billing Info"})}),(0,j.jsx)("div",{className:"col-lg-6"})]})]})}},6053:function(e,a,s){var t=s(5318);a.Z=void 0;var l=t(s(5649)),r=s(184),n=(0,l.default)((0,r.jsx)("path",{d:"M22 13v3c0 1.1-.9 2-2 2h-3l1 1v2H6v-2l1-1H4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h8v2H4v11h16v-3h2zm-7 2-5-5h4V3h2v7h4l-5 5z"}),"BrowserUpdated");a.Z=n}}]);
//# sourceMappingURL=986.923e7277.chunk.js.map