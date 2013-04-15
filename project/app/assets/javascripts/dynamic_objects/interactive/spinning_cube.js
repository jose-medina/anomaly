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

    this.object3DX = 20;
    this.object3DY = 20;
    this.object3DZ = 20;
    
    this.geometry1;
    this.geometry2;
    this.material1;
    this.material2;
    // this.geometry;
    // this.material;
    this.object3D;

}

anomaly.SpinningCube.prototype.initialize = function()
{
    var self = this;

    this.geometry1 = new THREE.SphereGeometry(100,26,100);
    this.geometry2 = new THREE.SphereGeometry(40,44,40);
    
    this.material1 = new THREE.MeshBasicMaterial( { color: 0x0000FF } );
    this.material2 = new THREE.MeshBasicMaterial( { color: 0x0000FF } );
    //THREE.GeometryUtils.merge(this.geometry1,this.geometry2);

    this.espher1 = new THREE.Mesh( this.geometry1, this.material1 );
    this.espher2 = new THREE.Mesh( this.geometry2, this.material2 );
    this.object3D = new THREE.Object3D();

    this.object3D.add(this.espher1);
    this.object3D.add(this.espher2);

    this.object3D.position.z = -100;

    return this.object3D;
}

anomaly.SpinningCube.prototype.onDocumentKeyDown = function(event)
{
    switch( event.keyCode ) {
        // Z position +1
        case 87: this.object3D.position.z += 1; break;
        // Z position -1
        case 83: this.object3D.position.z -= 1; break;
        // X position -1
        case 65: this.object3D.position.x -= 1; break;
        // X position +1
        case 68: this.object3D.position.x += 1; break;
        // Y position +1
        case 38: this.object3D.position.y += 1; break;
        // Y position -1
        case 40: this.object3D.position.y -= 1; break;
    }
}
