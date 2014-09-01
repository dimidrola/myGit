// Plane!

// © 2014 dimidrol

(window.onload = function () {


    var Game = {

        init: function () {
            this.c = document.getElementById("game");
            this.c.width = this.c.width;
            this.c.height = this.c.height;
            this.ctx = this.c.getContext("2d");
            this.color = "rgba(20,20,20,.4)";
            //add events
            this.binding();
            //create player and enemies
            this.player = new Player();
            this.enemyId = 0;
            this.enemy = [new Enemy()];
            
            //scene
            this.backgroundUp = new BgUp();
            this.backgroundDown = new BgDown();
            this.lightning = new Lightning();
            //shooting
            this.bullet = [];
            this.shooting = false;

            this.score = 0;
            
            this.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
            this.loop();
        },

        binding: function () {
            window.addEventListener("keydown", this.buttonDown);
            window.addEventListener("keyup", this.buttonUp);
        },

        buttonUp: function (e) {
            if (e.keyCode === 32) {
                Game.shooting = false;
            }
            if (e.keyCode === 37 || e.keyCode === 65) {
                Game.player.movingLeft = false;
                Game.player.animationTimer = 0;
            }
            if (e.keyCode === 39 || e.keyCode === 68) {
                Game.player.movingRight = false;
                Game.player.animationTimer = 0;
            }
        },

        buttonDown: function (e) {
            if (e.keyCode === 32) {
                Game.shooting = true;
            }
            if (e.keyCode === 37 || e.keyCode === 65) {
                Game.player.movingLeft = true;
            }
            if (e.keyCode === 39 || e.keyCode === 68) {
                Game.player.movingRight = true;
            }
        },

        clear: function () {
            this.ctx.fillStyle = Game.color;
            this.ctx.fillRect(0, 0, this.c.width, this.c.height);
        },
  
        loop: function () {
            Game.clear();
            Game.backgroundDown.draw();
            Game.backgroundDown.update();
            Game.lightning.draw();
            //Game.enemy.draw();
            //Game.enemy.update();
          
            for (var j = 0; j < Game.enemy.length; j++) {
                    if (Game.enemy[j]){
                        Game.enemy[j].draw();
                        Game.enemy[j].update();
                        Game.enemy[j].dead();
                    }
            }
            
            Game.player.draw();
            Game.player.update();
            Game.player.shooting();
            for (var i = 0; i < Game.bullet.length; i++) {
                Game.bullet[i].draw();
                Game.bullet[i].update();
            }
            //console.log(Game.bullet.length)
            Game.backgroundUp.draw();
            Game.backgroundUp.update();



            Game.currentFrame = Game.requestAnimationFrame.call(window, Game.loop);
        }


    };

    //*******************PLAYER**************************//
    var Player = function () {
        this.width = 80;
        this.height = 83;
        this.x = Game.c.width / 2 - this.width / 2;
        this.y = Game.c.height - this.height;
        this.movingLeft = false;
        this.movingRight = false;
        this.speed = 6;
        this.shootingspeed = 50;
        this.shootingTimer = 0;
        this.animationTimer = 0;
        this.bg = new Image();
        this.bg.src = 'http://funkyimg.com/i/JSNX.png';
    };
    Player.prototype.draw = function () {
        var turning = Math.sin(this.animationTimer / 7) / 10;
        if (this.movingLeft) {
            Game.ctx.setTransform(1, -turning, 0, 1, this.x, this.y + (turning/2*100));
            if (turning >= 0) {
                this.animationTimer++;
            }
            Game.ctx.drawImage(this.bg, 0, 0);
            Game.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        else if (this.movingRight) {
            Game.ctx.setTransform(1, turning, 0, 1, this.x, this.y - (turning / 2 * 100));
            if (turning >= 0) {
                this.animationTimer++;
            }
            Game.ctx.drawImage(this.bg, 0, 0);
            Game.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        else {
            
            Game.ctx.drawImage(this.bg, this.x, this.y);
        }

        
    };
   
    Player.prototype.update = function () {
        if (this.movingLeft && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.movingRight && this.x + this.width < Game.c.width) {
            this.x += this.speed;
        }
    };
    Player.prototype.shooting = function () {
        if (Game.shooting) {
            if (this.shootingTimer < 2) {
                Game.bullet.push(new Bullet())
            }
            this.shootingTimer++;
        }
        if (this.shootingTimer >= 10) this.shootingTimer = 0;
    }
    //****************************ENEMY*********************************//
    var Enemy = function () {
        this.width = 50;
        this.height = 10;
        this.color = 'blue';
       
        this.angle = Math.random()*1.2;
        this.colArr = 'red';
        this.movingLeft = true;
        this.movingRight = false;
        this.speed = .3;
        this.y = 0;
        this.life = 2;
        this.id = Game.enemyId;
    }
    Enemy.prototype.draw = function () {
        Game.ctx.fillStyle = this.colArr;
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    Enemy.prototype.update = function () {
        var time = new Date().getTime() * 0.001;
        this.x = Math.sin(time * this.angle) * (300 - this.width / 2) + 300 - this.width / 2//* 200 + 280;
        this.y += this.speed;
    }
    Enemy.prototype.dead = function () {
        if (this.life <= 0) {
            delete Game.enemy[this.id];
            this.life = 2;
            this.addEnemy();
            this.addEnemy();
        }
        
    }
    Enemy.prototype.addEnemy = function () {
        Game.enemyId++;
        Game.enemy.push(new Enemy())
    }
    //*************************BULLET*********************************//
    var Bullet = function () {
        this.width = 1;
        this.height = 5;
        this.random = Math.floor((Math.random() * 6) + 1 - 3);
        this.x1 = Game.player.x + Game.player.width / 2 - 27 + this.random;
        this.x2 = Game.player.x + Game.player.width / 2 + 27 + this.random;
        this.y = Game.player.y;
        this.color = 'green';
        this.speed = 15;
    }
    Bullet.prototype.draw = function () {
        Game.ctx.fillStyle = this.color;

        Game.ctx.fillRect(this.x1, this.y, this.width, this.height);
        Game.ctx.fillRect(this.x2, this.y, this.width, this.height);
    }
    Bullet.prototype.update = function () {
        this.y -= this.speed;

        var self = this;
        function foreach(item, i, arr) {
            
            if ((self.x1 >= Game.enemy[i].x && self.x1 <= Game.enemy[i].x + Game.enemy[i].width)
                && (self.y >= Game.enemy[i].y && self.y <= Game.enemy[i].y + Game.enemy[i].height)) {

                Game.score++;
                document.getElementById('rat').innerHTML = Game.score;
                self.x1 = 9999;
                Game.enemy[i].life--;
                console.log(Game.enemy[i].life, Game.enemy[i].id)
            }
            else if ((self.x2 >= Game.enemy[i].x && self.x2 <= Game.enemy[i].x + Game.enemy[i].width)
                && (self.y >= Game.enemy[i].y && self.y <= Game.enemy[i].y + Game.enemy[i].height)) {
                Game.score++;
                document.getElementById('rat').innerHTML = Game.score;
                self.x2 = 9999;
                Game.enemy[i].life--;
                console.log(Game.enemy[i].life, Game.enemy[i].id)
            }
           

            
        }
        if (this.y <= 0) {
            Game.bullet.shift();

        }
        Game.enemy.forEach(foreach);

    }

    //*********************lightning*********************/
    var Lightning = function () {
        this.random = Math.floor((Math.random() * 6) + 1 - 3);
        this.bg = new Image();
        this.bg.src = 'http://funkyimg.com/i/JUSD.jpg';
        this.frequency = 334;
    }
    Lightning.prototype.draw = function () {
        this.timer = +(new Date());

        if (this.timer % this.frequency == 0) {
            this.random = Math.floor((Math.random() * 1000) - 1000);
            Game.ctx.drawImage(this.bg, 0 + this.random, 0, this.bg.width, Game.c.height);
        }
    }

    //**********************phone*******************/
    var BgUp = function () {
        this.bg = new Image();
        this.bg.src = 'http://funkyimg.com/i/JURf.png';
        this.speed = 10;
        this.width = this.bg.width;
        this.height = this.bg.height;
        this.x = 0;
        this.y = Game.c.height - this.height;
    }
    BgUp.prototype.draw = function () {
        Game.ctx.drawImage(this.bg, this.x, this.y);
        Game.ctx.drawImage(this.bg, this.x, this.y_next);

    }
    BgUp.prototype.update = function () {
        this.y += this.speed;
        this.y_next = this.y - this.height;

        if (this.y_next >= 0) this.y = 0;
    }

    var BgDown = function () {
        this.bg = new Image();
        this.bg.src = 'http://funkyimg.com/i/JU3U.jpg';
        this.speed = .4;
        this.width = this.bg.width;
        this.height = this.bg.height;
        this.x = 0;
        this.y = Game.c.height - this.height;

    }
    BgDown.prototype.draw = function () {

        Game.ctx.drawImage(this.bg, this.x, this.y);
        Game.ctx.drawImage(this.bg, this.x, this.y_next);
    }
    BgDown.prototype.update = function () {
        this.y += this.speed;
        this.y_next = this.y - this.height;
        //console.log(this.y, this.y_next)
        if (this.y_next >= 0) this.y = 0;
    }

    //********************

    Game.init();

});