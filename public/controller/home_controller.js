export function onsubmitCalcForm(e){
    e.preventDefault();
    const n = e.target.number.value;
    //const n = parseInt(nStr);
    const ul = document.getElementById('dispaly');
    const eqString = `
    ${n} x ${n} = ${n * n}
    `;
    const li = document.createElement('li');
    li.textContent = eqString;
    ul.appendChild(li);
}