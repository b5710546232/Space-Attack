var power_delay;

function create_powerup(){
  power_delay = game.time.now + 60000 * 1;
  powerups = game.add.group();
  powerups.enableBody = true;
  powerup_list = ["missile2","wingman","invincibility","diagonal_gun"];
}

function update_powerup(){
  if(game.time.now > power_delay){
    var powerup = powerup_list[Math.floor(Math.random()*powerup_list.length)];
    new_powerup(powerup);   
  }

  //if player collects powerup
  game.physics.arcade.overlap(powerups, player, collect_powerup, null, this);

}

function new_powerup(type){
  var i = Math.floor(Math.random() * 30000) + 10000;
  power_delay = game.time.now + i;
  var y = game.world.randomY / 2;
  var vely = 100;
  var x = Math.floor(Math.random() * 2);
  if(x == 1){
    var x = game.width;
    var velx = -30;
  }else{
    var x = 0;
    var velx = 30;
  }

  var powerup = powerups.create(x,y,type);
  powerup.anchor.setTo(0.5,0.5);
  powerup.body.velocity.x = velx;
  powerup.body.velocity.y = vely;
  powerup.type = type;

  //set death after 1 minute
  game.time.events.add(Phaser.Timer.SECOND * 60, kill_powerup, this, powerup);
  
}

function kill_powerup(powerup){
  powerup.kill();
}

function collect_powerup(player,powerup){
  if(powerup.type == "missile2"){
    message("mega1");
    var snd = game.add.audio("mega1");
    snd.play();
    bonus_points(20);
    enemies.forEach(function(enemy){
      if(!enemy.boss){
        var i = Math.floor(Math.random() * 300) + 100;
        game.time.events.add(i , enemy_death, this, enemy);
      }
    });
  }else if(powerup.type == "wingman"){
    var snd = game.add.audio(powerup.type);
    snd.play();
    mother_ship();
  }else if(powerup.type == "invincibility"){
    player_invincible(player,true,10,true);
  }else if(powerup.type == "diagonal_gun"){
    player.weapon = "diagonal_gun";
    message("hud_diagonal_gun");
    var snd = game.add.audio("powerup");
    snd.play();

  }

  kill_powerup(powerup);
}

function bonus_points(amount){
  if(typeof amount === 'undefined'){amount = 20}
  var s = 0;
  var points = setInterval(function(){
    s+=1
    score+=10;
    var point = game.add.audio("coin10");
    point.volume = .2;
    point.play();
    if(s >= amount){clearInterval(points)};
  },100,s);

}

function mother_ship(){
  message("hud_mother_ship");
  var mother = game.add.sprite(game.width/2,game.height+512,"player");
  mother.anchor.setTo(.5,.5);
  mother.scale.setTo(5,5);

  //shoot position
  mother.sx = -40;

  //bring ship onto screen
  var tween = game.add.tween(mother);
  tween.to({ y: game.height }, 2000);
  tween.onComplete.add(mother_attack,this,mother);
  tween.start();

  //animate random left/right movements
  mother.tween = setInterval(function(){  
    var tween = game.add.tween(mother);
    var x = game.width/2 + (Math.floor(Math.random() * 200) -200) + 100;
    tween.to({ x: x}, 500, Phaser.Easing.Linear.None);
    tween.start();
  },500);

  //move ship off screen
  setTimeout(function(mother){
    clearInterval(mother.tween);
    var tween = game.add.tween(mother);
    tween.to({ y: game.height + 512 }, 2000);
    tween.start();
    tween.onComplete.add(function(mother){
      mother.destroy();
    },this,mother);
  },10000,mother);

}

function mother_attack(mother){
  var y = game.height - 256;
  
  var s = setInterval(function(mother,y){
    mother.sx +=50;
    x = mother.sx;
    if(x > game.width){
      mother.sx = -40;
    }  
    shoot(undefined,-5,"player-bullet",2,x,y);
  },100,mother,y);

  setTimeout(function(){
    clearInterval(s);
    bonus_points(20); 
  },5000);
}
