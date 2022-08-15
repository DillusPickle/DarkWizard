class Enemy{
    constructor(x,y,type){

        this.sprite = createSprite(x,y,64,64);

        this.type = type;
        
        this.sprite.setCollider('rectangle',0,0,32,32);

        this.cooldown = 0;
    }

    defineType(){
        if(this.type == 1){
            this.image = loadImage('assets/bat.png');
            this.speed = 1.5;
            this.sprite.addImage('sprite', this.image);
        }
        if(this.type == 2){
            this.image = loadImage('assets/skeleton.png');
            this.speed = 3;
            this.sprite.addImage('sprite', this.image);
        }
    }

    movement(player){
        if (this.cooldown == 0) {
            this.sprite.velocityX = 0;
            this.sprite.velocityY = 0;
            this.sprite.attractionPoint(this.speed, player.x, player.y);
            this.cooldown = 1;
        }

        if(this.cooldown != 0){
            this.cooldown -= 0.1;
        }
        if(this.cooldown < 0){
            this.cooldown = 0;
        }

        if(this.type == 2){
            this.sprite.collide(map.tile_colliders);
        }
        
    }

    logic(player, map, hitSFX, sfxOn){
        if(this.sprite.collide(player.spells)){
            this.sprite.remove();
            if(sfxOn == true){
                hitSFX.play();
            }
            player.score++;
            if(player.score % 20 == 0 && player.score < 120){
                player.timer -= 0.8;
                player.bulletdistance += 5;
                player.bulletsize += [2,0.5];
                map.spawnerMinCooldown -= 1;
                map.spawnerMaxCooldown -= 2
            }
            if(player.score % 40 == 0 && player.score < 120){
                map.spawnerMinCooldown -= 1;
                map.spawnerMaxCooldown -= 3
            }
        }
    }
    
}
