(function () {
    // Create the canvas
    var canvas = document.querySelector('#skipclear');
    var ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 480;

    // Background image
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function () {
        bgReady = true;
    };
    bgImage.src = "images/background.png";

    // Hero image
    var heroReady = false;
    var heroImage = new Image();
    heroImage.onload = function () {
        heroReady = true;
    };
    heroImage.src = "images/hero.png";

    // Monster image
    var monsterReady = false;
    var monsterImage = new Image();
    monsterImage.onload = function () {
        monsterReady = true;
    };
    monsterImage.src = "images/monster.png";

    // Game objects
    var hero = {
        speed: 256 // movement in pixels per second
    };
    var monster = {};
    var monstersCaught = 0;

    // Handle keyboard controls
    var keysDown = {};

    function keydown (e) {
        e.preventDefault();
        e.stopPropagation();
        keysDown[e.keyCode] = true;

        if (e.keyCode === 27) {
            document.body.removeEventListener("keydown", keydown);
            document.body.removeEventListener("keyup", keyup);
            for (var key in keysDown) {
                if (keysDown.hasOwnProperty(key)) {
                    delete keysDown[key];
                }
            }
        }
    }

    function keyup (e) {
        e.preventDefault();
        e.stopPropagation();
        delete keysDown[e.keyCode];
    }

    // Reset the game when the player catches a monster
    var reset = function () {
        hero.x = canvas.width / 2;
        hero.y = canvas.height / 2;

        // Throw the monster somewhere on the screen randomly
        monster.x = 32 + (Math.random() * (canvas.width - 64));
        monster.y = 32 + (Math.random() * (canvas.height - 64));
    };

    // Update game objects
    var update = function (modifier) {
        if (38 in keysDown) { // Player holding up
            hero.y -= hero.speed * modifier;
        }
        if (40 in keysDown) { // Player holding down
            hero.y += hero.speed * modifier;
        }
        if (37 in keysDown) { // Player holding left
            hero.x -= hero.speed * modifier;
        }
        if (39 in keysDown) { // Player holding right
            hero.x += hero.speed * modifier;
        }

        // Are they touching?
        if (
            hero.x <= (monster.x + 32)
                && monster.x <= (hero.x + 32)
            && hero.y <= (monster.y + 32)
            && monster.y <= (hero.y + 32)
        ) {
            ++monstersCaught;
            reset();
        }
    };

    var loc = window.location.toString();
    var first = true;

    // Draw everything
    var render = function () {
        if (bgReady && first) {
          if (first) {
            first = false;
            ctx.drawImage(bgImage, 0, 0);
              ctx.fillStyle='#F8F8F8';
              ctx.fillRect(0,0,512,480);
          }
        }

        if (heroReady) {
            ctx.drawImage(heroImage, hero.x, hero.y);
        }

        if (monsterReady) {
            ctx.drawImage(monsterImage, monster.x, monster.y);
        }

        // Score
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font = "22px 'Ubuntu Mono'";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("GOBLINS CAUGHT: " + monstersCaught, 32, 32);
    };

    // The main game loop
    var main = function () {
        var now = Date.now();
        var delta = now - then;

        update(delta / 1000);
        render();

        then = now;

        requestAnimationFrame(main);
    };

    var then = Date.now();

    // Let's play this game!
    canvas.addEventListener('click', function () {
        document.body.addEventListener("keydown", keydown);
        document.body.addEventListener("keyup", keyup);

        reset();
        then = Date.now();
        setInterval(main, 33.33); // Execute as fast as possible
        main();
    });
})();
