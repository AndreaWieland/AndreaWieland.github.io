window.onload = ()=>{
    let timer = new Timer();
    let timerSelector = new timerEntryFields();
    let start = document.getElementById("go");
    start.addEventListener("click",()=>{timer.start();});
    let add = document.getElementById("addInterval");
    add.addEventListener("click",()=>{timerSelector.addModule();});
    let pause = document.getElementById("pause");
    pause.addEventListener("click", ()=>{timer.pauseTimer();});
    let resume = document.getElementById("resume");
    resume.addEventListener("click", ()=>{timer.resumeTimer();});
    let stop = document.getElementById("stop");
    stop.addEventListener("click", ()=>{timer.endTimer();});
    let reset = document.getElementById("reset-timer");
    reset.addEventListener("click", ()=>{timerSelector.resetPage();});
};

class timerEntryFields{
    constructor(){
        this.intervalIDs = ["Y2agQ","6Vf4Z","Qtyyd","mLX9r","imnzo","mvCH5","FgZUA","PCbup","EfkQp","b6vNt","y6Dt2","95trm","7W26i","Lyb2h","Ev9Vi","Ruptk","9rAAc","SWqMb","8UAwv","dSNxV","H3tx8","h5spY","Bys5h","6fyZH","Fbkwz","X3cvy","AQEPW","NftWU","2ujtV","8wxxH","mG5Aq","bJcKZ","KMUWy","686Q4","vRxCX","ckEZm","yN6eb","CaPmB","NxdFE","3JsrG","Rw9g2","QieYr","fGcc3","Cug38","x5Mbj","W6CBf","u9DSf","NkwQw","xfqN9","rY5UE"];
        this.addModule(1);//gotta move all the methods into this class!!
    }

    addModule(isInitial){
        let entryOb = this;
        if(entryOb.intervalIDs.length == 0){
            alert("too many intervals");
            return;
        }
        else{
            let timerinput = document.createElement("div");
            timerinput.className = "interval";
            timerinput.appendChild(entryOb.createIntervalComponent());
            timerinput.appendChild(entryOb.createTimeComponent());
            timerinput.appendChild(entryOb.createBreakToggle());
            timerinput.appendChild(entryOb.createBreakComponent());
            if(!isInitial){
                timerinput.appendChild(entryOb.createRemoveButton());
                timerinput.draggable = "true";
                timerinput.ondragstart =()=>{entryOb.dragStarted(event)};
                timerinput.ondragover = ()=>{entryOb.draggingOver(event)};
                timerinput.ondrop = ()=>{entryOb.dropped(event)};
            }
            timerinput.id = this.intervalIDs.pop();
            document.getElementById("valueInputs").appendChild(timerinput);
        }  
    }

    createIntervalComponent() {
        let intsholder = document.createElement("div");
        let intslab = document.createElement("label");
        intslab.htmlFor = "ints";
        intslab.appendChild(document.createTextNode("Intervals"));
        let ints = document.createElement("input");
        ints.value = "1";
        ints.id = ints.name = "ints";
        ints.type = "number";
        ints.min = "1";
        ints.addEventListener("focusout",()=>{
            if(ints.value == ""){
                ints.value = 1}
            });
        intsholder.appendChild(intslab);
        intsholder.appendChild(ints);
        return intsholder;
    }

    createTimeComponent() {
        let timeholder = document.createElement("div");
        let minslab = document.createElement("label");
        minslab.htmlFor = "mins";
        minslab.appendChild(document.createTextNode("Time"));
        let mins = document.createElement("input");
        mins.addEventListener("focusout",()=>{
            if(mins.value == ""){
                mins.value = 0}
            });
        mins.type = "number";
        mins.value = "15";
        mins.min = "0";
        mins.max = "60";
        mins.id = mins.name = "mins";
        let sec = document.createElement("input");
        sec.addEventListener("focusout",()=>{
            if(sec.value == ""){
                sec.value = 0}
            });
        sec.type = "number";
        sec.value = "00";
        sec.min = "0";
        sec.max = "59";
        sec.id = sec.name = "sec";
        timeholder.appendChild(minslab);
        timeholder.appendChild(mins);
        timeholder.appendChild(sec);
        return timeholder;
    }

    createBreakComponent(){
        let breakTime = this.createTimeComponent();
        breakTime.children[1].value = "5";
        breakTime.className = "exclude";
        return breakTime;
    }

    createBreakToggle(){
        let breakToggleButton = document.createElement("button");
        breakToggleButton.onclick = ()=>{
            if(breakToggleButton.parentNode.children[3].className == "exclude"){
                breakToggleButton.parentNode.children[3].className = "include";
            }
            else{
                breakToggleButton.parentNode.children[3].className = "exclude";        }
        }
        breakToggleButton.appendChild(document.createTextNode("Break"));
        return breakToggleButton;
    }

    createRemoveButton(){
        let remove = document.createElement("button");
        remove.onclick = ()=>{
            this.intervalIDs.push(remove.parentNode.id)
            remove.parentNode.parentNode.removeChild(remove.parentNode)
        };
        remove.appendChild(document.createTextNode("-"));
        return remove;
    }

    resetPage(){
        let intervals = document.getElementsByClassName('interval');
        intervals[0].children[0].children[1].value = "1";   //resetting 1st input to 1 round, 15 min
        intervals[0].children[1].children[1].value = "15";
        intervals[0].children[1].children[2].value = "00";
        for (let i = intervals.length-1; i > 0; i--) {      //deleting all the rest
            intervals[i].parentNode.removeChild(intervals[i]);
        }
    }

    dragStarted(evt){
        evt.dataTransfer.setData("text/plain", evt.target.id);
        evt.dataTransfer.effectAllowed = "move";
    }
    
    draggingOver(evt){
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "move";
    }
    
    dropped(evt){
        evt.preventDefault();
        evt.stopPropagation();
        var data = evt.dataTransfer.getData("text");
        let target = evt.target;
        target.parentNode.after(document.getElementById(data));
    }


}


function ringAlarm(){
    var alarm = document.getElementById("alarm");
    alarm.play();
}

class Timer {
    constructor(){
        this.rounds = [];
        this.state = "run";
        this.currentTime;
    }

    start(){
        this.loadRounds();
        if(this.rounds.length == 0){
            alert("You haven't entered any intervals");
        }
        else if(this.rounds.includes(0)){
            alert("Please enter a time in each interval");
        }
        else{
            this.startTimer();
        }
    }

    startTimer(){
        let showTimer = document.getElementById("timer-container");
        showTimer.className = "visible";
        let hideInput = document.getElementById("inputContainer");
        hideInput.className = "invisible";
        this.state = "run";
        this.countInterval();
    }

    pauseTimer(){
        this.state = "pause";
        this.rounds.unshift(this.currentTime);
        let psButton = document.getElementById("pause");
        psButton.className = "pause invisible";
        let resButton = document.getElementById("resume");
        resButton.className = "resume visible";
    }

    resumeTimer(){
        //put 1 second delay
        this.state = "run";
        this.countInterval();
        let psButton = document.getElementById("pause");
        psButton.className = "pause visible";
        let resButton = document.getElementById("resume");
        resButton.className = "resume invisible";
    }

    endTimer(){
        this.state = "pause";
        this.rounds = [];
        this.currentTime = 0;
        let timerDisplay = document.getElementById("countdown-timer");
        timerDisplay.innerText = "";
        let hideTimer = document.getElementById("timer-container");
        hideTimer.className = "invisible";
        let showInput = document.getElementById("inputContainer");
        showInput.className = "visible";
    }

    loadRounds(){
        let count;
        var minsec;
        var sec;
        var inputs = document.getElementsByClassName('interval');
        for (var i = 0; i < inputs.length; i++){
            count = parseInt(inputs[i].children[0].children[1].value);
            for (var j = 0; j < count; j++){
                minsec = parseInt(inputs[i].children[1].children[1].value) *60;
                sec = parseInt(inputs[i].children[1].children[2].value);
                this.rounds.push(minsec + sec);
                if(inputs[i].children[3].className == "include"){
                    minsec = parseInt(inputs[i].children[3].children[1].value) *60;
                    sec = parseInt(inputs[i].children[3].children[2].value);
                    this.rounds.push(minsec + sec);
                }
            }
        }
    }

    countInterval(){
        if(this.rounds.length <= 0){
            return;
        }
        this.currentTime = this.rounds.shift();
        this.countdownOne(()=>{
            this.countInterval(this.rounds);
        });
    }
    
    countdownOne (callback) {
        let tmr = this;
        this.setDisplay();
        this.currentTime--;
        var round = setInterval(()=>{
            if(tmr.state == "pause"){
                clearInterval(round);
                return;
            }
            else if(tmr.currentTime < 0){
                ringAlarm();
                clearInterval(round);
                callback();
            }
            else{
                tmr.setDisplay();
                tmr.currentTime--;
            }
       },1000);
    }
    
    setDisplay(){
        let minDisplay = (Math.floor(this.currentTime / 60)).toString();
        let secDisplay = (this.currentTime % 60).toString();
        if (minDisplay < 10) {
            minDisplay = "0" + minDisplay;
        }
        if (secDisplay < 10) {
            secDisplay = "0" + secDisplay;
        }
        let timeString = minDisplay + ":" + secDisplay;
        document.getElementById("countdown-timer").textContent = timeString;    
        document.title = timeString;
    }
}

