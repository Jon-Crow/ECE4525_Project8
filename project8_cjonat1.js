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
	
	var backgroundColour = color(255, 255, 255);
	var nodeColour       = color(40, 168, 107);
	var edgeColour       = color(34, 68, 204);
	var nodeSize         = 8;
	var degToRad         = Math.PI/180;

	var createCuboid = function(x, y, z, w, h, d)
	{
		var nodes = [[x,   y,   z  ], //0
					[x,   y,   z+d],  //1
					[x,   y+h, z  ],  //2
					[x,   y+h, z+d],  //3
					[x+w, y,   z  ],  //4
					[x+w, y,   z+d],  //5
					[x+w, y+h, z  ],  //6
					[x+w, y+h, z+d]]; //7
		var edges = [[0, 1], [1, 3], [3, 2], [2, 0],
					[4, 5], [5, 7], [7, 6], [6, 4],
					[0, 4], [1, 5], [2, 6], [3, 7]];
		var faces = [[0,2,6,4],[0,1,3,2],[0,1,5,4]];
		return { 'nodes': nodes, 'edges': edges, 'faces' : faces };
	};

	var createChair = function(x, y, z)
	{
		var shapes = [];
		shapes.push(createCuboid(x-100,y-150,z,25,325,25));
		shapes.push(createCuboid(x+75,y-150,z,25,325,25));
		shapes.push(createCuboid(x-75,y-125,z,150,150,25));
		shapes.push(createCuboid(x-100,y+50,z+25,200,25,-200));
		shapes.push(createCuboid(x-100,y+75,z-175,25,100,25));
		shapes.push(createCuboid(x+75,y+75,z-175,25,100,25));
		return shapes;
	};
	
	var shapes = createChair(0, 0, 0);

	// Rotate shape around the z-axis
	var rotateZ3D = function(theta, nodes) 
	{
		var sinTheta = sin(theta*degToRad);
		var cosTheta = cos(theta*degToRad);

		for (var n = 0; n < nodes.length; n++) 
		{
			var node = nodes[n];
			var x = node[0];
			var y = node[1];
			node[0] = x * cosTheta - y * sinTheta;
			node[1] = y * cosTheta + x * sinTheta;
		}
	};

	var rotateY3D = function(theta, nodes) 
	{
		var sinTheta = sin(theta*degToRad);
		var cosTheta = cos(theta*degToRad);

		for (var n = 0; n < nodes.length; n++) 
		{
			var node = nodes[n];
			var x = node[0];
			var z = node[2];
			node[0] = x * cosTheta - z * sinTheta;
			node[2] = z * cosTheta + x * sinTheta;
		}
	};

	var rotateX3D = function(theta, nodes) 
	{
		var sinTheta = sin(theta*degToRad);
		var cosTheta = cos(theta*degToRad);

		for (var n = 0; n < nodes.length; n++) 
		{
			var node = nodes[n];
			var y = node[1];
			var z = node[2];
			node[1] = y * cosTheta - z * sinTheta;
			node[2] = z * cosTheta + y * sinTheta;
		}
	};

	//rotateZ3D(30);
	//rotateY3D(30);
	//rotateX3D(30);
	var shouldPrint = true; 
	
	var draw = function() 
	{
		background(backgroundColour);
		var nodes, edges;

		// Draw edges
		stroke(edgeColour);
		fill(255,0,0);

		for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) 
		{
			nodes = shapes[shapeNum].nodes;
			edges = shapes[shapeNum].edges;
			faces = shapes[shapeNum].faces;
			beginShape();
			for(var f = 0; f < faces.length; f++)
			{
				var face = faces[f];
				for(var n = 0; n < face.length; n++)
					vertex(nodes[face[n]][0],nodes[face[n]][1]);
			}
			endShape();
			/*
			for (var e = 0; e < edges.length; e++) 
			{
				var n0 = edges[e][0];
				var n1 = edges[e][1];
				var node0 = nodes[n0];
				var node1 = nodes[n1];
				line(node0[0], node0[1], node1[0], node1[1]);
			}   
			*/
		}

		// Draw nodes
		fill(nodeColour);
		noStroke();
		for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) 
		{
			nodes = shapes[shapeNum].nodes;
			for (var n = 0; n < nodes.length; n++) 
			{
				var node = nodes[n];
				ellipse(node[0], node[1], nodeSize, nodeSize);
			}
		}
	};

	mouseDragged = function() 
	{
		var dx = mouseX - pmouseX;
		var dy = mouseY - pmouseY;

		for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) 
		{
			var nodes = shapes[shapeNum].nodes;
			rotateY3D(dx, nodes);
			rotateX3D(dy, nodes);
		}
	};

	translate(200, 200);


}};