//easyscroller from https://www.youtube.com/watch?v=8uIt9a2XBrw

var context, controller, rectangle, loop;

context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 180;
context.canvas.width = 320;

rectangle = {

  height:32,
  jumping:true,
  width:32,
  x:144, //center of canvas
  x_velocity:0,
  y:0,
  y_velocity:0

};

controller = {

  left:false,
  right:false,
  up:false,

  keyListener:function(event){
    var key_state = (event.type == "keydown")?true:false;

    switch(event.keyCode){

      case 37: //left key
        controller.left = key_state;
      break;
      case 38: //up key
        controller.up = key_state;
      break;
      case 39: //right key
        controller.right = key_state;
      break;
    }
  }
};

collision = function(ax,ay,aw,ah,bx,by,bw,bh)
{
    if(ax < bx+bw && ay <by+bh && bx <ax+aw && by<ay+ah){
      return true;
    }
    else {
      return false;
    }
};

//main game loop, actions you do per frame
loop = function() {
  //every frame, check to see if the person is going up and not jumping to return them to the ground
  if (controller.up && rectangle.jumping ==false){

    rectangle.y_velocity -=20;
    rectangle.jumping = true;
  }

  //if they are pushing left, set x movement to negative
  if(controller.left){
    rectangle.x_velocity -=0.5;
  }

  //if they are pushing right arrowkey, set x movement to positive
  if(controller.right){
    rectangle.x_velocity += 0.5;
  }




  //if rectangle is going off the left of the screen, collision detection
  if(rectangle.x < -32){
    rectangle.x = 320;
  }
  //if rectangle goes past right side of screen
  else if (rectangle.x >320) {
    rectangle.x = -32;
  }

  //collision detection with white box

  if(collision(rectangle.x, rectangle.y, rectangle.height, rectangle.width,
                200, (164-32), 32, 32)){
      //first, check to see if it cleared the white box in the y axis
      if(rectangle.y < 164-32){
        rectangle.jumping = false;
        rectangle.y = 164-32-32-4;
        rectangle.y_velocity = 0;
      }
      else{

        //if halfway across white box, move to other side of white box
        if (rectangle.x < 200+16){
          rectangle.x = 200-rectangle.width;
          rectangle.x_velocity = 0;
        }
        else{
          rectangle.x = 200+rectangle.width;
          rectangle.x_velocity = 0;
        }
    }
  };

  rectangle.y_velocity += 1.5; //gravity
  rectangle.x += rectangle.x_velocity; //implement changes in position
  rectangle.y += rectangle.y_velocity;
  rectangle.x_velocity *= 0.9; //friction
  rectangle.y_velocity *= 0.9;

  //if rectangle is fallign below floor line. Do this last so that it can never fall through floor
  if(rectangle.y >180-16-32){
    rectangle.jumping = false;
    rectangle.y = 180 -16-32;
    rectangle.y_velocity = 0;
  }

  context.fillStyle = "#202020";
  context.fillRect(0,0,context.canvas.width, context.canvas.height); //x, y, width, height
  context.fillStyle = "#ff0000"; //hex for red
  context.beginPath();
  context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height); //draw the rectangle where you are at
  context.fill();

  //adding static box
  context.fillStyle = "#ffffff"; //hex for white
  context.beginPath();
  context.rect(200, (164-32), 32, 32); //draw the rectangle where you are at
  context.fill();

  context.strokeStyle="#202830";
  context.lineWidth =4;
  context.beginPath();
  context.moveTo(0,164); //draws a line across bottom of screne
  context.lineTo(320,164);
  context.stroke();

  //call update when the browser is ready to draw again
  //recursive, calls itself to keep loop going
  window.requestAnimationFrame(loop);

};

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);
