//Initiate global varibles to store the animation flipping . so we can pause it.
var enemy_animation;
var you_animation;

//start those animations at 10fps
function startanimation(){
  enemy_animation = setInterval(flipframes_enemy, 1000/10);
  you_animation = setInterval(flipframes_you, 1000/10);
}
function flipframes_enemy(){
  //flip frames for enemt
  players[1].frame++;
  //if we have  alocked anymation we check if we excceeded maxframes and in thatcase we unlock.
  if(players[1].animationlock && players[1].frame >= players[1].animation.maxframe){
    players[1].animationlock = false;
  }
}
//same as above!
function flipframes_you(){
  players[0].frame++;
  if(players[0].animationlock && players[0].frame >= players[0].animation.maxframe){
    players[0].animationlock = false;
  }
}
function draw_map(){
  //Temp way of drawing map elements
  ctx.fillStyle="#ff0026";
  for(var i=0;i<platform.length;i++){
    var img = document.getElementById(platform[i].sprite);
    ctx.drawImage(img,platform[i].xstart+xoffset,platform[i].y+yoffset-platform[i].oveset-5);
  }
  ctx.fillStyle="#00f735";
  for(var y=0;y<walls.length;y++){
    if(walls[y].texture){
      var imgwall = document.getElementById(walls[y].texture);
      ctx.drawImage(imgwall, walls[y].x+xoffset, walls[y].ystart+yoffset);
    }
  }
}
function draw_players(){
  //sets fillstyle to blue to draw client name.
  ctx.fillStyle="#0000ff";
  ctx.font="20px Arial";
      for(var i = 0; i < 2; i++){
        //checks if it the red or blue sprite that should be drawn
      var color ="RED_";
      if(i == 0){
        color = "BLUE_";
      }
      //grab the sprite from HTML with direction, color and animation that is approprate.
     var sprite = document.getElementById(color+players[i].animation.sprite+"_"+players[i].facing);
     //This effectyvly is the varible for what part of the spritesheet should be drawn.
     var xcrop = (players[i].frame%players[i].animation.frames)*players[i].animation.width;
     var player_width = players[i].animation.width;
     var player_height = players[i].animation.height;
     //draws the playername right above where the hitbox ends in y axis and centered on the x
     ctx.textAlign="center";
     ctx.fillText(players[i].name,players[i].x+xoffset,players[i].y-players[i].animation.hitbox_H+yoffset-5);
     //drawn the player, uses all previos varibles but devides the hight and width by 3 as all sprites are made 3 time bigger then they should.
     ctx.drawImage(sprite,xcrop,0,player_width,player_height,players[i].x-((player_width/3)/2)+xoffset,players[i].y-(player_height/3)+yoffset,player_width/3,player_height/3);
     //sets fillstyle to red for nexttime it should write the enemy name.
      ctx.fillStyle="#ff0000";
   }
}
function draw_powerbar(){
  var img_bar = document.getElementById('powerbar');
  ctx.drawImage(img_bar,0,0,500-power,100,390+xoffset,700+yoffset,500-power,100);
}

function draw_boxes(){
  for(var i = 0; i < boxes.length; i++){
    var boxtype = "";
    if(boxes[i].type == "yours"){
      boxtype = document.getElementById('box_blue');
    }else if(boxes[i].type == "enemys"){
      boxtype = document.getElementById('box_red');
    }else{
      boxtype = document.getElementById('box_both');
    }
    ctx.drawImage(boxtype, boxes[i].cords.x+xoffset-25,boxes[i].cords.y+yoffset-50);
  }
}

function draw_shurikens(){
  for(var i = 0; i < shurikens.length; i++){
    var img = document.getElementById('shuriken');
    ctx.drawImage(img,shurikens[i].x+xoffset-12,shurikens[i].y+yoffset-12,24,24);
  }
}
function draw_bombs(){
  for(var i = 0; i < bombs.length; i++){
    var img = document.getElementById('bomb');
    ctx.drawImage(img,bombs[i].x+xoffset-21,bombs[i].y+yoffset-28);
  }
}
function draw_bananas(){
  for(var i = 0; i < bananas.length; i++){
    var img = document.getElementById('banana');
    ctx.drawImage(img,bananas[i].x+xoffset-15,bananas[i].y+yoffset-27);
  }
}

function draw_iceballs(){
  for(var i = 0; i < iceballs.length; i++){
    var img = document.getElementById('iceball');
    ctx.drawImage(img,iceballs[i].x+xoffset-16,iceballs[i].y+yoffset-16,32,32);
  }
}

function display_item(){
  if(charges > 0){
    var img = document.getElementById(item_name);
    ctx.fillStyle="#f4426b";
    ctx.font="50px Arial";
    ctx.drawImage(img,xoffset+700,0);
    ctx.fillText(charges+"",xoffset+840,50);
  }
}

//these functions take in an animation, sets the framerate to the correct speed and resets all frames in order to apply the correct animation.
function animation_change_you(animation){
  if(players[0].animation != animation && !players[0].animation_block ){
    clearInterval(you_animation);
    players[0].animation = animation;
    players[0].frames = 1;
    you_animation = setInterval(flipframes_you, animation.fps);
  }
}
function animation_change_enemy(animation){
  if(players[1].animation != animation && !players[1].animation_block ){
    clearInterval(enemy_animation);
    players[1].frames = 1;
    players[1].animation = animation;
    enemy_animation = setInterval(flipframes_enemy, animation.fps);
  }

}

//this animation looks at speed in diffrent axis and things like that in order to determin what animation should be playing
function find_animation(player){
  //if there is an animationlock it doesnt do anything. Animation lock is used for animations that cant be cancelled such as puch
  if(!player.animationlock){
    var animation_found;
    if(player.flipping){
      animation_found = animations.flip;
    }else if(player.y_speed > 0){
      animation_found = animations.falling;
    }else if(player.y_speed < 0){
      animation_found = animations.jump;
    }else if(player.dir == 0){
      animation_found = animations.idle;
    }else if(player.dir != 0){
      animation_found = animations.running;
    }

    //it calls the animationchange functions once it found the correct animation.
    if(players[0] == player){
      animation_change_you(animation_found);
    }else{
      animation_change_enemy(animation_found);
    }
  }
}
