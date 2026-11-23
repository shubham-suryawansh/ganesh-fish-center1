// Simple front-end login (demo gate only; not secure authentication).
const LOGIN_CREDENTIALS = { username: "admin", password: "Ganesh@123" };
const LOGIN_SESSION_KEY = "gfc_owner_session";
if (sessionStorage.getItem(LOGIN_SESSION_KEY) !== "active") document.body.classList.add("login-locked");

const $ = (id) => document.getElementById(id);
const STORAGE = {fish:"fishShop_fish_v1", bills:"fishShop_bills_v1", counter:"fishShop_counter_v1", settings:"fishShop_settings_v2"};
const DEFAULT_SETTINGS = {shopName:"Ganesh Fish Center", owner:"Ganesh gajare", mobile:"7840945168", address:"Nashik, Maharashtra", logo:"🐟", paymentOptions:["Cash"]};
let settings = load(STORAGE.settings, DEFAULT_SETTINGS);
function saveSettings(){localStorage.setItem(STORAGE.settings,JSON.stringify(settings));applyShopBranding()} 
function applyShopBranding(){const name=escapeHTML(settings.shopName||DEFAULT_SETTINGS.shopName);$("shopName").textContent=settings.shopName||DEFAULT_SETTINGS.shopName;$("footerShopName").textContent=settings.shopName||DEFAULT_SETTINGS.shopName;$("shopLogo").textContent=settings.logo||"🐟";document.title=(settings.shopName||DEFAULT_SETTINGS.shopName)+" | Billing System";}
const defaultFish = [
  {id:"f1",name:"Pomfret",price:800},{id:"f2",name:"Surmai",price:700},
  {id:"f3",name:"Bangda",price:250},{id:"f4",name:"Prawns",price:500},
  {id:"f5",name:"Rohu",price:300},{id:"f6",name:"Rawas",price:650}
];
let fish = load(STORAGE.fish, defaultFish);
let bills = load(STORAGE.bills, []);
let cart = [];
let language = "en";
let toastTimer;

const translations = {
 en:{
  shopSystem:"Shop Billing System",dashboard:"Dashboard",newBill:"New Bill",fishManage:"Fish Management",billHistory:"Bill History",salesReport:"Sales Report",localData:"Data saved on this device",welcome:"WELCOME",createBill:"Create Bill",shopOverview:"SHOP OVERVIEW",freshDay:"Fresh sales. Simple billing.",heroText:"Manage fish sales and print customer receipts in seconds.",startBilling:"Start Billing →",todaySales:"Today's Sales",salesToday:"Total sales today",totalBills:"Total Bills",billsToday:"Bills generated today",fishSold:"Fish Sold",quantityToday:"Quantity sold today",fishTypes:"Fish Types",availableCatalog:"Available in catalog",recentBills:"Recent Bills",latestTransactions:"Latest customer transactions",viewAll:"View all →",billNo:"Bill No.",customer:"Customer",date:"Date",amount:"Amount",action:"Action",customerDetails:"Customer Details",optionalCustomer:"Add customer information (optional)",customerName:"Customer Name",mobileNumber:"Mobile Number",fishItems:"Fish Items",addFishWeight:"Add fish and enter weight in kilograms",selectFish:"Select Fish",weightKg:"Weight (KG)",addItem:"Add Item",fish:"Fish",rate:"Rate/KG",weight:"Weight",total:"Total",cartEmpty:"Your bill is empty",cartHint:"Select a fish and add its weight to begin.",billSummary:"Bill Summary",checkTotal:"Check the final amount",totalWeight:"Total Weight",subtotal:"Subtotal",discountRupees:"Discount (₹)",grandTotal:"Grand Total",generatePrint:"Generate & Print Bill",clearBill:"Clear Bill",printHint:"A thermal receipt preview will open. Choose your thermal printer in the print dialog.",fishCatalog:"Fish Catalog",catalogHint:"Manage fish names and selling rates per kilogram",addEditFish:"Add / Edit Fish",fishName:"Fish Name",pricePerKg:"Price per KG (₹)",saveFish:"Save Fish",searchPast:"Search and reprint previous customer bills",dailySummary:"Daily sales summary from saved bills",selectDate:"Select Date",totalSales:"Total Sales",bills:"Bills",totalFishWeight:"Total Fish Weight",quantitySold:"Quantity Sold",salesAmount:"Sales Amount",footerText:"Fish Shop Billing System",edit:"Edit",delete:"Delete",print:"Print",noBills:"No bills found",noFish:"No fish added yet",enterFish:"Please enter a fish name and a valid price.",fishExists:"A fish with this name already exists.",fishSaved:"Fish saved successfully.",fishDeleted:"Fish deleted.",selectValid:"Select a fish and enter a valid weight.",itemAdded:"Item added to bill.",billEmpty:"Add at least one fish item before generating a bill.",discountInvalid:"Discount cannot be greater than subtotal.",billSaved:"Bill saved. Print dialog opened.",billCleared:"Current bill cleared.",confirmDelete:"Delete this fish?",confirmClear:"Clear the current bill?",bill:"Bill",thankYou:"Thank you! Visit again.",phone:"Phone",address:"Address",customerLabel:"Customer",rateLabel:"Rate",kgLabel:"KG",discount:"Discount",netPayable:"NET PAYABLE",cashNote:"Please visit again",unnamed:"Walk-in Customer"
 },
 mr:{
  shopSystem:"दुकान बिलिंग प्रणाली",dashboard:"डॅशबोर्ड",newBill:"नवीन बिल",fishManage:"मासे व्यवस्थापन",billHistory:"बिल इतिहास",salesReport:"विक्री अहवाल",localData:"माहिती या डिव्हाइसवर जतन होते",welcome:"स्वागत आहे",createBill:"बिल तयार करा",shopOverview:"दुकानाचा आढावा",freshDay:"ताजी विक्री. सोपे बिलिंग.",heroText:"माशांची विक्री व्यवस्थापित करा आणि ग्राहकांच्या पावत्या छापा.",startBilling:"बिलिंग सुरू करा →",todaySales:"आजची विक्री",salesToday:"आजची एकूण विक्री",totalBills:"एकूण बिले",billsToday:"आज तयार केलेली बिले",fishSold:"विकलेले मासे",quantityToday:"आज विकलेले वजन",fishTypes:"माशांचे प्रकार",availableCatalog:"यादीतील प्रकार",recentBills:"अलीकडील बिले",latestTransactions:"अलीकडील ग्राहक व्यवहार",viewAll:"सर्व पहा →",billNo:"बिल क्रमांक",customer:"ग्राहक",date:"दिनांक",amount:"रक्कम",action:"कृती",customerDetails:"ग्राहक माहिती",optionalCustomer:"ग्राहकाची माहिती भरा (ऐच्छिक)",customerName:"ग्राहकाचे नाव",mobileNumber:"मोबाईल क्रमांक",fishItems:"माशांचे प्रकार",addFishWeight:"मासा निवडा आणि वजन किलोमध्ये भरा",selectFish:"मासा निवडा",weightKg:"वजन (किलो)",addItem:"मासा जोडा",fish:"मासा",rate:"दर/किलो",weight:"वजन",total:"एकूण",cartEmpty:"तुमचे बिल रिकामे आहे",cartHint:"सुरू करण्यासाठी मासा निवडा आणि वजन भरा.",billSummary:"बिलाचा तपशील",checkTotal:"अंतिम रक्कम तपासा",totalWeight:"एकूण वजन",subtotal:"उपएकूण",discountRupees:"सवलत (₹)",grandTotal:"एकूण रक्कम",generatePrint:"बिल तयार करा व छापा",clearBill:"बिल रिकामे करा",printHint:"थर्मल पावती उघडेल. प्रिंट करताना थर्मल प्रिंटर निवडा.",fishCatalog:"माशांची यादी",catalogHint:"माशांची नावे आणि प्रति किलो विक्री दर व्यवस्थापित करा",addEditFish:"मासा जोडा / संपादित करा",fishName:"माशाचे नाव",pricePerKg:"प्रति किलो दर (₹)",saveFish:"मासा जतन करा",searchPast:"जुनी ग्राहक बिले शोधा आणि पुन्हा छापा",dailySummary:"जतन केलेल्या बिलांमधील दैनिक विक्री",selectDate:"दिनांक निवडा",totalSales:"एकूण विक्री",bills:"बिले",totalFishWeight:"माशांचे एकूण वजन",quantitySold:"विकलेले वजन",salesAmount:"विक्री रक्कम",footerText:"फिश शॉप बिलिंग प्रणाली",edit:"संपादित करा",delete:"हटवा",print:"छापा",noBills:"बिले सापडली नाहीत",noFish:"अद्याप मासे जोडलेले नाहीत",enterFish:"माशाचे नाव आणि योग्य दर भरा.",fishExists:"या नावाचा मासा आधीपासून आहे.",fishSaved:"मासा यशस्वीरित्या जतन केला.",fishDeleted:"मासा हटवला.",selectValid:"मासा निवडा आणि योग्य वजन भरा.",itemAdded:"मासा बिलात जोडला.",billEmpty:"बिल तयार करण्यापूर्वी किमान एक मासा जोडा.",discountInvalid:"सवलत उपएकूण रकमेपेक्षा जास्त असू शकत नाही.",billSaved:"बिल जतन झाले. प्रिंट विंडो उघडली.",billCleared:"सध्याचे बिल रिकामे केले.",confirmDelete:"हा मासा हटवायचा आहे का?",confirmClear:"सध्याचे बिल रिकामे करायचे आहे का?",bill:"बिल",thankYou:"धन्यवाद! पुन्हा भेट द्या.",phone:"फोन",address:"पत्ता",customerLabel:"ग्राहक",rateLabel:"दर",kgLabel:"किलो",discount:"सवलत",netPayable:"देय रक्कम",cashNote:"पुन्हा भेट द्या",unnamed:"रोख ग्राहक"
 }
};
function t(key){return translations[language][key]||translations.en[key]||key}
function load(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):JSON.parse(JSON.stringify(fallback))}catch{return JSON.parse(JSON.stringify(fallback))}}
function save(){localStorage.setItem(STORAGE.fish,JSON.stringify(fish));localStorage.setItem(STORAGE.bills,JSON.stringify(bills))}
function money(n){return "₹"+Number(n||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}
function dateKey(value=new Date()){const d=new Date(value);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function formatDate(value){return new Date(value).toLocaleDateString(language==="mr"?"mr-IN":"en-IN",{day:"2-digit",month:"short",year:"numeric"})}
function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function notify(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600)}
function setPage(name){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${name}`));
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
  $("pageTitle").textContent=t(({dashboard:"dashboard",billing:"newBill",fish:"fishManage",history:"billHistory",reports:"salesReport"})[name]);
  if(name==="dashboard")renderDashboard();
  if(name==="fish")renderFish();
  if(name==="history")renderHistory();
  if(name==="reports")renderReport();
}

function applyLanguage(){document.documentElement.lang=language==="mr"?"mr":"en";document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(t(key))el.textContent=t(key)});$("customerName").placeholder=language==="mr"?"ग्राहकाचे नाव लिहा":"Enter customer name";$("customerMobile").placeholder=language==="mr"?"१० अंकी मोबाईल क्रमांक":"10-digit mobile number";$("historySearch").placeholder=language==="mr"?"बिल क्रमांक किंवा ग्राहकाचे नाव शोधा":"Search by bill number or customer name";$("pageTitle").textContent=document.querySelector(".nav-btn.active")?t(({dashboard:"dashboard",billing:"newBill",fish:"fishManage",history:"billHistory",reports:"salesReport"})[document.querySelector(".nav-btn.active").dataset.page]):t("dashboard");renderFishOptions();renderCart();renderDashboard();renderFish();renderHistory();renderReport()}
function renderFishOptions(){const select=$("fishSelect");const previous=select.value;select.innerHTML=fish.map(f=>`<option value="${f.id}">${escapeHTML(f.name)} — ${money(f.price)}/KG</option>`).join("");if(fish.some(f=>f.id===previous))select.value=previous}
function cartTotals(){const kg=cart.reduce((s,i)=>s+i.weight,0),subtotal=cart.reduce((s,i)=>s+i.weight*i.price,0);return {kg,subtotal}}
function renderCart(){const body=$("cartBody");body.innerHTML=cart.map((item,index)=>`<tr><td><strong>${escapeHTML(item.name)}</strong></td><td>${money(item.price)}</td><td>${item.weight.toFixed(2)} KG</td><td class="amount-cell">${money(item.weight*item.price)}</td><td><button class="small-btn danger-btn" data-remove="${index}" aria-label="Remove">×</button></td></tr>`).join("");$("emptyCart").style.display=cart.length?"none":"flex";const {kg,subtotal}=cartTotals();const discount=Math.max(0,Number($("discount").value)||0);$("summaryKg").textContent=kg.toFixed(2)+" KG";$("subtotal").textContent=money(subtotal);$("grandTotal").textContent=money(Math.max(0,subtotal-discount));body.querySelectorAll("[data-remove]").forEach(btn=>btn.addEventListener("click",()=>{cart.splice(Number(btn.dataset.remove),1);renderCart()}))}
function addItem(){const f=fish.find(x=>x.id===$("fishSelect").value),weight=Number($("fishWeight").value);if(!f||!Number.isFinite(weight)||weight<=0){notify(t("selectValid"));return}cart.push({fishId:f.id,name:f.name,price:Number(f.price),weight});$("fishWeight").value="";renderCart();notify(t("itemAdded"))}
function renderFish(){const body=$("fishTableBody");body.innerHTML=fish.length?fish.map(f=>`<tr><td><strong>${escapeHTML(f.name)}</strong></td><td>${money(f.price)}</td><td><button class="small-btn" data-edit="${f.id}">${t("edit")}</button><button class="small-btn danger-btn" data-delete="${f.id}">${t("delete")}</button></td></tr>`).join(""):`<tr><td colspan="3" class="empty-row">${t("noFish")}</td></tr>`;body.querySelectorAll("[data-edit]").forEach(b=>b.addEventListener("click",()=>editFish(b.dataset.edit)));body.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>deleteFish(b.dataset.delete)));$("fishCount").textContent=fish.length;renderFishOptions()}
function editFish(id){const f=fish.find(x=>x.id===id);if(!f)return;$("newFishName").value=f.name;$("newFishPrice").value=f.price;$("editFishId").value=f.id;$("saveFishBtn").textContent=language==="mr"?"बदल जतन करा":"Update Fish";$("newFishName").focus()}
function resetFishForm(){$("newFishName").value="";$("newFishPrice").value="";$("editFishId").value="";$("saveFishBtn").textContent=t("saveFish")}
function saveFish(){const name=$("newFishName").value.trim(),price=Number($("newFishPrice").value),id=$("editFishId").value;if(!name||!Number.isFinite(price)||price<=0){notify(t("enterFish"));return}if(fish.some(f=>f.name.toLowerCase()===name.toLowerCase()&&f.id!==id)){notify(t("fishExists"));return}if(id){const f=fish.find(x=>x.id===id);if(f){f.name=name;f.price=price}}else fish.push({id:"f"+Date.now(),name,price});save();resetFishForm();renderFish();notify(t("fishSaved"))}
function deleteFish(id){if(!confirm(t("confirmDelete")))return;fish=fish.filter(f=>f.id!==id);save();renderFish();notify(t("fishDeleted"))}
function makeBill(){if(!cart.length){notify(t("billEmpty"));return}const {kg,subtotal}=cartTotals(),discount=Math.max(0,Number($("discount").value)||0);if(discount>subtotal){notify(t("discountInvalid"));return}const number=Number(localStorage.getItem(STORAGE.counter)||0)+1;localStorage.setItem(STORAGE.counter,String(number));const bill={id:Date.now(),number:`GFC-${String(number).padStart(5,"0")}`,createdAt:new Date().toISOString(),customer:$("customerName").value.trim()||t("unnamed"),mobile:$("customerMobile").value.trim(),items:cart.map(x=>({...x})),kg,subtotal,discount,total:subtotal-discount,paymentMethod:"Cash"};bills.unshift(bill);save();openReceipt(bill);cart=[];$("customerName").value="";$("customerMobile").value="";$("discount").value="0";renderCart();renderDashboard();notify(t("billSaved"))}
function receiptHTML(b){const rows=b.items.map(i=>`<tr><td>${escapeHTML(i.name)}</td><td>${i.weight.toFixed(2)}</td><td>${Number(i.price).toFixed(2)}</td><td>${(i.weight*i.price).toFixed(2)}</td></tr>`).join("");return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${t("bill")} ${b.number}</title><style>
@page{size:80mm auto;margin:3mm}*{box-sizing:border-box}body{width:74mm;margin:0 auto;color:#000;font-family:Arial,'Noto Sans Devanagari',sans-serif;font-size:11px}h2{font-size:18px;text-align:center;margin:2px 0}p{margin:3px 0;text-align:center}.center{text-align:center}.line{border-top:1px dashed #000;margin:7px 0}.meta{display:flex;justify-content:space-between;gap:5px;margin:4px 0}.customer{margin:5px 0;line-height:1.5}table{width:100%;border-collapse:collapse;font-size:10px}th,td{text-align:right;padding:4px 1px}th:first-child,td:first-child{text-align:left;max-width:27mm;overflow-wrap:anywhere}thead{border-bottom:1px solid #000}tfoot td{font-weight:bold}.totals{margin-top:6px}.totals div{display:flex;justify-content:space-between;margin:4px 0}.grand{font-size:15px;font-weight:bold;border-top:1px dashed #000;padding-top:7px}.thanks{font-weight:bold;font-size:12px;margin-top:12px}.small{font-size:9px}
</style></head><body><h2>${escapeHTML(settings.logo||"🐟")} ${escapeHTML(settings.shopName||DEFAULT_SETTINGS.shopName)}</h2><p><b>${escapeHTML(settings.owner||DEFAULT_SETTINGS.owner)}</b></p><p class="small">${escapeHTML(settings.address||DEFAULT_SETTINGS.address)}</p><p class="small">${t("phone")}: ${escapeHTML(settings.mobile||DEFAULT_SETTINGS.mobile)}</p><p class="small">${language==="mr"?"ताजे मासे • उत्तम गुणवत्ता":"Fresh Fish • Best Quality"}</p><div class="line"></div><div class="meta"><span>${escapeHTML(b.number)}</span><span>${formatDate(b.createdAt)}</span></div><div class="customer">${t("customerLabel")}: <b>${escapeHTML(b.customer)}</b>${b.mobile?`<br>${t("phone")}: ${escapeHTML(b.mobile)}`:""}</div><div class="line"></div><table><thead><tr><th>${t("fish")}</th><th>${t("kgLabel")}</th><th>${t("rateLabel")}</th><th>${t("total")}</th></tr></thead><tbody>${rows}</tbody></table><div class="line"></div><div class="totals"><div><span>${t("totalWeight")}</span><b>${b.kg.toFixed(2)} KG</b></div><div><span>${t("subtotal")}</span><b>₹${b.subtotal.toFixed(2)}</b></div><div><span>${t("discount")}</span><b>₹${b.discount.toFixed(2)}</b></div><div><span>Payment</span><b>${escapeHTML(b.paymentMethod||"Cash")}</b></div><div class="grand"><span>${t("netPayable")}</span><span>₹${b.total.toFixed(2)}</span></div></div><div class="line"></div><p class="thanks">${t("thankYou")}</p><p class="small">${t("cashNote")}</p><script>window.onload=()=>{window.print()};window.onafterprint=()=>window.close();</script></body></html>`}
function openReceipt(b){const win=window.open("","_blank","width=420,height=700");if(!win){notify(language==="mr"?"पॉप-अप ब्लॉक झाला. ब्राउझरमध्ये पॉप-अप परवानगी द्या.":"Pop-up blocked. Please allow pop-ups for printing.");return}win.document.open();win.document.write(receiptHTML(b));win.document.close()}
function printBill(id){const b=bills.find(x=>x.id===Number(id));if(b)openReceipt(b)}
function renderDashboard(){const today=dateKey(),list=bills.filter(b=>dateKey(b.createdAt)===today);$("todaySales").textContent=money(list.reduce((s,b)=>s+b.total,0));$("todayBills").textContent=list.length;$("todayKg").textContent=list.reduce((s,b)=>s+b.kg,0).toFixed(2)+" KG";$("fishCount").textContent=fish.length;const body=$("recentBillsBody");body.innerHTML=list.slice(0,6).map(b=>`<tr><td><strong>${b.number}</strong></td><td>${escapeHTML(b.customer)}</td><td>${formatDate(b.createdAt)}</td><td class="amount-cell">${money(b.total)}</td><td><button class="small-btn" data-print="${b.id}">${t("print")}</button></td></tr>`).join("")||`<tr><td colspan="5" class="empty-row">${t("noBills")}</td></tr>`;body.querySelectorAll("[data-print]").forEach(btn=>btn.addEventListener("click",()=>printBill(btn.dataset.print)))}
function renderHistory(){const query=$("historySearch").value.trim().toLowerCase();const list=bills.filter(b=>b.number.toLowerCase().includes(query)||b.customer.toLowerCase().includes(query)||(b.mobile||"").toLowerCase().includes(query));const body=$("historyBody");body.innerHTML=list.map(b=>`<tr><td><strong>${b.number}</strong></td><td>${escapeHTML(b.customer)}</td><td>${formatDate(b.createdAt)}</td><td>${b.kg.toFixed(2)} KG</td><td class="amount-cell">${money(b.total)}</td><td><button class="small-btn" data-print="${b.id}">${t("print")}</button></td></tr>`).join("")||`<tr><td colspan="6" class="empty-row">${t("noBills")}</td></tr>`;body.querySelectorAll("[data-print]").forEach(btn=>btn.addEventListener("click",()=>printBill(btn.dataset.print)))}
function exportCsv(){const date=$("reportDate").value||dateKey();const list=bills.filter(b=>dateKey(b.createdAt)===date);const rows=[["Bill No","Date","Customer","Customer Mobile","Fish","Weight KG","Rate per KG","Line Total","Discount","Grand Total","Payment"]];list.forEach(b=>b.items.forEach(i=>rows.push([b.number,new Date(b.createdAt).toLocaleString("en-IN"),b.customer,b.mobile||"",i.name,i.weight,i.price,(i.weight*i.price).toFixed(2),b.discount,b.total,b.paymentMethod||"Cash"])));const csv=rows.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`Ganesh_Fish_Center_Sales_${date}.csv`;a.click();URL.revokeObjectURL(url);notify("Sales CSV exported.")}
function backupData(){const payload={app:"Ganesh Fish Center Billing System",version:"2.0",exportedAt:new Date().toISOString(),settings,fish,bills,counter:Number(localStorage.getItem(STORAGE.counter)||0)};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`Ganesh_Fish_Center_Backup_${dateKey()}.json`;a.click();URL.revokeObjectURL(url);notify("Backup downloaded successfully.")}
function restoreData(file){if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);if(!Array.isArray(data.fish)||!Array.isArray(data.bills))throw new Error("Invalid backup");if(!confirm("Restore this backup? Current fish and bill data will be replaced."))return;fish=data.fish;bills=data.bills;settings={...DEFAULT_SETTINGS,...(data.settings||{})};localStorage.setItem(STORAGE.counter,String(Number(data.counter)||bills.length));save();saveSettings();renderFishOptions();renderFish();renderDashboard();renderHistory();renderReport();notify("Backup restored successfully.")}catch(e){notify("Could not restore: invalid backup file.")}};reader.readAsText(file)}
function renderReport(){const date=$("reportDate").value||dateKey();const list=bills.filter(b=>dateKey(b.createdAt)===date);$("reportSales").textContent=money(list.reduce((s,b)=>s+b.total,0));$("reportBills").textContent=list.length;$("reportKg").textContent=list.reduce((s,b)=>s+b.kg,0).toFixed(2)+" KG";const aggregate={};list.forEach(b=>b.items.forEach(i=>{aggregate[i.name]??={kg:0,amount:0};aggregate[i.name].kg+=i.weight;aggregate[i.name].amount+=i.weight*i.price}));$("reportFishBody").innerHTML=Object.entries(aggregate).map(([name,v])=>`<tr><td>${escapeHTML(name)}</td><td>${v.kg.toFixed(2)} KG</td><td class="amount-cell">${money(v.amount)}</td></tr>`).join("")||`<tr><td colspan="3" class="empty-row">${t("noBills")}</td></tr>`}
function clearBill(){if(!cart.length&&!$("customerName").value.trim())return;if(!confirm(t("confirmClear")))return;cart=[];$("customerName").value="";$("customerMobile").value="";$("discount").value="0";renderCart();notify(t("billCleared"))}
// Login and logout controls are registered once when the app loads.
const loginForm = $("loginForm");
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = $("loginUsername").value.trim();
  const password = $("loginPassword").value;
  if (username === LOGIN_CREDENTIALS.username && password === LOGIN_CREDENTIALS.password) {
    sessionStorage.setItem(LOGIN_SESSION_KEY, "active");
    document.body.classList.remove("login-locked");
    $("loginError").textContent = "";
    loginForm.reset();
    $("customerName").focus();
  } else {
    $("loginError").textContent = "Incorrect username or password. Please try again.";
    $("loginPassword").value = "";
    $("loginPassword").focus();
  }
});
$("togglePassword").addEventListener("click", () => {
  const field = $("loginPassword");
  const show = field.type === "password";
  field.type = show ? "text" : "password";
  $("togglePassword").textContent = show ? "Hide" : "Show";
  $("togglePassword").setAttribute("aria-label", show ? "Hide password" : "Show password");
});
$("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem(LOGIN_SESSION_KEY);
  document.body.classList.add("login-locked");
  $("loginError").textContent = "";
  $("loginUsername").value = "";
  $("loginPassword").value = "";
  $("loginUsername").focus();
});

document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>setPage(b.dataset.page)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>setPage(b.dataset.go)));
$("headerNewBill").addEventListener("click",()=>setPage("billing"));
$("languageSelect").addEventListener("change",e=>{language=e.target.value;applyLanguage()});
$("addItemBtn").addEventListener("click",addItem);
$("fishWeight").addEventListener("keydown",e=>{if(e.key==="Enter")addItem()});
$("discount").addEventListener("input",renderCart);
$("generateBillBtn").addEventListener("click",makeBill);
$("clearBillBtn").addEventListener("click",clearBill);
$("saveFishBtn").addEventListener("click",saveFish);
$("historySearch").addEventListener("input",renderHistory);
$("reportDate").addEventListener("change",renderReport);
$("exportCsvBtn").addEventListener("click",exportCsv);
$("backupBtn").addEventListener("click",backupData);
$("restoreInput").addEventListener("change",e=>{restoreData(e.target.files[0]);e.target.value=""});
$("year").textContent=new Date().getFullYear();
applyShopBranding();
$("reportDate").value=dateKey();
renderFishOptions();renderCart();renderDashboard();renderFish();renderHistory();renderReport();
