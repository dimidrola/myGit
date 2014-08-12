﻿// Plane!

// © 2014 dimidrol

(window.onload = function () {


    var Game = {

        init: function () {
            this.c = document.getElementById("game");
            this.c.width = this.c.width;
            this.c.height = this.c.height;
            this.ctx = this.c.getContext("2d");
            this.color = "rgba(20,20,20,.4)";
            this.binding();
            this.player = new Player();
            this.enemy = new Enemy();
            this.backgroundUp = new BgUp();
            this.backgroundDown = new BgDown();
            this.lightning = new Lightning();
            this.bullet = [];
            this.rocket = [];
            
            this.score = 0;
            this.shooting = false;
            this.shootingR = false;


            this.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

            this.loop();
        },

        binding: function () {
            window.addEventListener("keydown", this.buttonDown);
            window.addEventListener("keyup", this.buttonUp);
            window.addEventListener("keypress", this.keyPressed);

        },


        buttonUp: function (e) {
            if (e.keyCode === 32) {
                Game.shooting = false;
                //Game.bullet.push(new Bullet())
            }
            if (e.keyCode === 37 || e.keyCode === 65) {
                Game.player.movingLeft = false;
            }
            if (e.keyCode === 39 || e.keyCode === 68) {
                Game.player.movingRight = false;
            }
            if (e.keyCode === 16) {
                if (Game.player.rocketEl) {
                    Game.rocket.push(new Rocket())
                    Game.player.rocketEl--;
                }
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
            if (e.keyCode === 16) {
                Game.shootingR = true;
            }
        },

        keyPressed: function (e) {
            if (e.keyCode === 32) {
                //Game.bullet.push(new Bullet())
                //setIntervall(function(){new Bullet()},900)
            }
        },
        clear: function () {
            this.ctx.fillStyle = Game.color;
            this.ctx.fillRect(0, 0, this.c.width, this.c.height);
        },
        turn: function () {

        },
        loop: function () {
            Game.clear();
            Game.backgroundDown.draw();
            Game.backgroundDown.update();
            Game.lightning.draw();
            Game.enemy.draw();
            Game.enemy.update();
            Game.player.draw();
            Game.player.update();
            Game.player.shooting();
           // Game.player.shootingR();
            for (var i = 0; i < Game.bullet.length; i++) {
                Game.bullet[i].draw();
                Game.bullet[i].update();
            }
            for (var i = 0; i < Game.rocket.length; i++) {
                Game.rocket[i].draw();
                Game.rocket[i].update();
            }
            Game.backgroundUp.draw();
            Game.backgroundUp.update();

            Game.currentFrame = Game.requestAnimationFrame.call(window, Game.loop);
           // console.log(Game.rocket)
        },


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
        this.rocketEl = 2;
        //this.color = "white";
        this.bg = new Image();
        this.bg.src = 'http://funkyimg.com/i/JSNX.png';
    };
    Player.prototype.draw = function () {
        if (this.movingLeft) {
            Game.ctx.setTransform(0.9, -0.1, 0.1, 0.95,this.x, this.y+10);
            Game.ctx.drawImage(this.bg, 0, 0);
            Game.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        else if (this.movingRight) {
            Game.ctx.setTransform(0.9, 0.1, -0.1, 0.95, this.x, this.y);
            Game.ctx.drawImage(this.bg, 0, 0);
            Game.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
       else Game.ctx.drawImage(this.bg, this.x, this.y);
        
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
        this.x = Game.c.width / 2 - this.width / 2;
        this.y = 0;
        this.movingLeft = true;
        this.movingRight = false;
        this.speed = 4;
    }
    Enemy.prototype.draw = function () {
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    Enemy.prototype.update = function () {
        if (this.movingLeft) {
            this.x -= this.speed;
        }
        if (this.movingRight) {
            this.x += this.speed;
        }
        if (this.x <= 0) {
            this.movingLeft = false;
            this.movingRight = true;
        }
        if (this.x + this.width >= Game.c.width) {
            this.movingLeft = true;
            this.movingRight = false;
        }
    }
    Enemy.prototype.die = function () {
        //if(Gmame)
    }
    //*************************BULLET*********************************//
    var Bullet = function () {
        this.width = 1;
        this.height = 5;
        this.random = Math.floor((Math.random() * 6) + 1 - 3);
        this.x1 = Game.player.x + Game.player.width / 2 - 27 + this.random;
        this.x2 = Game.player.x + Game.player.width / 2 + 27 + this.random;
        this.y = Game.player.y;
        this.color = 'white';
        this.speed = 10;
    }
    Bullet.prototype.draw = function () {
        Game.ctx.fillStyle = this.color;

        Game.ctx.fillRect(this.x1, this.y, this.width, this.height);
        Game.ctx.fillRect(this.x2, this.y, this.width, this.height);
    }
    Bullet.prototype.update = function () {
        this.y -= this.speed;
        if (this.y <= 5) {
            if ((this.x1 >= Game.enemy.x && this.x1 <= Game.enemy.x+Game.enemy.width) || (this.x2 >= Game.enemy.x && this.x2 < Game.enemy.x + Game.enemy.width)) {
                Game.enemy.color = 'red';
                console.log('s')
            }
            //console.log(this.x1, Game.enemy.x)
            Game.bullet.shift();
        }
    }

    var Rocket = function () {
        this.width = 3;
        this.height = 8;
        this.y = Game.player.y;
        this.color = 'red';
        this.speed =3;
        this.x1 = Game.player.x + Game.player.width / 2 - 27 ;
        this.x2 = Game.player.x + Game.player.width / 2 + 27 ;
    }
    Rocket.prototype.draw = function () {
        Game.ctx.fillStyle = this.color;
        this.random = Math.floor(Math.random() * 4 ) +1-2;
        this.x1 += this.random;
        this.x2 += this.random;
        Game.ctx.fillRect(this.x1, this.y, this.width, this.height);
        Game.ctx.fillRect(this.x2, this.y, this.width, this.height);
        //console.log(this.random)
    }
    Rocket.prototype.update = function () {
        this.y -= this.speed;
        if (this.y <= 0) {
            
            
            Game.rocket.shift();
        }
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
        this.speed = 2;
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

        if (this.y_next == 0) this.y = 0;
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
        if (this.y_next == 0) this.y = 0;
    }

    //********************

    Game.init();

});