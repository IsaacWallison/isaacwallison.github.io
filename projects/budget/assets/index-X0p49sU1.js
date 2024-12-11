var b=Object.defineProperty;var B=(t,e,n)=>e in t?b(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var x=(t,e,n)=>B(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();function o(t){return document.querySelector(t)}class d{static getExpenseById(e){return this.getExpenses().find(i=>i.id===e)}static getExpenses(){return JSON.parse(this.storage.getItem("expenses")||"[]")}static addExpense(e){const n=this.getExpenses();n.push(e),this.store(n)}static removeExpenseById(e){const i=this.getExpenses().filter(s=>s.id!==e);this.store(i)}static updateExpenseById(e,n){const s=this.getExpenses().map(r=>(r.id===e&&Object.entries(n).forEach(([c,m])=>{c==="description"&&(r.description=m),c==="expenditure"&&(r.expenditure=m)}),r));this.store(s)}static store(e){this.storage.setItem("expenses",JSON.stringify(e))}}x(d,"storage",sessionStorage);const l=t=>new Intl.NumberFormat("pt-br",{style:"currency",currency:"BRL"}).format(t);class f{static getMoney(){return this.storage.getItem("user-money")||0}static updateMoney(e){this.storage.setItem("user-money",e.toString())}}x(f,"storage",sessionStorage);const I=()=>d.getExpenses().reduce((e,n)=>e+n.expenditure,0),L=()=>`
    <thead>
        <caption id='expenses'>Expenses Board</caption>
        <tr>
          <th>Description</th>
          <th>Amount</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
    </thead>
    <tbody id='expense-items'></tbody>
    `,M=t=>`
            <tr class='expense-alarm'>
                <td>${t.description}</td>
                <td>${l(t.expenditure)}</td>
                <td><button class="btn--blue fas fa-edit" data-event="edit" data-expense='${t.id}'></button></td>
                <td><button class="btn--alarm fas fa-minus" data-event="delete" data-expense='${t.id}'></button></td>
            </tr>
        `,T=()=>{const t=o("#expenses-board"),e=o("#no-expenses");e.classList.remove("none"),t.innerHTML="";const n=d.getExpenses();if(!n.length)return;e.classList.add("none"),t.insertAdjacentHTML("beforeend",L());const i=o("#expense-items");n.forEach(s=>{i==null||i.insertAdjacentHTML("beforeend",M(s))})},p=()=>{const t=f.getMoney(),e=o("#form-money"),n=o("#info-money"),i=o("#info-expense"),s=o("#info-result"),r=I(),c=+t-r;+t>0&&(e.value=t.toString()),n.innerText=l(+t||+e.value),i.innerText=l(-r),s.innerText=l(c),s.classList.remove("alarm","positive"),s.classList.add(`${c<0?"alarm":"positive"}`),f.updateMoney(+e.value),T()},S=()=>{const t=o("#form-description"),e=o("#form-expenditure");if(!e.value)return;const n={id:Date.now(),description:t.value||"No description",expenditure:+e.value};d.addExpense(n),t.value="",e.value="",p()},O=t=>{t.target instanceof HTMLInputElement&&f.updateMoney(+t.target.value),p()};function y(t){return document.querySelectorAll(t)}const g=t=>{y(t).forEach(e=>e.disabled=!0)},a=t=>{var e;if(t instanceof HTMLElement){t.classList.toggle("none");return}(e=o(t))==null||e.classList.toggle("none")},u={isEditing:!1,expenseToBeEditedId:0},N=t=>{const e=d.getExpenseById(t),n=o("#form-description"),i=o("#form-expenditure");u.isEditing=!0,u.expenseToBeEditedId=t,g("button[data-event='edit']"),g("button[data-event='delete']"),a("#create-expense"),a("#cancel-edit"),a("#confirm-edit"),e!=null&&e.description&&(n.value=e.description),e!=null&&e.expenditure&&(i.value=`${e.expenditure}`),n.focus()},A=t=>{d.removeExpenseById(t),p()},H=t=>{if(t.target instanceof HTMLButtonElement){const e=Number(t.target.dataset.expense);if(t.target.dataset.event==="delete")return A(e);if(t.target.dataset.event==="edit")return N(e)}},E=t=>{y(t).forEach(e=>e.disabled=!1)},h=()=>{u.isEditing=!1,u.expenseToBeEditedId=0,a("#create-expense"),a("#cancel-edit"),a("#confirm-edit"),E("button[data-event='edit']"),E("button[data-event='delete']"),o("#form-description").value="",o("#form-expenditure").value=""},$=()=>{if(!u.isEditing)return;const t=o("#form-description").value,e=o("#form-expenditure").value;if(!t||!e)return;const n={description:t,expenditure:+e};d.updateExpenseById(u.expenseToBeEditedId,n),h(),p()},v=o("#form-money"),w=o("#create-expense"),P=o("#cancel-edit"),j=o("#confirm-edit"),q=o("#expenses-board");window.onload=()=>{v.focus(),p()};v.onchange=O;w.onclick=S;P.onclick=h;j.onclick=$;q.onclick=H;