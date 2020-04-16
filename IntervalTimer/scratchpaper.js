window.onload = ()=>{
    let div1 = document.getElementById("abc");
    div1.draggable = "true";
    div1.ondragstart =()=>{dragStarted(event)};
    div1.ondragover = ()=>{draggingOver(event)};
    div1.ondrop = ()=>{dropped(event)};
    let div2 = document.getElementById("xyz");
    div2.draggable = "true";
    div2.ondragstart =()=>{dragStarted(event)};
    div2.ondragover = ()=>{draggingOver(event)};
    div2.ondrop = ()=>{dropped(event)};
    let div3 = document.getElementById("doremi");
    div3.draggable = "true";
    div3.ondragstart =()=>{dragStarted(event)};
    div3.ondragover = ()=>{draggingOver(event)};
    div3.ondrop = ()=>{dropped(event)};
}

function dragStarted(evt){
    console.log(evt.target.innerHTML);
    //source=evt.target;
    evt.dataTransfer.setData("text/plain", evt.target.id);
    evt.dataTransfer.effectAllowed = "move";
}

function draggingOver(evt){
    //drag over
    evt.preventDefault();
    //specify operation
    evt.dataTransfer.dropEffect = "move";
    }

function dropped(evt){
    //drop
    evt.preventDefault();
    evt.stopPropagation();
    //update text in dragged item
    var data = evt.dataTransfer.getData("text");    //update text in drop target
    let target = evt.target;
    target.parentNode.after(document.getElementById(data));
    }