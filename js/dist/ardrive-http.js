"use strict";let retryStatusCodes=[408,429,440,460,499,500,502,503,504,520,521,522,523,524,525,527,598,599];const isStatusCodeError=e=>e>=400&&e<=599,retryDelay=(e,s)=>s*Math.pow(1.5,e),logMessage=(e,s,t,n)=>`uri: ${e}
  response: Http status error [${s}]: ${t}
  retryAttempts: ${n}`,logger={retry:(e,s,t,n)=>{const o=logMessage(e,s,t,n);console.warn(`Network Request Retry
${o}`)},error:(e,s,t,n)=>{const o=logMessage(e,s,t,n);console.error(`Network Request Error
${o}`)}},requestType={json:{contentType:"application/json; charset=utf-8",getResponse:async e=>await e.json()},bytes:{contentType:"application/octet-stream",getResponse:async e=>await e.arrayBuffer()},text:{contentType:"plain/text; charset=utf-8",getResponse:async e=>await e.text()}},get=async([e,s,t,n,o=!1,c=0,y,a,i])=>{try{const r=y?{Range:`bytes=${a}-${i}`,"Cache-Control":"no-cache"}:void 0,p=await fetch(e,{method:"GET",redirect:"follow",headers:r}),u=p.status,g=p.statusText;if(t>0&&retryStatusCodes.includes(u))return o||logger.retry(e,u,g,c),await get([e,s,t-1,n,o,c+1,y,a,i]);if(isStatusCodeError(u))return{error:`Network Request Error
${logMessage(e,u,g,c)}`,retryAttempts:c};const l=await requestType[`${s}`].getResponse(p);return{statusCode:u,statusMessage:g,data:l,retryAttempts:c}}catch(r){return console.error(r),console.error(r.stack),{error:`${r}`,retryAttempts:c}}},post=async([e,s,t,n,o,c,y=!1,a=0])=>{try{const i=await fetch(e,{method:"POST",headers:{...t!==requestType.text.contentType?{"Content-Type":t}:{}},redirect:"follow",body:s}),r=i.status,p=i.statusText;if(o>0&&retryStatusCodes.includes(r))return y||logger.retry(e,r,p,a),await post([e,s,t,n,o-1,c,y,a+1]);if(isStatusCodeError(r))return{error:`Network Request Error
${logMessage(e,r,p,a)}`,retryAttempts:a};const u=await requestType[`${n}`].getResponse(i);return{statusCode:r,statusMessage:p,data:u,retryAttempts:a}}catch(i){return{error:`${i}`,retryAttempts:a}}};self.get=get,self.post=post;
