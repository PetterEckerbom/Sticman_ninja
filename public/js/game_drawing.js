var enemy_animation;
var you_animation;

function startanimation(){
  enemy_animation = setInterval(flipframes_enemy, 1000/10);
  enemy_animation = setInterval(flipframes_you, 1000/10);
}
function flipframes_enemy(){
  players[1].frame++;
}
function flipframes_you(){
  players[0].frame++;
}
function draw_players(){
      for(var i = 0; i < 2; i++){
      var color ="RED_";
      if(i == 0){
        color = "BLUE_"
      }
     var sprite = document.getElementById(color+players[i].animation.sprite+"_"+players[i].facing);
     var xcrop = (players[i].frame%players[i].animation.frames)*players[i].animation.width;
     var player_width = players[i].animation.width;
     var player_height = players[i].animation.height;
     ctx.drawImage(sprite,xcrop,0,player_width,player_height,players[i].x-((player_width/3)/2),players[i].y-(player_height/3),player_width/3,player_height/3);
   }
}
