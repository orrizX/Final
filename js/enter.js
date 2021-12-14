var illoElem = document.querySelector('.illo');
var sceneSize = 96;
var TAU = Zdog.TAU;
var ROOT3 = Math.sqrt(3);
var ROOT5 = Math.sqrt(5);
var PHI = ( 1 + ROOT5 ) / 2;
var isSpinning = true;
var viewRotation = new Zdog.Vector();
var displaySize;

// colors
var eggplant = 'rgb(155, 240, 255)';
var garnet = 'rgb(155, 165, 255)';
var orange = 'rgb(255, 155, 155)';
var gold = 'rgb(255, 155, 217)';
var yellow = 'rgb(218, 155, 255)';


var illo = new Zdog.Illustration({
  element: illoElem,
  scale: 8,
  resize: 'fullscreen',
  onResize: function( width, height ) {
    displaySize = Math.min( width, height );
    this.zoom = Math.floor( displaySize / sceneSize );
  },
});

var solids = [];

// ----- hourglass ----- //

( function() {

  var hourglass = new Zdog.Anchor({
    addTo: illo,
    translate: { x: 0, y: -4 },
  });

  solids.push( hourglass );

  var hemi = new Zdog.Hemisphere({
    diameter: 2,
    translate: { z: -1 },
    addTo: hourglass,
    color: yellow,
    backface: garnet,
    stroke: false,
  });

  hemi.copy({
    translate: { z: 1 },
    rotate: { y: TAU/2 },
    color: orange,
    backface: gold,
  });

})();

// ----- hourglass ----- //

( function() {

    var hourglass = new Zdog.Anchor({
      addTo: illo,
      translate: { x: 0, y: 4 },
    });
  
    solids.push( hourglass );
  
    var hemi = new Zdog.Hemisphere({
      diameter: 2,
      translate: { z: -1 },
      addTo: hourglass,
      color: garnet,
      backface: orange,
      stroke: false,
    });
  
    hemi.copy({
      translate: { z: 1 },
      rotate: { y: TAU/2 },
      color: eggplant,
      backface: gold,
    });
  
  })();

// ----- sphere ----- //

( function() {

  var sphere = new Zdog.Anchor({
    addTo: illo,
    translate: { x: -4, y: -4 },
  });

  solids.push( sphere );

  var hemi = new Zdog.Hemisphere({
    diameter: 2,
    addTo: sphere,
    color: gold,
    backface: eggplant,
    stroke: false,
  });

  hemi.copy({
    rotate: { y: TAU/2 },
    color: eggplant,
    backface: orange,
  });

})();

// ----- cylinder ----- //

var cylinder = new Zdog.Cylinder({
  diameter: 2,
  length: 2,
  addTo: illo,
  translate: { x: 4, y: -4 },
  // rotate: { x: TAU/4 },
  color: garnet,
  backface: gold,
  stroke: false,
});

solids.push( cylinder );


// ----- cylinder ----- //

var cylinder = new Zdog.Cylinder({
    diameter: 2,
    length: 2,
    addTo: illo,
    translate: { x: -4, y: 4 },
    // rotate: { x: TAU/4 },
    color: orange,
    backface: gold,
    stroke: false,
  });
  
  solids.push( cylinder );

// ----- cone ----- //

var cone = new Zdog.Anchor({
  addTo: illo,
  translate: { x: -4, y: 0 },
});

solids.push( cone );

new Zdog.Cone({
  diameter: 2,
  length: 2,
  addTo: cone,
  translate: { z: 1 },
  rotate: { y: TAU/2 },
  color: garnet,
  backface: gold,
  stroke: false,
});
// ----- cone ----- //

var cone = new Zdog.Anchor({
    addTo: illo,
    translate: { x: 4, y: 0 },
  });
  
  solids.push( cone );
  
  new Zdog.Cone({
    diameter: 2,
    length: 2,
    addTo: cone,
    translate: { z: 1 },
    rotate: { y: TAU/2 },
    color: garnet,
    backface: gold,
    stroke: false,
  });
// ----- tetrahedron ----- //

( function() {

  var tetrahedron = new Zdog.Anchor({
    addTo: illo,
    translate: { x: 0, y: 0 },
    scale: 2.5,
  });

  var radius = 0.5;
  var inradius = Math.cos( TAU/6 ) * radius;
  var height = radius + inradius;

  solids.push( tetrahedron );

  var triangle = new Zdog.Polygon({
    sides: 3,
    radius: radius,
    addTo: tetrahedron,
    translate: { y: height/2 },
    fill: true,
    stroke: false,
    color: yellow,
    // backface: false,
  });


  for ( var i=0; i < 3; i++ ) {
    var rotor1 = new Zdog.Anchor({
      addTo: tetrahedron,
      rotate: { y: TAU/3 * -i },
    });
    var rotor2 = new Zdog.Anchor({
      addTo: rotor1,
      translate: { z: inradius, y: height/2 },
      rotate: { x: Math.acos(1/3) * -1 + TAU/4  },
    });
    triangle.copy({
      addTo: rotor2,
      translate: { y: -inradius },
      color: [ eggplant, garnet, orange ][i],
    });
  }

  triangle.rotate.set({ x: -TAU/4, z: -TAU/2 });

})();

// ----- sphere ----- //

( function() {

    var sphere = new Zdog.Anchor({
      addTo: illo,
      translate: { x: 4, y: 4 },
    });
  
    solids.push( sphere );
  
    var hemi = new Zdog.Hemisphere({
      diameter: 2,
      addTo: sphere,
      color: gold,
      backface: eggplant,
      stroke: false,
    });
  
    hemi.copy({
      rotate: { y: TAU/2 },
      color: yellow,
      backface: orange,
    });
  
  })();


// -- animate --- //

var keyframes = [
  { x:   0, y:   0 },
  { x:   0, y: TAU },
  { x: TAU, y: TAU },
];

var ticker = 0;
var cycleCount = 180;
var turnLimit = keyframes.length - 1;

function animate() {
  update();
  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();

function update() {

  if ( isSpinning ) {
    var progress = ticker / cycleCount;
    var tween = Zdog.easeInOut( progress % 1, 4 );
    var turn = Math.floor( progress % turnLimit );
    var keyA = keyframes[ turn ];
    var keyB = keyframes[ turn + 1 ];
    viewRotation.x = Zdog.lerp( keyA.x, keyB.x, tween );
    viewRotation.y = Zdog.lerp( keyA.y, keyB.y, tween );
    ticker++;
  }

  solids.forEach( function( solid ) {
    solid.rotate.set( viewRotation );
  });

  illo.updateGraph();
}

// ----- inputs ----- //

var dragStartRX, dragStartRY;

new Zdog.Dragger({
  startElement: illoElem,
  onDragStart: function() {
    isSpinning = false;
    dragStartRX = viewRotation.x;
    dragStartRY = viewRotation.y;
  },
  onDragMove: function( pointer, moveX, moveY ) {
    viewRotation.x = dragStartRX - ( moveY / displaySize * TAU );
    viewRotation.y = dragStartRY - ( moveX / displaySize * TAU );
  },
});
