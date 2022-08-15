class Spawner{
    constructor(x,y){

        this.x = x;
        this.y = y;

        var p = {color:[rgb(222, 210, 202)], angle: [0, 360], shape: 'rect', size: [4,4], sizePercent: 0.90};
        this.of = new Fountain(null, p, x, y);
        var p2 = {color:[rgb(194, 175, 163)], angle: [0, 360], shape: 'rect', size: [3,3], sizePercent: 0.90};
        this.of2 = new Fountain(null, p2, x, y);

        this.cooldown = random(2,10);

        this.levellock = 0;

    }

    logic(enemyGroup, Enemies, player, min, max){
        if(player.score >= this.levellock){
            this.of.CreateN();
            this.of.Draw();
            this.of.Step();
            this.of2.CreateN();
            this.of2.Draw();
            this.of2.Step();

            if (this.cooldown == 0) {
                let enemy = new Enemy(this.x, this.y, floor(random(1,3)));
                enemy.defineType();
                Enemies.push(enemy);
                enemyGroup.add(enemy.sprite);

                this.cooldown = random(min, max);
            }

            if(this.cooldown != 0){
                this.cooldown -= 0.1;
            }
            if(this.cooldown < 0){
                this.cooldown = 0;
            }
        }
    }
}