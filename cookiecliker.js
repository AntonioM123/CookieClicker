class Utils{
    static setDummyHighscores(){
        if(!localStorage.getItem("highscores")){
            let dummyHighscores = [{highscore: 50,username:"Mate"},
                                   {highscore: 30,username:"Ivo"}];
            localStorage.setItem("highscores",JSON.stringify(dummyHighscores));
        }
    }
    static formatTwoDigits(number){
        return number < 10 ? "0"+number :number;
    } 
    static formatTime(time){
        const minutes = Utils.formatTwoDigits(parseInt(time / 60,10));
        const seconds = Utils.formatTwoDigits(parseInt(time % 60,10));
        return minutes+ ":" + seconds;
    } 
}
class CookieGame{
    cookieCount = 0;
    gameIntervalTimer = null;
    updateTimerUI = null;
    resetGameUI = null;
    updateHighScoreListUI = null;
    constructor(updateTimerUI,resetGameUI,updateHighScoreListUI){
        this.updateTimerUI = updateTimerUI;
        this.resetGameUI = resetGameUI;
        this.updateHighScoreListUI = updateHighScoreListUI;

    }

    startGame(duration){
        let countdown = duration;
        this.updateTimerUI(Utils.formatTime(duration))
        this.gameIntervalTimer = setInterval(()=>{
            countdown--;
            if(countdown < 0){
                const username = prompt('Tvoj rezultat je '+this.cookieCount+' molin te unesi svoje ime');
                
                HighScoreManager.updateHighScores(username,this.cookieCount);
                this.updateHighScoreListUI();
                this.resetGame(duration);
            }else{
                this.updateTimerUI(Utils.formatTime(countdown));
            }      
        },1000)

    }
    resetGame(duration){
        if(!gameStarted){
            return;
        }
        let timer = duration;
        this.updateTimerUI(Utils.formatTime(duration))
        clearInterval(this.gameIntervalTimer)
        this.cookieCount = 0;
        this.resetGameUI();
    }
}
class HighScoreManager{
    static getHighScores(){
       const highscores = localStorage.getItem("highscores");
       if(!highscores){
           throw new Error("Highscores not set!");
       }
       return JSON.parse(highscores);
    }
    static updateHighScores(username,score){
          const highscores = HighScoreManager.getHighScores();
          let foundEntryNew = highscores.findIndex(oneEntry => {
              oneEntry.username === username;
          });
          if(foundEntryNew != -1){
              let foundEntryExisting = highscores.findIndex(oneEntry => {
                oneEntry.username == username &&
                  oneEntry.highscore < score});
              if (foundEntryExisting != -1){
                  highscores.splice(foundEntryExisting,1);
                  highscores.push({highscore: score,username: username});
              }     
          }
          else{
              highscores.push({highscore: score,username: username});
          } 
          highscores.sort((a,b)=>{
              return b.highscore-a.highscore;
          });
          localStorage.setItem("highscores",JSON.stringify(highscores));
    }
}

function resetGameUI(){
    gameStarted = false;
    cookieCounterDisplay.textContent = 0;
    btnStart.textContent = "START";
}
function updateHighScoreListUI(){
    let highscoreList = document.querySelector(".highscore--list");
    if(!highscoreList){
        throw new Error("Nemrem naci HighScore listu");
    }
    while(highscoreList.firstChild){
        highscoreList.firstChild.remove();
    }
    const highscores = HighScoreManager.getHighScores();
    highscores.forEach(element =>{
        let listiTem = document.createElement("li");
        listiTem.textContent = element.username+':'+element.highscore;
        highscoreList.appendChild(listiTem);
    });
}
let cookie = document.getElementById("img--cookie");
let cookieCounterDisplay = document.querySelector("#click-count");
let btnStart = document.querySelector(".btn--start");
let timer = document.getElementById("timer");

let gameStarted = false;

if(!cookie || !cookieCounterDisplay || !btnStart || !timer){
    alert("Nije se dobro ucitalo bato")
}else{
    Utils.setDummyHighscores();
    const cookieGame = new CookieGame(
      (timeString) => timer.textContent = timeString,
      resetGameUI,updateHighScoreListUI);
    cookie.addEventListener("click",() => {
        if(gameStarted){
            cookieCounterDisplay.textContent = ++cookieGame.cookieCount;
        }
    })
    btnStart.addEventListener("click",()=>{
        let gameTime = 10;
        if(!gameStarted){
            cookieGame.startGame(gameTime);
            btnStart.textContent = "RESET";
            gameStarted = true;
            cookieCounterDisplay.textContent = 0;
        }
        else{
            cookieGame.resetGame(gameTime);    
        }
    })
}