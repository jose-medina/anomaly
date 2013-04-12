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

    this.cubeX = 20;
    this.cubeY = 20;
    this.cubeZ = 20;
    
    this.geometry;
    this.material;
    this.cube;

}

anomaly.SpinningCube.prototype.initialize = function()
{
    var self = this;

    this.geometry = new THREE.CubeGeometry( this.cubeX, this.cubeY, this.cubeZ );
    this.geometry.verticesNeedUpdate = true;
    this.geometry.elementsNeedUpdate = true;
    this.geometry.morphTargetsNeedUpdate = true;
    this.geometry.uvsNeedUpdate = true;
    this.geometry.normalsNeedUpdate = true;
    this.geometry.colorsNeedUpdate = true;
    this.geometry.tangentsNeedUpdate = true;
    this.geometry.dynamic = true;

    this.material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    this.cube = new THREE.Mesh(self.geometry, self.material );
    this.cube.matrixWorldNeedsUpdate = true;

    this.cube.position.z = -100;

    return this.cube;
}

anomaly.SpinningCube.prototype.onDocumentKeyDown = function(event)
{
    if (event.keyCode == 87)
    {
        this.cube.position.z += 1;
    }
    else if (event.keyCode == 83)
    {
        this.cube.position.z -= 1;
    }
    else if (event.keyCode == 65)
    {
        this.cube.position.x -= 1;
    }
    else if (event.keyCode == 68)
    {
        this.cube.position.x += 1;
    }
    else if (event.keyCode == 38)
    {
        this.cube.position.y += 1;
    }
    else if (event.keyCode == 40)
    {
        this.cube.position.y -= 1;        
    }
}
