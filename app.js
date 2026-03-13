let idCounter = 0

function switchTab(tab,btn){

document.querySelectorAll(".tabBtn").forEach(b=>b.classList.remove("active"))
btn.classList.add("active")

document.getElementById("calc").style.display="none"
document.getElementById("tables").style.display="none"

document.getElementById(tab).style.display="block"

}

function addItem(tipo){

const item = itens[tipo]
const id = "item"+idCounter++

let html = `<div class="card" id="${id}" data="${tipo}">

<div class="cardHeader">
<img src="${item.icon}">
<b>${item.nome}</b>
<button class="remove" onclick="removeItem('${id}')">X</button>
</div>
`

for(let stat in item.max){

html+=`
<div>${stat.toUpperCase()}</div>

<input type="number"
data-stat="${stat}"
placeholder="${item.min[stat]}"
oninput="recalc()">

<div class="segmentBar" id="${id}_${stat}_bar"></div>
`

}

html+=`<div id="${id}_result"></div></div>`

itemsArea.insertAdjacentHTML("beforeend",html)

recalc()

}

function addFullSet(){
Object.keys(itens).forEach(addItem)
}

function removeItem(id){
document.getElementById(id).remove()
recalc()
}

function clearBuild(){
itemsArea.innerHTML=""
recalc()
}

function statsCombinam(tipo,stats){

const lista = combosValidos[tipo]

if(!lista) return null

let valores = Object.values(stats).join("/")

return lista.includes(valores)

}

function desenharBarra(barId,totalCristais,usados){

let bar = document.getElementById(barId)

if(!bar) return

let html=""

for(let i=0;i<totalCristais;i++){

if(i < usados)
html+=`<div class="crystal active"></div>`
else
html+=`<div class="crystal"></div>`

}

bar.innerHTML = html

}

function recalc(){

let total=0

document.querySelectorAll(".card").forEach(card=>{

let tipo = card.getAttribute("data")
let item = itens[tipo]

let cristais=0
let stats={}

for(let stat in item.max){

let input = card.querySelector(`[data-stat=${stat}]`)
let val = parseInt(input.value)

if(!val) val = item.min[stat]

stats[stat]=val

let falt = item.max[stat] - val
let need = Math.ceil(falt/item.gain[stat])

if(need>cristais) cristais=need

let totalCristais=Math.ceil((item.max[stat]-item.min[stat])/item.gain[stat])

let faltando=Math.ceil((item.max[stat]-val)/item.gain[stat])

if(faltando<0) faltando=0
if(faltando>totalCristais) faltando=totalCristais

let usados=totalCristais-faltando

desenharBarra(`${card.id}_${stat}_bar`,totalCristais,usados)

}

total+=cristais

let comb = statsCombinam(tipo,stats)

let res = card.querySelector(`#${card.id}_result`)

let txt = `Cristais necessários: ${cristais}`

if(comb===true)
txt+=`<br><span class="comboGood">✔ Stats combinados</span>`

if(comb===false)
txt+=`<br><span class="comboBad">✖ Stats não combinam</span>`

res.innerHTML = txt

})

summary.innerHTML = `Cristais totais necessários: ${total}`

}

function gerarTabelas(){

let html=""

for(let key in itens){

let item=itens[key]
let recomendado=recomendados[key]
let combos=combosValidos[key]

let minStats=Object.values(item.min).join("/")
let maxStats=Object.values(item.max).join("/")

html+=`
<div class="tableItem">

<img class="tableIcon" src="${item.icon}">

<div class="tableName">
${item.nome}
</div>

<div class="tableStats">

<span class="statMin">
Min: ${minStats}
</span>

<br>

<span class="statRec">
Rec: ${recomendado}
</span>

<br>

<span class="statMax">
Max: ${maxStats}
</span>

</div>
`

if(combos){

html+=`
<table class="comboTable">
<tbody>
`

combos.forEach(c=>{

html+=`
<tr>
<td>${c}</td>
</tr>
`

})

html+=`
</tbody>
</table>
`

}else{

html+=`
<div class="singleStat">
Stat único
</div>
`

}

html+=`</div>`

}

tablesArea.innerHTML=html

}

gerarTabelas()