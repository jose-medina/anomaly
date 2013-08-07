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

    this.sphereOne;
    this.sphereOneThreeJsObject;
    this.environment;
    this.environmentThreeJsObject;
    this.environmentTarget;
    this.viewportWidth;
    this.viewportHeight;

    this.keyboard;

    this.contador = 0; 

}

anomaly.Core.prototype.initialize = function()
{
    var self = this,
        ambient = new THREE.AmbientLight( 0xffffff ),
        pointLight = new THREE.PointLight( 0xffffff, 2 );

    this.sphereOne = new anomaly.SphereOne();
    this.sphereOneThreeJsObject = this.sphereOne.initialize();
    this.environment = new anomaly.Environment();
    this.environmentThreeJsObject = this.environment.initialize();
    this.environmentTarget = this.environment.target;
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;

    this.keyboard = new THREEx.KeyboardState();

    this.camera = new THREE.PerspectiveCamera( 75, this.viewportWidth / this.viewportHeight, 1, 10000 );
    this.camera.position.z = 0;

    //this.camera.lookAt(this.sphereOne);

    this.scene = new THREE.Scene();
    this.scene.matrixAutoUpdate = true;
    this.scene.add(ambient);
    this.scene.add(pointLight);

    this.scene.add( this.sphereOneThreeJsObject );
    this.scene.add( this.environmentThreeJsObject );

    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setSize( this.viewportWidth, this.viewportHeight );

    document.body.appendChild( this.renderer.domElement );

    //document.addEventListener("keydown", this.onDocumentKeyDown.bind(window, this), false);

    document.addEventListener( "mousedown", this.onDocumentMouseDown.bind(window, this), false );
    document.addEventListener( "mousemove", this.onDocumentMouseMove.bind(window, this), false );
    document.addEventListener( "mouseup", this.onDocumentMouseUp.bind(window, this), false );
    document.addEventListener( "mousewheel", this.onDocumentMouseWheel.bind(window, this), false );

    document.addEventListener( "touchstart", this.onDocumentTouchStart.bind(window, this), false );
    document.addEventListener( "touchmove", this.onDocumentTouchMove.bind(window, this), false );

    window.addEventListener( 'resize', this.onWindowResize.bind(window, this), false );

}

anomaly.Core.prototype.loop = function()
{
    var self = this;
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( this.loop.bind(this) );  

    this.contador += 0.01

    var levitation = Math.sin(this.contador);

    this.sphereOne.bindKeyboardEvents(this.keyboard);

    this.camera.position = this.sphereOne.position;
    //this.camera.lookAt(this.sphereOne);

    //console.log("levitation: " + levitation + ", position y: " + this.sphereOneThreeJsObject.position.y);
    this.sphereOneThreeJsObject.position.y += levitation * 0.1;

    //this.sphereOneThreeJsObject.rotation.x += 0.1;
    this.sphereOneThreeJsObject.rotation.y += 0.01;

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

    // sphereOne event
    coreInstance.sphereOne.onDocumentKeyDown(event);

}

anomaly.Core.prototype.onDocumentMouseDown = function( coreInstance, event )
{

    //Environment event
    coreInstance.environment.onDocumentMouseDown(event);
    //coreInstance.camera.lookAt( coreInstance.environmentTarget );

}

    
anomaly.Core.prototype.onDocumentMouseMove = function( coreInstance, event )
{

    //Environment event
    coreInstance.environment.onDocumentMouseMove(event);
    //coreInstance.camera.lookAt( coreInstance.environmentTarget );
}

anomaly.Core.prototype.onDocumentMouseUp = function( coreInstance, event )
{

    //Environment event
    coreInstance.environment.onDocumentMouseUp(event);
    //coreInstance.camera.lookAt( coreInstance.environmentTarget );
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
    //coreInstance.camera.lookAt( coreInstance.environmentTarget );
}