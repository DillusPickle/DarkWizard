class Player{
    constructor(x,y,image,staffimage){

        this.sprite = createSprite(x,y,64,64);
        
        this.image = loadImage(image);
        this.staffimage = loadImage(staffimage);

        this.sprite.addImage('sprite', this.image)
        this.sprite.setCollider('rectangle',0,0,24,24);

        this.staff = createSprite(x,y,20,20);
        this.staff.addImage('sprite', this.staffimage);
        
        this.score = 0;

        this.hp = 3;
        this.heartImg = loadImage('assets/hp.png');
        this.invincibility = 0;
        this.healingtimercooldown = 500;
        this.healingtimer = 500;

        this.hp1 = createSprite(50,50,1,1);
        this.hp1.addImage('icon',this.heartImg);
        this.hp2 = createSprite(75,50,1,1);
        this.hp2.addImage('icon',this.heartImg);
        this.hp3 = createSprite(100,50,1,1);
        this.hp3.addImage('icon',this.heartImg);

        this.cooldown = 0;
        this.timer = 7;
        this.bulletdistance = 20;
        this.bulletsize = [8, 3];
        this.spells = new Group();

        this.of;

        var p = {color:['orange'], angle: [0, 360], shape: 'rect', size: [5,3], sizePercent: 0.96};
        this.of = new Fountain(null, p, -1200, -1200);

        var p2 = {color:['red'], angle: [0, 360], shape: 'rect', size: [3,2], sizePercent: 0.93};
        this.of2 = new Fountain(null, p2, -1200, -1200);

        var p3 = {color:['yellow'], angle: [0, 360], shape: 'rect', size: [2,1.5], sizePercent: 0.89};
        this.of3 = new Fountain(null, p3, -1200, -1200);

    }

    movement(){
        if(keyDown('w')||keyDown(UP_ARROW)){
            this.sprite.y -= 5;
        }
        if(keyDown('a')||keyDown(LEFT_ARROW)){
            this.sprite.x -= 5;
            this.sprite.mirrorX(-1);
        }
        if(keyDown('d')||keyDown(RIGHT_ARROW)){
            this.sprite.x += 5;
            this.sprite.mirrorX(1);
        }
        if(keyDown('s')||keyDown(DOWN_ARROW)){
            this.sprite.y += 5;
        }
    }

    stafflogic(atkSFX, sfxOn){
        
        this.staff.x = this.sprite.x;
        this.staff.y = this.sprite.y;

        this.staff.pointTo(mouseX, mouseY);

        if(mouseWentDown(LEFT)&&this.cooldown == 0){
            if(sfxOn == true){
                atkSFX.play();
            }
            
            var spell = createSprite(this.sprite.x, this.sprite.y, this.bulletsize[0], this.bulletsize[1]);
            spell.lifetime = this.bulletdistance;
            spell.visible = false;
            spell.setCollider('rectangle',0,0,12,6)
            //spell.debug = true;
            spell.attractionPoint(7, mouseX, mouseY);
            spell.pointTo(mouseX, mouseY);
            this.spells.add(spell);

            this.cooldown = this.timer;
        }

        if(this.cooldown != 0){
            this.cooldown -= 0.1;
        }
        if(this.cooldown < 0){
            this.cooldown = 0;
        }
        
        push();
        for(spell in this.spells){
            this.of.CreateN(this.spells[spell].x, this.spells[spell].y);

            this.of2.CreateN(this.spells[spell].x, this.spells[spell].y);

            this.of3.CreateN(this.spells[spell].x, this.spells[spell].y);
        }
        this.of.Draw();
        this.of.Step();

        this.of2.Draw();
        this.of2.Step();

        this.of3.Draw();
        this.of3.Step();
        pop();
    
    }

    healthLogic(){

        switch(this.hp){
            case 3:
                this.hp3.visible = true;
                this.hp2.visible = true;
                this.hp1.visible = true;
                break;
            case 2:
                this.hp3.visible = true;
                this.hp2.visible = true;
                this.hp1.visible = false;
                break;
            case 1:
                this.hp3.visible = true;
                this.hp2.visible = false;
                this.hp1.visible = false;
                break;
            case 0:
                this.hp3.visible = false;
                this.hp2.visible = false;
                this.hp1.visible = false;
        }

        if(this.hp < 0){
            this.hp = 0;
        }
        if(this.hp > 3){
            this.hp = 3;
        }

        if(this.healingtimer > 0){
            this.healingtimer -= 1;
        }
        
        if(this.healingtimer == 0){
            this.hp += 1;
            this.healingtimer = this.healingtimercooldown;
        }

        if(this.invincibility > 0){
            this.invincibility -= 1;
        }
    }
}
