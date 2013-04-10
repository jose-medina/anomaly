if (typeof anomaly === "undefined")
{
    var anomaly = {};
}

anomaly.SpinningCube = function()
{
    this.toString = function()
    {
        return "anomaly.SpinningCube";
    }

    this.camera;
    this.scene;
    this.renderer;

    this.cubeX = 200;
    this.cubeY = 200;
    this.cubeZ = 200;
    
    this.geometry;
    this.material;
    this.mesh;

    this.meshRotationX;
    this.meshRotationY;

}

anomaly.SpinningCube.prototype.initialize = function()
{
    var self = this;

    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 1000;

    this.scene = new THREE.Scene();

    this.geometry = new THREE.CubeGeometry( this.cubeX, this.cubeY, this.cubeZ );
    this.material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    this.mesh = new THREE.Mesh(self.geometry, self.material );
    this.scene.add( self.mesh );

    this.renderer = new THREE.CanvasRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( self.renderer.domElement );

    this.cubeSize();

}

anomaly.SpinningCube.prototype.loop = function()
{
    var self = this;
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( this.loop.bind(this) );  

    this.meshRotationX = this.mesh.rotation.x += 0.01;
    this.meshRotationY = this.mesh.rotation.y += 0.02;

    this.renderer.render( self.scene, self.camera );
}

anomaly.SpinningCube.prototype.cubeSize = function()
{
    var self = this;

    $(document).on("keydown", function(event)
    {

        console.log("keydown");

        if (event.keyCode == 87)
        {
            self.cubeX = self.cubeY = self.cubeZ += 10;
        }
        else if (event.keyCode == 83)
        {
            self.cubeX = self.cubeY = self.cubeZ -= 10;
        }

        self.geometry = new THREE.CubeGeometry( self.cubeX, self.cubeY, self.cubeZ );

        self.scene.remove( self.mesh );

        self.mesh = new THREE.Mesh(self.geometry, self.material );
        self.mesh.rotation.x = self.meshRotationX;
        self.mesh.rotation.y = self.meshRotationY;

        self.scene.add( self.mesh );
    });

}