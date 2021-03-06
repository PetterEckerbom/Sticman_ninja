//When serve tells us that a player change direction we set the dir to whatever server says and if it is 1 or -1 we change what he is facing
socket.on('Change_direction_you', function(dir){
  players[0].dir = dir;
  if(dir == 1){
    players[0].facing = "right";
  }
  if(dir == -1){
    players[0].facing = "left";
  }
  //we also call find_animation in case it has changed (almost always change when dir change)
  find_animation(players[0]);
});
//same as above
socket.on('Change_direction_enemy', function(dir){
  players[1].dir = dir;
  if(dir == 1){
    players[1].facing = "right";
  }
  if(dir == -1){
    players[1].facing = "left";
  }
  find_animation(players[1]);
});

socket.on("punch",function(data){
  //if he is standing on ground he gets stopped by punching.
  if(players[data.player].y_speed == 0){
    players[data.player].x_speed = 0;
  }
  //he gets speed in the direction he is facing, depending on hit he get littel to a lot of speed
  if(players[data.player].facing =="left"){
    players[data.player].x_speed = (2 * data.type + 2) * -1;
  }else{
    players[data.player].x_speed = 2 * data.type + 2;
  }
  //his dir get set to 0, animation set to appriprate punch and frame reset.
  players[data.player].dir = 0;
  players[data.player].animationlock = true;
  players[data.player].frame = 0;
  if(data.player == 0){
    animation_change_you(animations['punch'+data.type]);
  }else if(data.player == 1){
    animation_change_enemy(animations['punch'+data.type]);
  }
  //when he regains control we call move_change again in order for player to not have to re_trogger it!
  setTimeout(move_change, 6000/7);
});

socket.on('puch_up', function(player){
  players[player].dir = 0;
  players[player].animationlock = true;
  players[player].frame = 0;
  if(player == 0){
    animation_change_you(animations.punch_up);
  }else if(player == 1){
    animation_change_enemy(animations.punch_up);
  }
});
socket.on('swipe_kick', function(player){
  players[player].dir = 0;
  players[player].animationlock = true;
  players[player].frame = 0;
  if(player == 0){
    animation_change_you(animations.swipe);
  }else if(player == 1){
    animation_change_enemy(animations.swipe);
  }
});
socket.on('kickdown',function(player){
  players[player].dir = 0;
  players[player].animationlock = true;
  players[player].frame = 0;
  if(player == 0){
    animation_change_you(animations.kickdown);
  }else if(player == 1){
    animation_change_enemy(animations.kickdown);
  }
});
socket.on('hit3', function(data){
  players[data.player].dir = 0;
  players[data.player].animationlock = true;
  players[data.player].frame = 0;
  if(data.dir == -1){
    players[data.player].facing = "right";
  }else{
    players[data.player].facing = "left";
  }
  if(data.player == 0){
    animation_change_you(animations.hardknockback);
  }else if(data.player == 1){
    animation_change_enemy(animations.hardknockback);
  }
});
socket.on('hit1', function(data){
  players[data.player].dir = 0;
  players[data.player].animationlock = true;
  players[data.player].frame = 0;
  type = "punched";
  if(players[0].facing == players[1].facing){
    type = "punched2";
  }
  if(data.player == 0){
    animation_change_you(animations[type]);
  }else if(data.player == 1){
    animation_change_enemy(animations[type]);
  }
});
socket.on('hit2', function(data){
  players[data.player].dir = 0;
  players[data.player].animationlock = true;
  players[data.player].frame = 0;
  type = "punched";
  if(players[0].facing == players[1].facing){
    type = "punched2";
  }
  if(data.player == 0){
    animation_change_you(animations[type]);
  }else if(data.player == 1){
    animation_change_enemy(animations[type]);
  }
});
socket.on('airkick', function(player){
  players[player].animationlock = true;
  players[player].frame = 0;
  if(player == 0){
    animation_change_you(animations.airkick);
  }else if(player == 1){
    animation_change_enemy(animations.airkick);
  }
});
function test(player){
  players[player].dir = 0;
  players[player].animationlock = true;
  players[player].frame = 0;
  if(player == 0){
    animation_change_you(animations.airkick);
  }else if(player == 1){
    animation_change_enemy(animations.airkick);
  }
}

socket.on('new_box',function(data){
  console.log(data);
  boxes.push(data);
});
var charges = 0;
var item_name = "";
socket.on('new_item', function(item){
  if(item.name == "shuriken" || item.name == "bomb" ){
    item_type = "throw";
  }else{
    item_type = "use";
  }
  charges = item.charges;
  item_name = item.name;
  console.log(item.name + " " + item.charges);
});
socket.on('remove_box',function(box){
  console.log(box);
  for(var i = 0; i < boxes.length; i++){
    if(boxes[i].cords.x == box.x && boxes[i].cords.y == box.y){
      boxes.splice(i, 1);
      return;
    }
  }
});
socket.on('new_shuriken',function(data){
  var shuriken = data.info;
  shuriken.owner = data.type;
  shurikens.push(shuriken);
});
socket.on('delete_shuriken',function(id){
  for(var i = 0; i < shurikens.length; i++){
    if(shurikens[i].id == id){
      shurikens.splice(i, 1);
      return;
    }
  }
});
socket.on('delete_banana',function(id){
  console.log(id);
  for(var i = 0; i < bananas.length; i++){
    if(bananas[i].id == id){
      bananas.splice(i, 1);
      return;
    }
  }
});

socket.on('new_iceball',function(data){
  var iceball = data.info;
  iceball.owner = data.type;
  iceballs.push(iceball);
});
socket.on('delete_iceball',function(id){
  for(var i = 0; i < iceballs.length; i++){
    if(iceballs[i].id == id){
      iceballs.splice(i, 1);
      return;
    }
  }
});
socket.on("slowed", function(player){
  players[player].max_speed = 6;
  players[player].accerelation = 0.3;
  players[player].iceballhits++;
  setTimeout(noslow, 8000-ping, player);
});
function noslow(player){
  players[player].iceballhits--;
  if(players[player].iceballhits <= 0){
    players[player].max_speed = 12;
    players[player].accerelation = 0.6;
    players[player].iceballhits = 0;
  }
}

socket.on('new_bomb',function(data){
  var bomb = data.info;
  bomb.owner = data.type;
  bombs.push(bomb);
  setTimeout(delete_bomb, 1000-ping, bomb.id);
});
function delete_bomb(id){
  for(var i = 0; i < bombs.length; i++){
    if(bombs[i].id == id){
      bombs.splice(i, 1);
    }
  }
}
socket.on('new_banana',function(data){
  var banana = data.info;
  banana.owner = data.type;
  bananas.push(banana);
});
//this is to apply a the flipping animation when the other jump comes through.
socket.on('flipping', function(player){
  players[player].flipping = true;
});
socket.on('death_count', function(player){
  players[player].lives--;
});

socket.on('health_update', function(health){
  players[health.player].health = health.health;
});
socket.on('fame_update', function(fame){
  players[fame.player].fame = fame.fame;
});
socket.on('healthup',function(player){
  players[player].health = 1000;
});
socket.on('fall',function(player){
  players[player].dir = 0;
  players[player].animationlock = true;
  players[player].frame = 0;
  if(player == 0){
    animation_change_you(animations.fall);
  }else if(player == 1){
    animation_change_enemy(animations.fall);
  }
  setTimeout(function(){
    players[player].animationlock = true;
    players[player].frame = 0;
    if(player == 0){
      animation_change_you(animations.down);
    }else if(player == 1){
      animation_change_enemy(animations.down);
    }
    setTimeout(function(){
      players[player].animationlock = true;
      players[player].frame = 0;
      if(player == 0){
        animation_change_you(animations.getup);
      }else if(player == 1){
        animation_change_enemy(animations.getup);
      }
    }, 495);
  }, 7000/15);
});
socket.on('already_in_game', function(){
  alert('This account is already currently in a game or in a queue. Please leave current game or queue and try again!');
});
socket.on('Won',function(){
  window.location = '/ninjas/results/Win/0';
});
socket.on('lost',function(){
  window.location = '/ninjas/results/Loss/0';
});
socket.on('Won2',function(elo){
  window.location = '/ninjas/results/Win/' + elo;
});
socket.on('lost2',function(elo){
  window.location = '/ninjas/results/Loss/' + elo;
});
