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

    this.cubeX = 200;
    this.cubeY = 200;
    this.cubeZ = 200;
    
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

    return this.cube;
}
