if (typeof anomaly === "undefined")
{
    var anomaly = {};
}

anomaly.Core = function()
{
    this.toString = function()
    {
        return "anomaly.Core";
    }

    this.camera;
    this.scene;
    this.renderer;

    this.cube = new anomaly.SpinningCube();
    this.cubeThreeJsObject = this.cube.initialize();
    this.environment = new anomaly.Environment();
    this.environmentThreeJsObject = this.environment.initialize();
    this.environmentTarget = this.environment.target;
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;

    this.contador = 0; 

}

anomaly.Core.prototype.initialize = function()
{
    var self = this;

    this.camera = new THREE.PerspectiveCamera( 75, this.viewportWidth / this.viewportHeight, 1, 10000 );
    this.camera.position.z = 0;

    this.scene = new THREE.Scene();
    this.scene.matrixAutoUpdate = true;

    this.scene.add( self.cubeThreeJsObject );
    this.scene.add( self.environmentThreeJsObject );

    this.renderer = new THREE.CanvasRenderer();
    this.renderer.setSize( this.viewportWidth, this.viewportHeight );

    document.body.appendChild( self.renderer.domElement );

    document.addEventListener("keydown", this.onDocumentKeyDown.bind(window, self), false);

    document.addEventListener( "mousedown", this.onDocumentMouseDown.bind(window, self), false );
    document.addEventListener( "mousemove", this.onDocumentMouseMove.bind(window, self), false );
    document.addEventListener( "mouseup", this.onDocumentMouseUp.bind(window, self), false );
    document.addEventListener( "mousewheel", this.onDocumentMouseWheel.bind(window, self), false );

    document.addEventListener( "touchstart", this.onDocumentTouchStart.bind(window, self), false );
    document.addEventListener( "touchmove", this.onDocumentTouchMove.bind(window, self), false );

    window.addEventListener( 'resize', this.onWindowResize.bind(window, self), false );

}

anomaly.Core.prototype.loop = function()
{
    var self = this;
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( this.loop.bind(this) );  

    this.contador += 0.1

    var levitation = Math.sin(this.contador);

    //console.log("levitation: " + levitation + ", position y: " + this.cubeThreeJsObject.position.y);
    this.cubeThreeJsObject.position.y += levitation;

    this.cubeThreeJsObject.rotation.x += 0.1;
    this.cubeThreeJsObject.rotation.y += 0.1;

    this.renderer.render( self.scene, self.camera );
}

anomaly.Core.prototype.onWindowResize = function( coreInstance, event )
{

    coreInstance.viewportWidth = window.innerWidth;
    coreInstance.viewportHeight = window.innerHeight;

    coreInstance.camera.aspect = coreInstance.viewportWidth / coreInstance.viewportHeight;
    coreInstance.camera.updateProjectionMatrix();

    coreInstance.renderer.setSize( coreInstance.viewportWidth, coreInstance.viewportHeight );
}

anomaly.Core.prototype.onDocumentKeyDown = function(coreInstance, event)
{

    // Cube event
    coreInstance.cube.onDocumentKeyDown(event);

}

anomaly.Core.prototype.onDocumentMouseDown = function( coreInstance, event )
{

    //Environment event
    coreInstance.environment.onDocumentMouseDown(event);
    coreInstance.camera.lookAt( coreInstance.environmentTarget );

}

    
anomaly.Core.prototype.onDocumentMouseMove = function( coreInstance, event )
{

    //Environment event
    coreInstance.environment.onDocumentMouseMove(event);
    coreInstance.camera.lookAt( coreInstance.environmentTarget );
}

anomaly.Core.prototype.onDocumentMouseUp = function( coreInstance, event )
{

    //Environment event
    coreInstance.environment.onDocumentMouseUp(event);
    coreInstance.camera.lookAt( coreInstance.environmentTarget );
}
    
anomaly.Core.prototype.onDocumentMouseWheel = function( coreInstance, event )
{
    //Core event
    // coreInstance.camera.fov -= event.wheelDeltaY * 0.05;
    // coreInstance.camera.updateProjectionMatrix();
    // coreInstance.camera.lookAt( coreInstance.environmentTarget );

}
    
anomaly.Core.prototype.onDocumentTouchStart = function( coreInstance, event )
{
    //Environment event
    coreInstance.environment.onDocumentTouchStart(event);
}
    
anomaly.Core.prototype.onDocumentTouchMove = function( coreInstance, event )
{
    //Environment event
    coreInstance.environment.onDocumentTouchMove(event);
    coreInstance.camera.lookAt( coreInstance.environmentTarget );
}