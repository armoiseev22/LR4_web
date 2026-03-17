window.onload=function(){

const mapBtn=document.getElementById("mapButton")
const mapBox=document.getElementById("mapBox")
const closeMap=document.getElementById("closeMap")

if(mapBtn){
mapBtn.onclick=function(){
mapBox.style.display="block"
}
}

if(closeMap){
closeMap.onclick=function(){
mapBox.style.display="none"
}
}

const chatBtn=document.getElementById("chatButton")
const chatBox=document.getElementById("chatBox")
const closeChat=document.getElementById("closeChat")

if(chatBtn){
chatBtn.onclick=function(){
chatBox.style.display="flex"
}
}

if(closeChat){
closeChat.onclick=function(){
chatBox.style.display="none"
}
}

if(document.getElementById("map")){

const map=new ol.Map({
target:'map',
layers:[
new ol.layer.Tile({
source:new ol.source.OSM()
})
],
view:new ol.View({
center:ol.proj.fromLonLat([37.528976,55.778319]),
zoom:10
})
})

function addMarker(coords){

const marker=new ol.Feature({
geometry:new ol.geom.Point(ol.proj.fromLonLat(coords))
})

const layer=new ol.layer.Vector({
source:new ol.source.Vector({
features:[marker]
})
})

map.addLayer(layer)

}

addMarker([37.648106,55.753164])
addMarker([37.409846,55.803474])

}

const input=document.getElementById("chatInput")
const sendBtn=document.getElementById("sendBtn")
const messages=document.getElementById("chatMessages")

if(sendBtn){

function addMessage(text,type){

const div=document.createElement("div")
div.className=type
div.textContent=text

messages.appendChild(div)

messages.scrollTop=messages.scrollHeight
}

function reply(text){

text=text.toLowerCase()

if(text.includes("привет")||text.includes("здравствуйте")||text.includes("hello")||text.includes("доброе")){
return "Здравствуйте! Это автоответчик. Напиши ваш вопрос и возможно я знаю на него ответ"
}

if(text.includes("спасибо")){
return "Рад что смог помочь, если будут еще вопросы обращайтесь"
}

if(text.includes("дисциплины")||text.includes("предметы")){
return "1 курс: Математический анализ, Линейная алгебра, Программирование, Дискретная математика, Физика. 2 курс: Теоретическая механика, Дифференциальные уравнения, Теория вероятностей, Алгоритмы, Статистика. 3 курс: Функциональный анализ, Машинное обучение, Базы данных, Оптимизация, Численные методы. 4 курс: Численные методы, Асимптотические методы, Научные проекты, Анализ данных, Моделирование."
}

return "Я пока не знаю ответа на этот вопрос."
}

sendBtn.onclick=function(){

const text=input.value.trim()

if(text==="") return

addMessage(text,"user")

setTimeout(function(){
addMessage(reply(text),"bot")
},500)

input.value=""
}

}

const voiceBtn=document.getElementById("voiceBtn")

if(voiceBtn){

let recorder
let chunks=[]
let recording=false

voiceBtn.onclick=async function(){

if(!recording){

const stream=await navigator.mediaDevices.getUserMedia({audio:true})

recorder=new MediaRecorder(stream)

recorder.start()

recording=true
voiceBtn.textContent="⏹"

recorder.ondataavailable=e=>chunks.push(e.data)

recorder.onstop=function(){

const blob=new Blob(chunks,{type:'audio/webm'})

chunks=[]

const audio=document.createElement("audio")
audio.controls=true
audio.src=URL.createObjectURL(blob)

messages.appendChild(audio)

voiceBtn.textContent="🎤"
recording=false

}

}else{

recorder.stop()

}

}

}

}
