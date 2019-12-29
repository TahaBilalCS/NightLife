import { Component, OnInit } from "@angular/core";

import { UserService, AuthService } from "../_services";
import { User } from "../_models/user";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";

// Setting global variables, not the most efficient but works in creating the functionality I need
declare global {
  interface Window {
    canvas: HTMLCanvasElement;
    ctx: any;
    player: any;
    mousePosition: any;
    enemies: any;
    isPlaying: any;
    lose: any;
    enemyTime: any;
    lastIteration: any;
    animation: any;
    timer: any;
    reloaded: number;
    clickCount: any;
    scrollIndex: any;
    difficulty: any;
    start(): void;
  }
}
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  userRole = "";
  currentUser: User;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser.subscribe(x => (this.currentUser = x));

    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  ngOnInit() {
    // This is the canvas object
    window.canvas = document.getElementById("reflex-io") as HTMLCanvasElement;

    // Context taken from canvas
    window.ctx = window.canvas.getContext("2d");

    // Set the size of game window according to size of open window
    this.setCanvasSize();

    // Start player in middle of canvas
    window.player = [window.canvas.width / 2, window.canvas.height / 2];

    // Player heads in direction of mousePosition, set equal to player initial position
    window.mousePosition = {
      x: window.player[0],
      y: window.player[1]
    };

    // Default difficulty set to hard as most players want to quickly get back into the challenge
    window.difficulty = {
      amount: 1,
      speed: 200,
      name: "Hard"
    };

    // Initialize list where we store our enemies
    window.enemies = [];
    window.lose = window.isPlaying = false;

    (window.enemyTime = window.lastIteration = window.animation = window.timer = window.clickCount = 0),
      (window.scrollIndex = 2); // 2 is default Hard difficulty index
    // Update the game with given fps, default we do 144fps
    var game = this.controlFps(144, e => {
      this.drawStats();

      // We calculate the time elapsed from each frame to the next to ensure the right player and enemy speed
      var elapsed = e.time - window.lastIteration;
      window.lastIteration = e.time;
      // Every loop we will move the player and enemies according to the desired fps with elapsed time during a loop
      this.movePlayer(elapsed);
      this.renderPlayer();
      this.moveEnemies(elapsed);
      this.renderEnemies();
    });

    this.wait();

    //game.start();

    //Get mouse position on right click and set it to the location you want to head towards
    window.canvas.addEventListener(
      "contextmenu",
      mouse => {
        if (window.isPlaying) {
          window.mousePosition.x = this.getMousePos(window.canvas, mouse).x;
          window.mousePosition.y = this.getMousePos(window.canvas, mouse).y;
        }
      },
      false
    );
  }

  // We try to account for our calculations for time taken to compute next frame using delta time
  // Source: https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
  controlFps(fps, callback) {
    var frameRate = 1000 / fps,
      time = null,
      currentFrame = -1;

    function loop(milliseconds) {
      if (time === null) time = milliseconds; // Intial time
      var segment = Math.floor((milliseconds - time) / frameRate); // This is the n-th frame

      // If we moved to next frame then update
      if (segment > currentFrame) {
        currentFrame = segment;
        callback({
          time: milliseconds
        });
      }
      if (window.isPlaying) {
        window.animation = window.requestAnimationFrame(loop);
      }
    }
    // Start the game loop
    window.start = function() {
      if (window.isPlaying) {
        window.animation = window.requestAnimationFrame(loop);
      }
    };
  }

  // Start game is middle mouse button pressed or S pressed
  playerStart(event) {
    // 0 is left click, 1 is middle click, 2 is right click
    if (
      (event.button == 1 || event.key == "s") &&
      !window.isPlaying &&
      !window.lose
    ) {
      window.isPlaying = true;
      // Start timers for player and enemies
      setInterval(function() {
        window.timer++;
      }, 1000);
      setInterval(function() {
        window.enemyTime++;
      }, 100);

      //Start the game
      window.start();

      //Increment click count by 1 for each right click
      document.addEventListener("contextmenu", function(event) {
        if (window.isPlaying) {
          window.clickCount += 1;
        }
      });
    }
  }
  // Wait for player to change settings before starting the game
  wait() {
    //Draw player and stats and redraw if difficulty changes
    this.drawStats();
    this.renderPlayer();
    window.addEventListener("wheel", event => {
      // Make sure to not increment scroll index if it reaches max or lowest difficulty
      if (
        event.deltaY < 0 &&
        window.difficulty.name !== "Hard" &&
        !window.isPlaying &&
        !window.lose
      ) {
        window.scrollIndex += 1;
        this.scrollDifficulty(window.scrollIndex);
        this.drawStats();
        this.renderPlayer();
        //console.log("scrolling up");
      } else if (
        event.deltaY > 0 &&
        window.difficulty.name !== "Easy" &&
        !window.isPlaying &&
        !window.lose
      ) {
        window.scrollIndex -= 1;
        this.scrollDifficulty(window.scrollIndex);
        this.drawStats();
        this.renderPlayer();
        //console.log("scrolling down");
      }
    });

    // Change difficulty if button is pressed
    document.getElementById("easy").onclick = () => {
      window.scrollIndex = 0;
      this.setDifficulty("Easy");
      this.drawStats();
      this.renderPlayer();
    };
    document.getElementById("medium").onclick = () => {
      window.scrollIndex = 1;
      this.setDifficulty("Medium");
      this.drawStats();
      this.renderPlayer();
    };
    document.getElementById("hard").onclick = () => {
      window.scrollIndex = 2;
      this.setDifficulty("Hard");
      this.drawStats();
      this.renderPlayer();
    };
    // Wait for player to start game
    document.addEventListener("mousedown", this.playerStart);
    document.addEventListener("keypress", this.playerStart);
  }

  //Get the mouse position on the canvas
  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = evt.clientX - rect.left;
    var mouseY = evt.clientY - rect.top;
    return {
      x: mouseX,
      y: mouseY
    };
  }
  /*
  scrollDifficulty((window.scrollIndex) => {

});
*/
  //Changes canvas size to a fixed amount
  setCanvasSize() {
    window.canvas.width = 600;
    window.canvas.height = 600;
  }
  // Lower amount value means more enemies spawn, lower speed means lower enemy speed
  scrollDifficulty(scroll) {
    // Change difficulty if mouse wheel scrolls
    switch (scroll) {
      case 0:
        this.setDifficulty("Easy");
        break;

      case 1:
        this.setDifficulty("Medium");
        break;

      case 2:
        this.setDifficulty("Hard");
        break;
    }
  }

  // Render the player on the canvas
  renderPlayer() {
    window.ctx.save();
    window.ctx.beginPath();
    window.ctx.translate(window.player[0], window.player[1]);
    window.ctx.arc(0, 0, 10, 0, 2 * Math.PI);
    window.ctx.fillStyle = "blue";
    window.ctx.fill();
    window.ctx.stroke();
    window.ctx.restore();
  }

  //Calculate the move speed of player and change their position according to the location clicked on
  movePlayer(time) {
    var points = this.getAngleAndDistance(
      window.player[0],
      window.player[1],
      window.mousePosition.x,
      window.mousePosition.y
    );
    var velocity = 300;

    // Millisecond to second conversion
    var elapsedSeconds = time / 1000;

    // Find vector given velocity and angle between player and enemy
    var toMouseVector = this.getVector(velocity, points.angle);

    // If the player is more than 5 pixels away from where we clicked, then move the player
    if (points.distance > 5) {
      window.player[0] += toMouseVector.magnitudeX * elapsedSeconds;
      window.player[1] += toMouseVector.magnitudeY * elapsedSeconds;
    }
  }

  // We draw each enemy at a random edge and push the enemy to the list
  renderEnemies() {
    var randomStartX = 0;
    var randomStartY = 0;

    // Pick a random edge out of the 4 options
    var rand = Math.floor(Math.random() * 4);

    // Set the coordinate for an enemy based on which edge they spawn in
    switch (rand) {
      case 0:
        randomStartX = Math.floor(Math.random() * window.canvas.width);
        randomStartY = 0;
        break;
      case 1:
        randomStartX = 0;
        randomStartY = Math.floor(Math.random() * window.canvas.height);
        break;

      case 2:
        randomStartX = window.canvas.width;
        randomStartY = Math.floor(Math.random() * window.canvas.height);
        break;

      case 3:
        randomStartX = Math.floor(Math.random() * window.canvas.width);
        randomStartY = window.canvas.height;
        break;
    }

    // Depending on the difficulty, we spawn enemies each time we over a time threshold. Ex: Spawn enemy every second / every 5 seconds
    if (window.enemyTime > window.difficulty.amount) {
      window.enemyTime = 0;
      window.enemies.push({
        x: randomStartX,
        y: randomStartY,
        edge: rand,
        tempX: randomStartX,
        tempY: randomStartY
      });
    }

    // To prevent the enemy list from growing too large, we remove from the beginning to free up memory
    if (window.enemies.length == 60) {
      window.enemies.splice(0, 20);
    }
  }

  // Move enemies according to time frame interval and which edge they spawn in
  moveEnemies(time) {
    // For each enemy we will update their location and speed according to each frame interval
    window.enemies.forEach(p => {
      // Millisecond to second conversion
      var elapsed = time / 1000;
      var speedX = window.difficulty.speed * elapsed;
      var speedY = window.difficulty.speed * elapsed;

      // 0 is top edge
      // 1 is left edge
      // 2 is right edge
      // 3 is bottom edge
      // Depending on which half of an edge an enemy spawns in, we change its' direction
      if (p.edge == 0) {
        if (p.tempX > window.canvas.width / 2) {
          p.x -= speedX;
          p.y += speedY;
        } else {
          p.x += speedX;
          p.y += speedY;
        }
      } else if (p.edge == 1) {
        if (p.tempY > window.canvas.height / 2) {
          p.x += speedX;
          p.y -= speedY;
        } else {
          p.x += speedX;
          p.y += speedY;
        }
      } else if (p.edge == 2) {
        if (p.tempY > window.canvas.height / 2) {
          p.x -= speedX;
          p.y -= speedY;
        } else {
          p.x -= speedX;
          p.y += speedY;
        }
      } else if (p.edge == 3) {
        if (p.tempX > window.canvas.width / 2) {
          p.x -= speedX;
          p.y -= speedY;
        } else {
          p.x += speedX;
          p.y -= speedY;
        }
      }

      // For each enemy we begin moving them in the direction they need to go until they are rendered again
      window.ctx.save();
      window.ctx.beginPath();
      window.ctx.translate(p.x, p.y);
      window.ctx.arc(0, 0, 10, 0, 2 * Math.PI);
      window.ctx.fillStyle = "red";
      window.ctx.fill();
      window.ctx.stroke();
      window.ctx.restore();
      // Calculate hitbox and end the game if player hits any enemy
      this.hitbox(p);
    });
  }

  // Calculate if player hits an enemy
  hitbox(p) {
    var dx = p.x - window.player[0];
    var dy = p.y - window.player[1];
    var distance = Math.sqrt(dx * dx + dy * dy);

    //Radius of player and enemies is 10, add them both together for collision
    if (distance < 20 && window.animation) {
      window.lose = true;
      window.isPlaying = false;
      // Stop animating the game
      cancelAnimationFrame(window.animation);

      // Record the score and current difficulty and add the highscore to database for current user
      var score =
        "Difficulty: " +
        window.difficulty.name +
        ", Time: " +
        window.timer.toString() +
        ", Click Count: " +
        window.clickCount;
      this.userService
        .addHighScore(this.currentUser, score)
        .pipe(first())
        .subscribe();
      // If game is over and we lost, allow the player to restart game with left click or pressing "R" on keyboard
      document.addEventListener("keypress", this.reload);
    }
  }

  // Reload function if "R" or left click is used
  reload(event) {
    if (event.key == "r" && !window.isPlaying && window.lose) {
      window.location.reload();
    }
  }
  // Clears the canvas and redraws player and stats when difficulty changes and game starts
  drawStats() {
    window.ctx.font = "20px sans-serif";
    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
    window.ctx.fillText(
      "Time: " + Math.floor(window.timer) + "      " + window.difficulty.name,
      4,
      20
    );
    window.ctx.fillText(
      "Click Count: " + window.clickCount,
      window.canvas.width - 150,
      20
    );
  }

  // Set the difficulty to desired amount
  setDifficulty(name) {
    window.difficulty.name = name;
    switch (name) {
      case "Easy":
        window.difficulty.amount = 3;
        window.difficulty.speed = 100;
        break;
      case "Medium":
        window.difficulty.amount = 2;
        window.difficulty.speed = 150;
        break;
      case "Hard":
        window.difficulty.amount = 1;
        window.difficulty.speed = 200;
        break;

      default:
        window.difficulty.name = "Hard";
        window.difficulty.amount = 1;
        window.difficulty.speed = 200;
    }
  }

  // Calculate vector given velocity and angle
  getVector(velocity, angle) {
    var angleRadians = (angle * Math.PI) / 180;
    return {
      magnitudeX: velocity * Math.cos(angleRadians),
      magnitudeY: velocity * Math.sin(angleRadians)
    };
  }

  // Get the distance and angle between two points
  getAngleAndDistance(x1, y1, x2, y2) {
    var deltaX = x2 - x1,
      deltaY = y2 - y1;

    //Pythagorean Theorem
    var pointDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    var radians = Math.atan2(deltaY, deltaX);
    var degrees = radians * (180 / Math.PI);

    return {
      distance: Math.round(pointDistance),
      angle: Math.round(degrees)
    };
  }
}
