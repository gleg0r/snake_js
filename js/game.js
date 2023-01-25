

class Config {
    constructor() {
        this.step = 0;
        this.maxStep = 16;
        this.sizeCell= 16;
        this.sizeBerry = this.sizeCell / 4;
    }
}

class Canvas {
    constructor(container) {
        this.element = document.createElement("canvas");
        this.context = this.element.getContext("2d");

        this.element.width = 400;
        this.element.height = 400;

        container.appendChild(this.element)
    }
}

class GameLoop {
    constructor(update, draw) {
        this.update = update;
        this.draw = draw;

        this.config = new Config();

        this.animate = this.animate.bind(this);
        this.animate()
    }

    animate() {
        requestAnimationFrame(this.animate);
        if(++this.config.step < this.config.maxStep) {
            return;
        }
        this.config.step = 0;

        this.update();
        this.draw();
    }
}

class Score {
    constructor(scoreBlock, score = 0) {
        this.scoreBlock = document.querySelector(scoreBlock)
        this.maxBlock = document.querySelector(".max-count")
        this._score = score;

        this.draw();
    }

    increaseScore() {
        this._score++;
        this.draw();
    }

    refreshScore() {
        this._score = 0;
        this.draw()
    }

    maxScore() {
        if(localStorage.getItem("score") < this._score) {
            localStorage.setItem("score", this._score)
        }
    }

    draw() {
        this.scoreBlock.innerHTML = this._score;
        this.maxBlock.innerHTML = "Маскимальное значение:   " + localStorage.getItem("score")
    }
}

class Snake {
	constructor(){

		this.config = new Config();
		this.x = 160;
		this.y = 160;
		this.dx = this.config.sizeCell;
		this.dy = 0;
		this.tails = [];
		this.maxTails = 2;

		this.move();

	}

	update( apple, score, canvas ) {
		this.x += this.dx;
		this.y += this.dy;

        
	
		if (this.x < 0 || this.x >= canvas.element.width || this.y < 0 || this.y >= canvas.element.height) {
            this.death(score);
            score.refreshScore();
            apple.randomPosition();
		}
	
		this.tails.unshift( { x: this.x, y: this.y } );
	
		if ( this.tails.length > this.maxTails ) {
			this.tails.pop();
		}
	
		this.tails.forEach( (el, index) => {
	
			if ( el.x === apple.x && el.y === apple.y ) {
				this.maxTails++;
				score.increaseScore();
				apple.randomPosition();
			}
	
			for( let i = index + 1; i < this.tails.length; i++ ) {
	
				if ( el.x == this.tails[i].x && el.y == this.tails[i].y ) {
					this.death(score);
					score.refreshScore();
                    apple.randomPosition;
				}
	
			}
	
		} );

	}

	draw(context) {

		this.tails.forEach( (el, index) => {
			if (index == 0) {
				context.fillStyle = "#FA0556";
			} else {
				context.fillStyle = "#A00034";
			}
			context.fillRect( el.x, el.y, this.config.sizeCell, this.config.sizeCell );
		} );

	}

	death(score) {
        this.x = 160;
		this.y = 160;
		this.dx = this.config.sizeCell;
		this.dy = 0;
		this.tails = [];
		this.maxTails = 2;
        score.maxScore();
	}

	move() {
		
		document.addEventListener("keydown",  (e) => {
			if (e.code == "KeyW" && this.dy != this.config.sizeCell) {
				this.dy = -this.config.sizeCell;
				this.dx = 0;
			} else if (e.code == "KeyA" && this.dx != this.config.sizeCell) {
				this.dx = -this.config.sizeCell;
				this.dy = 0;
			} else if (e.code == "KeyS" && this.dy != -this.config.sizeCell) {
				this.dy = this.config.sizeCell;
				this.dx = 0;
			} else if (e.code == "KeyD" && this.dx != -this.config.sizeCell) {
				this.dx = this.config.sizeCell;
				this.dy = 0;    
			}
		});

	}
}

class Apple {
    constructor(canvas) {
        this.x = 0;
        this.y = 0;
        this.canvas = canvas;

        this.config = new Config();
        this.randomPosition();
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = "#A00034";
        context.arc(this.x + (this.config.sizeCell / 2), this.y + (this.config.sizeCell / 2), this.config.sizeBerry, 0, 2*Math.PI)
        context.fill();
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max-min) + min)
    }

    randomPosition() {
        this.x = this.randomInt(0, this.canvas.element.width / this.config.sizeCell) * this.config.sizeCell;
        this.y = this.randomInt(0, this.canvas.element.height / this.config.sizeCell) * this.config.sizeCell;
    }


}   

class Game {
    constructor(container) {
        this.canvas = new Canvas(container);
        new GameLoop(this.update.bind(this), this.draw.bind(this));
        this.snake = new Snake();
        this.apple = new Apple(this.canvas);
        this.score = new Score(".game-score .score-count", 0)

    }

    update() {
        this.snake.update(this.apple, this.score, this.canvas);
    }

    draw() {
        this.canvas.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);

        this.snake.draw(this.canvas.context);
        this.apple.draw(this.canvas.context);
    }
}

new Game(document.querySelector(".game-wrapper"))