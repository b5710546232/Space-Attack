function preload_hud(){
  game.load.image('player_death','res/images/hud_player_death.png');
  game.load.image('kill_bonus','res/images/hud_kill_bonus.png');
  game.load.image('excellent','res/images/hud_excellent.png');
  game.load.image('loading','res/images/hud_loading.png');
}

function create_hud(){
  msgs = game.add.group();
  textGroup = game.add.group();
  new_text("Score: " + score);
  new_text("Kills: " + enemies_killed);
  new_text("Deaths: " + player_deaths);
}

function update_hud(){
  messages_timeout();
  textGroup.children[0].text="Score: " + score;
  textGroup.children[1].text="Kills: " + enemies_killed;
  textGroup.children[2].text="Deaths: " + player_deaths;
}

function message(msg,timeout){
  //if timeout not set, default to 3 seconds
  if(typeof timeout === 'undefined'){timeout = 3000}
  //destroy any exisiting messages
  destroy_messages();

  //display new message
  msg = msgs.create(game.width/2,game.height/2,msg); 
  msg.anchor.setTo(.5,.5);

  //set timeout for msg
  msg.timeout = game.time.now + timeout;
}

function destroy_messages(){
  msgs.forEach(function(msg){
    msg.destroy();
  });
}

function messages_timeout(){
  msgs.forEach(function(msg){
    if(game.time.now > msg.timeout){
      msg.destroy();
    }
  });
}

function new_text(txt){
  var size = 50;
  var pos = textGroup.children.length * size;
  var text = textGroup.add(game.make.text(10, pos, txt));

  //  Center align
  //text.anchor.set(0.5);
  //text.align = 'center';

  //  Font style
  text.font = 'Arial Black';
  text.fontSize = size;
  text.fontWeight = 'bold';

  //  Stroke color and thickness
  text.stroke = '#000000';
  text.strokeThickness = 6;
  text.fill = '#43d637';
}


