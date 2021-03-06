var boxes = [];
var shurikens = [];
var bombs = [];
var iceballs = [];
var bananas = [];
//establishes connection with server.
var socket = io();
//sets up drawing varibles
var c=document.getElementById("main");
var ctx=c.getContext("2d");
//global varibles for storing the offset the game has from edges on hight resolution displays.
var xoffset;
var yoffset;
window.onload = function() {
//checks if high or low resolution display
  if(window.innerWidth >= 1480 && window.innerHeight >= 820){
    //if high resolution we fill screen with canvas and calculate ofsset to make picture centred.
    document.getElementById("main").width = window.innerWidth;
    document.getElementById("main").height = window.innerHeight;
    xoffset = (window.innerWidth - 1480)/2 + 100;
    yoffset = (window.innerHeight - 820)/2;
    document.getElementById("main").style.maxWidth = "none";
    document.getElementById("main").style.maxHeight = "none";
  }else{
    //if low res we set vanvas to smalles gamesize and let css downscale if neccesarry with maxwidth and height,
    //this leaves black bars but is the best you can do pretty much.
    document.getElementById("main").width = 1480;
    document.getElementById("main").height = 820;
    xoffset = 100;
    yoffset = 50;
    document.getElementById("main").style.maxWidth = window.innerWidth + "px";
    document.getElementById("main").style.maxHeight = window.innerHeight + "px";
  }
  //starts animation
  startanimation();
};
   onresize = function(){
     //does the sameting as above when window is getting resized so it wont use old settings
     if(window.innerWidth >= 1480 && window.innerHeight >= 820){
       document.getElementById("main").width = window.innerWidth;
       document.getElementById("main").height = window.innerHeight;
       xoffset = (window.innerWidth - 1480)/2 +100;
       yoffset = (window.innerHeight - 820)/2;
       document.getElementById("main").style.maxWidth = "none";
       document.getElementById("main").style.maxHeight = "none";
     }else{
       document.getElementById("main").width = 1480;
       document.getElementById("main").height = 820;
       xoffset = 100;
       yoffset = 50;
       document.getElementById("main").style.maxWidth = window.innerWidth + "px";
       document.getElementById("main").style.maxHeight = window.innerHeight + "px";
     }
   };

//When server doen't find a match at first we tell client to wait by displaing text and a image that spinns from css
socket.on("waiting",function(){
  document.getElementById('wrap').innerHTML ="<img src='img/loading.png' id='loading'/><br><br><br><br>Looking for opponent...";
});

socket.on("waiting_friend",function(code){
  document.getElementById('wrap').innerHTML ="<img src='img/loading.png' id='loading'/><br><br><br><br>Waiting for friend to connect to game " + code + "....";
});
var UI_left_plr = null;
var UI_right_plr = null;
//When server says game should start we remve matchmaking div
socket.on("Game_start",function(name){
  //save names of players in their respective object
  players[0].name = name.you;
  players[1].name = name.enemy;
  setTimeout(function(){
    if(players[0].x > 700){
      UI_left_plr = 1;
      UI_right_plr = 0;
    }else{
      UI_left_plr = 0;
      UI_right_plr = 1;
    }
  },10);
  document.getElementById('headerr').style.display = "none";
  document.getElementById('main').style.zIndex = "100";
  document.getElementById('matchmaking').innerHTML="";
  document.getElementById('matchmaking').style.width ="none";
  document.getElementById('matchmaking').style.width ="0";
  document.getElementById('matchmaking').style.height ="0";
  document.getElementById('matchmaking').style.background ="none";
});

//below are some error codes!
socket.on("code_taken", function(){
  alert('Sorry, someone already uses this code. Please pick another code');
});
socket.on("No_code",function(){
  alert('There is no game with that ID, ask your friend again if he provided correct code');
});
socket.on("bad_code",function(){
  alert('Invalid code! Your code must me 5 didgits long and cannot contain letters or special characters');
});
socket.on('not_logged_in',function(){
  location.reload();
});

//when match() is called we emit to server that we wanna play
function match(){
  if(document.getElementById("ranked").checked){
    socket.emit('match_making_ranked', document.getElementById("Elo").value);
  }else if(document.getElementById("casual").checked){
    socket.emit('match_making_casual');
  }else if(document.getElementById("friend").checked){
    socket.emit('match_making_friend',{code:document.getElementById("code").value,new_match:document.getElementById("New_game").checked});
  }
}

//These two are for hiding or showing elo selector based on what gamemode player choose
function casualSel(){
  document.getElementById("chooseElo").innerHTML ="";
}
function rankedSel(){
  document.getElementById("chooseElo").innerHTML ='<select id="Elo" name="elo">  <option value="0">Any (fast queue time)</option><option value="1">Better elo than me</option><option value="-1">Worse elo than me</option> </select>';
}
function friendsel(){
  document.getElementById("chooseElo").innerHTML ='<label for="input" class="friend_selector">New Game:</label><input id="New_game" type="radio" name="newornah" checked/><br/><label for="input" class="friend_selector">Join Game:</label><input id="join_game" type="radio" name="newornah"/><input id="code" type="number" placeholder="Enter 5 didgit code"/>';
}
//When socket says opponent disconnected we simply tell the user what happended. This will be updated
socket.on("Opponent_DC",function(){
  alert("Your Opponent ran like a chicken! You won the game");
  location.reload();
});
