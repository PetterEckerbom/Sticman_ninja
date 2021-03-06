var info = require('./information.js');
var matchmaking = require('./matchmaking_server.js');

exports.create_box = function(player, game){
  var cords = getbox_cords();
  if(matchmaking.STARTED_GAMES[game]){
    matchmaking.STARTED_GAMES[game].boxes.push({x:cords.x, y: cords.y, player: player});
    if(player === null){
      matchmaking.STARTED_GAMES[game].players[0].socket.emit('new_box',{cords: cords, type: "both"});
      matchmaking.STARTED_GAMES[game].players[1].socket.emit('new_box',{cords: cords, type: "both"});
    }else if(player === 0){
      matchmaking.STARTED_GAMES[game].players[0].socket.emit('new_box',{cords: cords, type: "yours"});
      matchmaking.STARTED_GAMES[game].players[1].socket.emit('new_box',{cords: cords, type: "enemys"});
    }else if(player === 1){
      matchmaking.STARTED_GAMES[game].players[0].socket.emit('new_box',{cords: cords, type: "enemys"});
      matchmaking.STARTED_GAMES[game].players[1].socket.emit('new_box',{cords: cords, type: "yours"});
    }
  }
};

function getbox_cords(){
  var platform = info.platforms[Math.floor(Math.random()*info.platforms.length)];
  var y = platform.y;
  var x = Math.floor(Math.random() * (platform.xend-platform.xstart - 25) + platform.xstart+25);
  return {x:x, y:y};
}

exports.open_box = function(socket){
  var game_index = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  if(game_index != -1){
    if(matchmaking.STARTED_GAMES[game_index.index]){
      var box_array = matchmaking.STARTED_GAMES[game_index.index].boxes;
      var player = matchmaking.STARTED_GAMES[game_index.index].players[game_index.Player];
      var notplayer = matchmaking.STARTED_GAMES[game_index.index].players[game_index.NotPlayer];
      for(var i = 0; i < matchmaking.STARTED_GAMES[game_index.index].boxes.length; i++){
        if(player.x*1 - (player.state.hitbox_W*1/2) <= box_array[i].x*1 + 25 && player.x*1 + (player.state.hitbox_W*1/2) >= box_array[i].x*1 - 25){
          if(player.y*1 == box_array[i].y*1){
            if(game_index.Player == box_array[i].player || box_array[i].player == null){
              var type = 1;
              if(game_index.Player == box_array[i].player ){
                type = 2;
              }
              var item = get_random_item(type);
              player.socket.emit('new_item', item);
              player.item = item.name;
              player.charges = item.charges;
              player.socket.emit('remove_box', box_array[i]);
              notplayer.socket.emit('remove_box', box_array[i]);
              box_array.splice(i, 1);
              return;
            }
          }
        }
      }
    }
  }
};

function get_random_item(type){
  var random =  Math.random();
  if(random < (1/6)){
    return {name: "shuriken", charges: (Math.floor(Math.random()*4)+1) * type};
  }else if(random < (2/6)){
    return {name: "bomb", charges: (Math.floor(Math.random()*2)+1) * type};
  }else if(random < (3/6)){
    return {name: "wings", charges: 1};
  }else if(random < (4/6)){
    return {name: "iceball", charges: (Math.floor(Math.random()*15)+5) * type};
  }else if(random < (5/6)){
    return {name: "Sushi", charges: (Math.floor(Math.random()*7)+3) * type};
  }else{
    return {name: "banana", charges: (Math.floor(Math.random()*3)+2) * type};
  }
}
