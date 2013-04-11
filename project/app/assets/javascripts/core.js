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

    this.cube = new anomaly.SpinningCube().initialize();

}

anomaly.Core.prototype.initialize = function()
{
    var self = this;

    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 1000;

    this.scene = new THREE.Scene();
    this.scene.matrixAutoUpdate = true;

    this.scene.add( self.cube );

    this.renderer = new THREE.CanvasRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( self.renderer.domElement );

    document.addEventListener("keydown", this.onDocumentKeyDown.bind(window, self), false);

}

anomaly.Core.prototype.loop = function()
{
    var self = this;
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( this.loop.bind(this) );  

    //this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.1;

    this.renderer.render( self.scene, self.camera );
}

anomaly.Core.prototype.onDocumentKeyDown = function(coreInstance, event)
{
    if (event.keyCode == 87)
    {
        coreInstance.cube.rotation.x += 0.1;
    }
    else if (event.keyCode == 83)
    {
        coreInstance.cube.rotation.x -= 0.1;
    }

}