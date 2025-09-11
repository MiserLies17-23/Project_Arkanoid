// Сырой вариант! Комментарии и необходимые улучшения добавлю на след. неделе
$(document).ready(function() {

    let conteiner = $("#main-conteiner");
    const conteinerWidth = conteiner.width();
    const ConteinerHeight = conteiner.height();
    
    let count = 0;
    let platformEnabled = true;

    // Функции для класса Game
    $("#ready").on('click', function() {
        updateConteiner();
        createCounter();
        createShapes();
        createPlatform();
        createBall(); 
    })

    function updateConteiner() {
        conteiner.empty();
        let line = $("<div>")
            .attr("id", "line")
            .addClass("object line")
            .css({
                "top": ConteinerHeight - 5 + "px"
            })
        conteiner.append(line);
    }

    function createCounter() {
        const width = 150, height = 50;
        let counter = $("<div>")
            .attr("id", "counter")
            .css({
                "width": width + "px",
                "height": height + "px",
                "position": "relative",
                "top": "10px", 
                "left": "10px",
                "border": "1px solid black",
                "margin": "10px auto",
            })
            .text("Счёт: " + count)
        $("body").append(counter);
    }

    let updateCounter = () => $("#counter").text("Счёт: " + count) 

    // Функции для класса Square
    function createShapes() {
        let def = 3;
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 20; i++) {
                let color = getColor(def);
                let square = $("<div>")
                    .attr("id", "sqr" + j + i)
                    .addClass("object squares")
                    .css({
                        "background": color,
                        "top": j*40 + "px", 
                        "left": i*50 + "px",
                    })
                    .data("defense", def)
                conteiner.append(square);
            }
            def--
        }
    }
    
    function getColor(def) {
        if(def == 3) {
            return "red";
        } else if (def == 2) {
            return "yellow";
        } else {
            return "green";
        }
    }

    function defensCheck(square) {
        let def = square.data("defense"); 
        def--; 
        if (def == 0) {
            square.remove(); 
            count++;
        } else {
            square.data("defense", def);
            square.css({"background":getColor(def)});
        }
    }

    // Функция для класса platform; 
    function createPlatform() {
        let platform = $("<div>")
            .attr("id", "platform")
            .addClass("object platform")
        conteiner.append(platform);

        let posX = parseInt($("#platform").css("left"));
        $(document).keydown(function(e) {
            if (!platformEnabled) return false;

            const step = 20;
            const platform = $("#platform");
            let posX = parseInt(platform.css("left")) || 0;
            
            if(e.key === 'ArrowRight') posX += step;
            if(e.key === 'ArrowLeft') posX -= step;
            
            // Ограничение движения контейнера
            posX = Math.max(0, Math.min(posX, conteiner.width() - platform.outerWidth()));
            
            platform.css("left", posX + "px");
        });
    }

    // Функция для класса Ball
    function createBall() {

        let ball = $("<div>")
            .attr("id", "ball")
            .addClass("object ball")
            .css({
                "background": "black",
            })
            .data("speed", {
                x: -2,
                y: -2
            })
        conteiner.append(ball);

        startAnimate(ball);
    }

    function startAnimate(ball) {
        let gameActive = true;
        
        function animate() {
            if (!gameActive) return; // останавливаем анимацию
            
            move(ball);
            checkCollision(ball);
            
            // Если game over, останавливаем анимацию
            if (gameOver(ball)) {
                gameActive = false;
                getSound("blinking");
                return;
            }
            
            requestAnimationFrame(animate);
        }
        animate();
    }

    function move(ball) {
        
        const ballDiametr = ball.outerWidth();

        let left = parseInt(ball.css("left")) || 0;
        let top = parseInt(ball.css("top")) || 0;

        let speed = ball.data("speed");

        left += speed.x;
        top += speed.y;

        if (left <= 0 || left + ballDiametr >= conteinerWidth) {
            speed.x = -speed.x;
            left = Math.max(0, Math.min(left, conteinerWidth - ballDiametr));
            getSound("rebound");
        }

        if (top <= 0 || top + ballDiametr >= ConteinerHeight) {
            speed.y = -speed.y;
            top = Math.max(0, Math.min(top, ConteinerHeight - ballDiametr));
            getSound("rebound");
        }

        ball.css({
            "left": left+"px",
            "top": top+"px"
        })

        ball.data("speed", speed);
    }

    function checkCollision(ball) {
        const shape1 = {
            left : parseInt(ball.css("left")),
            top : parseInt(ball.css("top")),
            right : parseInt(ball.css("left")) + ball.outerWidth(),
            bottom : parseInt(ball.css("top")) + ball.outerHeight()
        }

        let platform = $("#platform");
        const plat = {
            left: parseInt(platform.css("left")),
            top: parseInt(platform.css("top")),
            right: parseInt(platform.css("left")) + platform.outerWidth(),
            bottom: parseInt(platform.css("top")) + platform.outerHeight()
        };

        if (isCollising(shape1, plat)) {
            handleCollision(ball, false);
        }

        $(".squares").each(function() {
            let square = ($(this));
            const shape2 = {
                left : parseInt(square.css("left")),
                top : parseInt(square.css("top")),
                right : parseInt(square.css("left")) + square.outerWidth(),
                bottom : parseInt(square.css("top")) + square.outerHeight()
            }

            if (isCollising(shape1, shape2)) {
                handleCollision(ball, true);
                defensCheck(square);
                updateCounter();
                return false;
            }
        }) 
    }
    
    function isCollising(shape1, shape2) {
        return !(
            shape1.right <= shape2.left ||   
            shape1.left >= shape2.right ||   
            shape1.bottom <= shape2.top ||  
            shape1.top >= shape2.bottom 
        );
    }

    function handleCollision(ball, fl) {
        
        let speed = ball.data("speed"); 
        speed.y = -speed.y;

        if (!fl) {
            getSound("rebound");
        } else {
            getSound("damage");
        }
        ball.data("speed", speed);
    }

    // Функции для класса Game;

    function getSound(soundId) {
        const sound = $("#" + soundId)[0];
        sound.currentTime = 0;
        sound.play();
    }

    function gameOver(ball) {
        const ballBottom = ball.offset().top + ball.outerHeight();
        const lineTop = $("#line").offset().top;
        
        if (ballBottom >= lineTop) {
            // Останавливаем мяч
            ball.addClass("ball-blink");
            let speed = ball.data("speed");
            speed.x = 0;
            speed.y = 0;
            ball.data("speed", speed);

            platformEnabled = false;
            // Запускаем таймер для завершения игры
            setTimeout(() => {
                ball.removeClass("ball-blink");
                conteiner.empty(); 
                $("#counter").remove();
                getSound("gameOver");
                conteiner.append("Game Over!<br>");
                conteiner.append("Счёт: " + count); 
            }, 3000);
            
            return true; 

        } else if (count == 75) {
            conteiner.empty(); 
            $("#counter").remove();
            conteiner.append("Победа!<br>"); 
            conteiner.append("Счёт: " + count); 
            return true;
        }
        return false;
    }
})

