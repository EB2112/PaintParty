
//const socket = io('http://localhost:5000');

const canvas = document.querySelector("#canvas");
const colors = document.querySelectorAll(".color"); 
const sliders = document.querySelectorAll(".slider")
const numInputs = document.querySelectorAll(".number")
const context = canvas.getContext("2d");
const colorPreview = document.getElementById('colorpreview')
context.fillStyle = "white";

let isDrawing = false;
let currentMode = "freeDraw";
let currentColor = 'red';
let coords = {x: 0, y:0};
let startPos = {x:0, y:0};
let endPos = {x:0, y:0};
let data = {start: null, end: null, color: currentColor, size: null }
colors.forEach((color)=>{
    color.addEventListener("click", ()=>{
        console.log(getComputedStyle(color).getPropertyValue("background-color"))
            if(getComputedStyle(color).getPropertyValue("background-color") == "rgba(0, 0, 0, 0))"){
                currentColor ="rgba(0, 0, 0, 1)";
            }
            else  currentColor = getComputedStyle(color).getPropertyValue("background-color");
       
        
    })
})

sliders.forEach((slider) =>{
    slider.addEventListener('input', ()=>{
        document.getElementById(`${slider.id}value`).value = slider.value
        colorPreview.style.backgroundColor = grabColor()
    })
    
})

canvas.addEventListener("mousedown",startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", freeDraw);





function grabColor(){
const redValue =  document.getElementById("redvalue").value;
const greenValue =  document.getElementById("greenvalue").value;
const blueValue =  document.getElementById("bluevalue").value;
const alphaValue =  document.getElementById("alphavalue").value;

return(`rgba(${redValue},${greenValue},${blueValue},${alphaValue})`)

}

//gets position of mouse within canvas
function getPosition(event){
    const bounding = canvas.getBoundingClientRect();
    coords.x = event.clientX - bounding.left;
    coords.y = event.clientY - bounding.top;
}


function startDrawing(event){
    isDrawing = true;
    getPosition(event)
    if (currentMode == "line" || currentMode == "rect") start(event);
    
}

function stopDrawing(event){
    isDrawing = false;
    if (currentMode == "line") straightLineEnd(event);
    if (currentMode == "rect") rectangleEnd(event);
    
    
    
}


    

//WOP need to refactor. Takes position of initial click and draws line to new position. Also creates data object to emit to other clients
// when called with mousehover event, it constantly draws, acting like a free drawing mode 
function freeDraw(event){
    if(!isDrawing) return;
    if(currentMode != "freeDraw") return;
    context.beginPath();
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = grabColor();
    let oldPos = {x: coords.x, y: coords.y}
    getPosition(event);
    context.moveTo(oldPos.x, oldPos.y);
    context.lineTo(coords.x, coords.y)
    context.stroke();
    data = {start: oldPos, end: coords, color: currentColor, size: 5}
    // socket.emit("draw", data)
    // socket.emit("test")
}
//function to draw with data given from other clients
function drawLine(start, end, color, size) {
  context.beginPath();
  context.lineWidth = size;
  context.lineCap = 'round';
  context.strokeStyle = color;
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();
}

//gets starting position of line
function start(event){
    if(!isDrawing) return;
    getPosition(event);
    startPos = {x: coords.x, y: coords.y};
    
}

//gets ending position of line and connects with the starting position
function straightLineEnd(event){
    
    getPosition(event);
    endPos = {x: coords.x, y: coords.y};
    context.beginPath();
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = currentColor;
    context.moveTo(startPos.x, startPos.y);
    context.lineTo(endPos.x, endPos.y)
    context.stroke();
}


function rectangleEnd(event){
    getPosition(event);
    endPos = {x: coords.x, y: coords.y};
    context.beginPath();
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = currentColor;
    context.moveTo(startPos.x, startPos.y);
    context.lineTo(endPos.x, startPos.y);
    context.lineTo(endPos.x, endPos.y);
    context.lineTo(startPos.x, endPos.y);
    context.closePath()
    context.stroke();
}

socket.on("draw", (data) =>{
    drawLine(data.start, data.end, data.color, data.size);

})