// Сырой вариант! Комментарии и необходимые улучшения добавлю на след. неделе
$(document).ready(function() {

    let conteiner = $("#main-conteiner");
    const conteinerWidth = conteiner.width();
    const ConteinerHeight = conteiner.height();
    let count = 0;

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
            .css({
                "width": conteinerWidth+ "px",
                "height": "5px",
                "position": "relative",
                "background": "red",
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

    function createShapes() {
        const width = 40, height = 40;
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 25; i++) {
                let color = getColor();
                let circle = $("<div>")
                    .attr("id", "cir" + j + i)
                    .addClass("circles")
                    .css({
                        "width": width + "px",
                        "height": height + "px",
                        "border-radius": "50%",
                        "background": color,
                        "position": "absolute",
                        "top": j*height + "px", 
                        "left": i*width + "px",
                    })
                conteiner.append(circle);
            }
        }
    }
    
    function getColor() {
        if(Math.random() < 0.9) {
            console.log("purple");
            return "purple";
        } else {
            return "red";
        }
    }

    function createPlatform() {
        let width = 150, height = 10;
        let platform = $("<div>")
            .attr("id", "platform")
            .css({
                "width": width + "px",
                "height": height + "px",
                "background": "blue",
                "position": "absolute",
                "bottom": "10px", 
                "left": "50%"
            })
        conteiner.append(platform);

        let posX = parseInt($("#platform").css("left"));
        
        $(document).keydown(function(e) {
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

    function createBall() {
        let width = 40, height = 40;
        let ball = $("<div>")
            .attr("id", "ball")
            .css({
                "width": width + "px",
                "height": height + "px",
                "border-radius": "50%",
                "background": "black",
                "position": "absolute",
                "bottom": "20px",
                "left" : "550px"
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
        }

        if (top <= 0 || top + ballDiametr >= ConteinerHeight) {
            speed.y = -speed.y;
            top = Math.max(0, Math.min(top, ConteinerHeight - ballDiametr));
        }

        ball.css({
            "left": left+"px",
            "top": top+"px"
        })

        ball.data("speed", speed);
    }

    function checkCollision(ball) {
        let isCircle = false;
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
            handleCollision(ball, isCircle);
        }

        $(".circles").each(function() {
            isCircle = true;
            let circle = ($(this));
            const shape2 = {
                left : parseInt(circle.css("left")) || 0,
                top : parseInt(circle.css("top")) || 0,
                right : parseInt(circle.css("left")) || 0 + circle.outerWidth(),
                bottom : parseInt(circle.css("top")) || 0 + circle.outerHeight()
            }

            if (isCollising(shape1, shape2)) {
                handleCollision(ball, isCircle);
                updateCounter();
                circle.remove();
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

    function handleCollision(ball, isCircle) {
        let speed = ball.data("speed"); 
 
        speed.y = -speed.y;
        if (isCircle) {
            count++;
            speed.x = -speed.x;
        }

        ball.data("speed", speed);
    }

    function gameOver(ball) {
        // Получаем абсолютные координаты относительно документа
        const ballBottom = ball.offset().top + ball.outerHeight();
        const lineTop = $("#line").offset().top;
        
        if (ballBottom >= lineTop) {
            conteiner.empty(); 
            conteiner.append("Game Over!");
            return true;
        }
        return false;
    }
})