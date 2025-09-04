// Сырой вариант! Комментарии и необходимые улучшения добавлю на след. неделе
$(document).ready(function() {

    let conteiner = $("#main-conteiner");

    $("#ready").on('click', function() {
        createShapes();
        createPlatform();
        createBall(); 
        $(this).remove();
    })

    function createShapes() {
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 25; i++) {
                let color = getColor();
                let circle = $("<div>")
                    .attr("id", "cir" + j + i)
                    .addClass("circles")
                    .css({
                        "width": "40px",
                        "height": "40px",
                        "border-radius": "50%",
                        "background": color,
                        "position": "absolute",
                        "top": j*40 + "px", 
                        "left": i*40 + "px",
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
        let platform = $("<div>")
            .attr("id", "platform")
            .css({
                "width": "150px",
                "height": "10px",
                "background": "blue",
                "position": "absolute",
                "bottom": "10px", 
                "left": "50%"
            })
        conteiner.append(platform);

        let posX = parseInt($("#platform").css("left"));
        
        $(document).keydown(function(e) {
            const step = 10;

            if(e.key === 'ArrowRight') posX += step;
            if(e.key === 'ArrowLeft') posX -= step;
            
            $("#platform").css({
                "left": posX + "px"
            })
        })
    }

    function createBall() {

        let ball = $("<div>")
            .attr("id", "ball")
            .css({
                "width": "50px",
                "height": "50px",
                "border-radius": "50%",
                "background": "black",
                "position": "absolute",
                "bottom": "20px",
                "left" : "550px"
            })
            .data("speed", {
                x: 4,
                y: 4
            })
        conteiner.append(ball);

        startAnimate(ball);
    }

    function startAnimate(ball) {
        function animate() {
            move(ball);
            checkCollision(ball);
            requestAnimationFrame(animate);
        }
        animate();
    }

    function move(ball) {
        
        const conteinerWidth = conteiner.width();
        const ConteinerHeight = conteiner.height();
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
    }

    function checkCollision(ball) {
        const shape1 = {
            left : parseInt(ball.css("left")),
            top : parseInt(ball.css("top")),
            right : parseInt(ball.css("left")) + ball.outerWidth(),
            bottom : parseInt(ball.css("top")) - ball.outerHeight(),
        }

        $(".circles").each(function() {
            const shape2 = {
                left : parseInt($(this).css("left")),
                top : parseInt($(this).css("top")),
                right : parseInt($(this).css("left")) + ball.outerWidth(),
                bottom : parseInt($(this).css("top")) - ball.outerHeight()
            }

            if (isCollising(shape1, shape2)) {
                handleCollision(ball, $(this));
            }
        })
    }
    
    function isCollising(shape1, shape2) {
        return !(shape1.left > shape2.right ||
            shape1.right < shape2.left ||
            shape1.top < shape2.bottom ||
            shape1.bottom > shape2. top
        )
    }

    function handleCollision(ball, circle) {

        speed = ball.data("speed"); 

        speed.x = - speed.x; 
        speed.y = - speed.y;

        ball.data("speed", speed);

        circle.remove();
    }
})