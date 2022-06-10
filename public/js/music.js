var btn1 = document.getelementbyid("btn-play"); 
  btn1.onclick = function(){ 
     if(audio.paused){          
      audio.play(); 
    } 
  } 
 

var btn2 = document.getelementbyid("btn-stop"); 
  btn2.onclick = function(){ 
     if(audio.played){          
      audio.pause(); 
    } 
  } 
   
var music = new array(); 
music = ["李玉刚 - 刚好遇见你","张杰 - 三生三世","朴树 - 平凡之路"];//歌单 
var num = 0; 
var name = document.getelementbyid("name"); 
 
 
var btn3 = document.getelementbyid("btn-pre"); 
btn3.onclick = function(){ 
    num = (num +2)%3; 
    audio.src = "music/"+music[num]+".mp3"; 
    name.innerhtml = music[num]; 
    audio.play(); 
  } 

var btn4 = document.getelementbyid("btn-next"); 
btn4.onclick = function(){ 
    num = (num +1)%3; 
    audio.src = "music/"+music[num]+".mp3"; 
    name.innerhtml = music[num]; 
    audio.play(); 
  }