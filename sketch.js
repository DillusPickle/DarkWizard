var player, map, Enemies, enemyGroup;

var gameState, menuState;

var BJG, mainmenu, forest, menuSFX, attackSFX, hitSFX;

var musicSetting, sfxSetting, musicSettingX, sfxSettingX, musicOn, sfxOn, clicktimer;

var startButton;

function preload() {

  soundFormats('ogg','wav');

  BJG = loadFont('assets/BJG.woff');

  mainmenu = loadSound('assets/main.ogg');
  forest = loadSound('assets/forest.ogg');

  menuSFX = loadSound('assets/menu.ogg');
  attackSFX = loadSound('assets/firecast.ogg');
  hitSFX = loadSound('assets/hit.ogg');
}

function setup() {
  createCanvas(640, 640);

  gameState = 'start';
  menuState = 'play';

  player = new Player(320,320,"assets/player.png", "assets/smolstaff.png");
  map = new Map(loadImage("assets/wall1.png"),loadImage("assets/tree1.png"),loadImage("assets/fence1.png"));

  musicSetting = createSprite(350,275,32,32);
  musicSetting.addImage(loadImage('assets/music.png'));
  musicSetting.visible = false;

  musicSettingX = createSprite(350,275,0,0);
  musicSettingX.addImage(loadImage('assets/X.png'));
  musicSettingX.visible = false;

  sfxSetting = createSprite(345,325,32,32);
  sfxSetting.addImage(loadImage('assets/sfx.png'));
  sfxSetting.visible = false;

  sfxSettingX = createSprite(345,325,0,0);
  sfxSettingX.addImage(loadImage('assets/X.png'));
  sfxSettingX.visible = false;

  musicOn = true;
  sfxOn = true;

  clicktimer = 0;

  Enemies = [];
  enemyGroup = new Group();

  map.drawMap();

  mainmenu.play();
}

function draw() {
  background(rgb(15, 0, 20));

  if(gameState == 'start'){
    player.sprite.visible = false;
    player.staff.visible = false;
    player.hp3.visible = false;
    player.hp2.visible = false;
    player.hp1.visible = false;

    drawSprites();

    if(menuState == 'play'){
      textSize(90);
      textFont(BJG);
      fill(rgb(222, 210, 202));
      text('DARK FOREST',30,260);
      
      textSize(30);
      textFont(BJG);
      fill(rgb(194, 175, 163));
      text('Press "enter"',210,330);
      text('to start',250,350);

      textSize(30);
      textFont(BJG);
      fill(rgb(194, 175, 163));
      text('Press "s"',238,500);
      text('to change',238,520);
      text('settings',245,540);

      textSize(15);
      textFont(BJG);
      fill(rgb(194, 175, 163));
      text('W, A, S and D',100,500);
      text('to move',100,515);
      text('Right click',100,545);
      text('to fire',100,560);
      
      if(keyWentDown('s')){
        menuState = 'settings';

        musicSetting.visible = true;
        sfxSetting.visible = true;
        if(musicOn == false){
          musicSettingX.visible = true;
        }
        if(sfxOn == false){
          sfxSettingX.visible = true;
        }
      }

      if(keyDown('enter')){
        player.sprite.visible = true;
        player.staff.visible = true;

        player.hp = 3;

        if(sfxOn == true){
          menuSFX.play();
        }
        

        if(musicOn == true){
          mainmenu.stop();
          forest.play();
        }

        gameState = 'game';
      }
    }

    if(menuState == 'settings'){
      textSize(90);
      textFont(BJG);
      fill(rgb(222, 210, 202));
      text('SETTINGS',100,200);

      textSize(20);
      textFont(BJG);
      fill(rgb(194, 175, 163));
      text('click to change settings',178,230);

      textSize(30);
      textFont(BJG);
      fill(rgb(194, 175, 163));
      text('Music:',210,280);

      textSize(30);
      textFont(BJG);
      fill(rgb(194, 175, 163));
      text('SFX:',250,330);

      textSize(30);
      textFont(BJG);
      fill(rgb(194, 175, 163));
      text('Press "esc"',228,500);
      text('to go back',235,520);
      

      if(mousePressedOver(musicSetting)&&clicktimer==0){
        if(musicSettingX.visible == false){
          musicSettingX.visible = true;
          musicOn = false;
          clicktimer = 1;

          mainmenu.stop();
        }
        else if(musicSettingX.visible == true){
          musicSettingX.visible = false;
          musicOn = true;
          clicktimer = 1;

          mainmenu.play();
        }
      }

      if(mousePressedOver(sfxSetting)&&clicktimer==0){
        if(sfxSettingX.visible == false){
          sfxSettingX.visible = true;
          sfxOn = false;
          clicktimer = 1;
        }
        else if(sfxSettingX.visible == true){
          sfxSettingX.visible = false;
          sfxOn = true;
          clicktimer = 1;
        }
      }

      if(clicktimer != 0){
        clicktimer -= 0.1;
      }
      if(clicktimer < 0){
          clicktimer = 0;
      }

      if(keyWentDown('esc')){
        menuState = 'play';

        musicSetting.visible = false;
        sfxSetting.visible = false;
        musicSettingX.visible = false;
        sfxSettingX.visible = false;
      }

    }
  }
  if(gameState == 'game'){

    textSize(30);
    textFont(BJG);
    fill(rgb(194, 175, 163));
    text(player.score, 40, 80);

    player.movement();
    player.stafflogic(attackSFX, sfxOn);
    player.healthLogic();

    if(map.spawners != null){
      for(spawner in map.spawners){
        map.spawners[spawner].logic(enemyGroup, Enemies, player, map.spawnerMinCooldown, map.spawnerMaxCooldown);
      }
    }

    if(Enemies != null){
      for(enemy in Enemies){
        Enemies[enemy].movement(player.sprite);
        Enemies[enemy].logic(player, map, hitSFX, sfxOn);
      }
    }

    player.sprite.collide(map.tile_colliders);

    if(player.sprite.overlap(enemyGroup)&&player.invincibility == 0){
      player.hp -= 1;
      player.invincibility = 20;

      if(sfxOn == true){
        hitSFX.play();
      }
    }

    if(player.hp == 0){
      player.sprite.visible = false;
      player.staff.visible = false;
      player.hp3.visible = false;
      player.hp2.visible = false;
      player.hp1.visible = false;

      gameState = 'over';
    }
    drawSprites();
  }
  if(gameState == 'over'){

    for(enemy in Enemies){
      Enemies[enemy].sprite.remove();
    }

    textSize(60);
    textFont(BJG);
    fill(rgb(222, 210, 202));
    text('GAME OVER',160,280);

    textSize(30);
    textFont(BJG);
    fill(rgb(194, 175, 163));
    text(player.score, 310, 380);

    textSize(30);
    fill(rgb(194, 175, 163));
    text('Press "enter"',210,330);
    text('to restart',230,350);

    if(keyDown('enter')){
      player.sprite.visible = false;
      player.staff.visible = false;

      player.score = 0;

      player.sprite.x = 320;
      player.sprite.y = 320;
      player.sprite.velocityX = 0;
      player.sprite.velocityY = 0;

      if(sfxOn == true){
        menuSFX.play();
      }

      if(musicOn == true){
        mainmenu.play();
        forest.stop();
      }
      

      gameState = 'start';
    }
    drawSprites();
  }

  //drawSprites();
}