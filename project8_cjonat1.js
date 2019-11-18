var sketchProc = function(processingInstance) 
{
 with (processingInstance) 
 {
	/*
	*/
	//Author:          Jonathan Crow
	//PID:             cjonat1
	//Completion Date: 09/27/2019
	//Assignment:      Project 4
	frameRate(60);
	size(400,400);
	
	/*-------------------------
	Degree to radian conversion
	constants
	-------------------------*/
	var deg0     = 0;
	var deg90    = Math.PI/2;
	var deg180   = Math.PI;
	var deg270   = 3*Math.PI/2;
	var deg360   = 2*Math.PI;
	var degToRad = Math.PI/180;
	
	var keyArray = [];
	
	var keyPressed = function() 
	{
		keyArray[keyCode] = 1;
	};
	var keyReleased = function() 
	{
		keyArray[keyCode] = 0;
	};
	var mouseReleased = function()
	{
		gameState.clickEvent(mouseX, mouseY);
	};
	
	var imgs      = [];
	var imgWall   = 0;
	var imgGround = 1;
	var imgPlayer = 2;
	
	var initImages = function()
	{
		imgs[imgWall]   = loadImage("img/wall.png");
		imgs[imgGround] = loadImage("img/ground.png");
		imgs[imgPlayer] = loadImage("img/player.png");
	};
	
	initImages();
	
	var tileMap = [
	"wwwwwwwwwwwwwwwwwwww",
	"w                  w",
	"wwwwwwww     wwwwwww",
	"w                  w",
	"w  wwwwwwwwwwwwww  w",
	"w                  w",
	"w wwwww wwwww wwww w",
	"w w              w w",
	"w w              w w",
	"w w   wwwwwwww   w w",
	"w w   wwwwwwww   w w",
	"w w              w w",
	"w w              w w",
	"w wwwwww     wwwww w",
	"w                  w",
	"w  wwwwwwwwwwwwww  w",
	"w                  w",
	"wwwwwww wwwww wwwwww",
	"w                  w",
	"wwwwwwwwwwwwwwwwwwww"
	];
	
	//HALF PAGE RESPONSE ON OPHELIAS DEATH!
	
	var TileMap = function(tileMap)
	{
		this.imgs = [];
		this.vecs = [];
		for(var y = 0; y < tileMap.length; y++)
		{
			var row = [];
			for(var x = 0; x < tileMap[y].length; x++)
			{
				if(tileMap[y][x] == "w")
					row.push(imgWall);
				else if(tileMap[y][x] == " ")
					row.push(imgGround);
				else
					console.log("ERROR LOADING TILEMAP: Unknown tile: " + tileMap[y][x]);
			}
			this.imgs.push(row);
		}
		for(var y = 0; y < this.imgs.length; y++)
		{
			var vecRow = [];
			for(var x = 0; x < this.imgs[y].length; x++)
			{
				var vecCon = [];
				if(this.imgs[y][x] === imgGround)
				{
					if(y > 0 && this.imgs[y-1][x] === imgGround)
						vecCon.push(new PVector(x*20+10,(y-1)*20+10));
					if(y < this.imgs.length-1 && this.imgs[y+1][x] === imgGround)
						vecCon.push(new PVector(x*20+10,(y+1)*20+10));
					if(x > 0 && this.imgs[y][x-1] === imgGround)
						vecCon.push(new PVector((x-1)*20+10,y*20+10));
					if(x < this.imgs[y].length-1 && this.imgs[y][x+1] === imgGround)
						vecCon.push(new PVector((x+1)*20+10,y*20+10));
				}
				vecRow.push(vecCon);
			}
			this.vecs.push(vecRow);
		}
	};
	TileMap.prototype.display = function()
	{
		for(var y = 0; y < this.imgs.length; y++)
			for(var x = 0; x < this.imgs[y].length; x++)
				image(imgs[this.imgs[y][x]],x*20,y*20);
		
		stroke(0,0,0);
		for(var y = 0; y < this.vecs.length; y++)
			for(var x = 0; x < this.vecs[y].length; x++)
				for(var z = 0; z < this.vecs[y][x].length; z++)
					line(x*20+10,y*20+10,this.vecs[y][x][z].x,this.vecs[y][x][z].y);
		noStroke();
		
	};
	TileMap.prototype.getPathConnections = function(x, y)
	{
	};
	
	var PathNode = function(x, y, par)
	{
		this.x   = x;
		this.y   = y;
		this.par = par;
		this.f   = -1;
	};
	PathNode.prototype.getX      = function() { return this.x;   };
	PathNode.prototype.getY      = function() { return this.y;   };
	PathNode.prototype.getParent = function() { return this.par; };
	PathNode.prototype.getF = function(start, end) 
	{
		if(this.f === -1)
		{
			var g  = dist(x,y,start.getX(),start.getY());
			var h  = dist(x,y,end.getX(),end.getY());
			this.f = g+h;
		}
		return this.f;
	};
	PathNode.prototype.equals = function(node)
	{
		return this.x === node.getX() && this.y === node.getY();
	};
	
	var getPath = function(x1, y1, x2, y2, map)
	{
		var start        = new PathNode(x1, y1, null);
		var end          = new PathNode(x2, y2, null);
		var nodes_open   = [start];
		var nodes_closed = [];
		
		while(nodes_open.length > 0)
		{
			var minF    = nodes_open[0];
			var minF_in = 0;
			for(var i = 1; i < nodes_open.length; i++)
			{
				if(nodes_open[i].getF() < minF.getF())
				{
					minF    = nodes_open[i];
					minF_in = i;
				}
			}
			nodes_open.splice(i,1);
			nodes_closed.push(minF);
			if(minF.equals(end))
			{
				var path = [];
				var step = minF;
				while(step !== null)
				{
					path.push(step);
					step = step.getParent();
				}
				return path.reverse();
			}
			
		}
	};
	
	var Player = function(x, y)
	{
		this.pos = new PVector(x, y);
	};
	Player.prototype.display = function()
	{
		image(imgs[imgPlayer],this.pos.x-10,this.pos.y-10,20,20);
	};
	Player.prototype.update = function()
	{};
	
	var MenuGameState = function()
	{
		this.tileMap = new TileMap(tileMap);
		this.plyr    = new Player(30,30);
	};
	MenuGameState.prototype.display = function()
	{
		background(255,0,0);
		this.tileMap.display();
		this.plyr.display();
	};
	MenuGameState.prototype.update = function()
	{
		this.plyr.update();
	};
	MenuGameState.prototype.getNextState = function()
	{
		return this;
	};
	MenuGameState.prototype.clickEvent = function(x, y)
	{};
	
	var gameState = new MenuGameState();
	
	var showFPS  = 1;
	var lastTime = 0;
	
	draw = function() 
	{
		gameState.update();
		gameState.display();
		gameState = gameState.getNextState();
		
		//calculates fps
		var time = millis();
		var fps = 1000/(time-lastTime);
		lastTime = time;
		
		fill(0,0,0);
		if(showFPS)
		{
			textSize(10);
			text("FPS: " + fps.toFixed(2), width-50, height-10);
			if(fps < 50)
				console.log("fps dropped to: " + fps);
		}
	};
}};