if (typeof anomaly === "undefined")
{
    var anomaly = {};
}

anomaly.Environment = function()
{
    this.toString = function()
    {
        return "anomaly.Environment";
    }

    this.texturePlaceholder;
    this.isUserInteracting = false;
    this.context;
    this.lon = 90;
    this.lat = 0;
    this.phi = 0; 
    this.theta = 0;
    this.cameraCoords = {};

    this.geometry;
    this.material;
    this.enviroment;
}

anomaly.Environment.prototype.initialize = function()
{
    this.texturePlaceholder = document.createElement('canvas');

    this.context = this.texturePlaceholder.getContext('2d');
    this.context.fillStyle = 'rgb(200, 200, 200)';
    this.context.fillRect(0, 0, this.texturePlaceholder.width, this.texturePlaceholder.height);

    this.materialUrls = [
        'assets/static_objects/environment/px.jpg', // right
        'assets/static_objects/environment/nx.jpg', // left
        'assets/static_objects/environment/py.jpg', // top
        'assets/static_objects/environment/ny.jpg', // bottom
        'assets/static_objects/environment/pz.jpg', // back
        'assets/static_objects/environment/nz.jpg'  // front
    ];

    this.cameraCoords.x = 0;
    this.cameraCoords.y = 0;
    this.cameraCoords.z = 0;

    // this.materialUrls = [
    //     'assets/static_objects/chessboard_display_large.jpg', // right
    //     'assets/static_objects/chessboard_display_large.jpg', // left
    //     'assets/static_objects/chessboard_display_large.jpg', // top
    //     'assets/static_objects/chessboard_display_large.jpg', // bottom
    //     'assets/static_objects/chessboard_display_large.jpg', // back
    //     'assets/static_objects/chessboard_display_large.jpg'  // front
    // ];

    this.material = this.loadTexture(this.materialUrls);

    this.enviroment = new THREE.Mesh(new THREE.CubeGeometry(window.innerWidth, window.innerHeight, window.innerWidth, 7, 7, 7), new THREE.MeshFaceMaterial(this.material));
    this.enviroment.scale.x = -1;

    return this.enviroment;
    
}

anomaly.Environment.prototype.target = new THREE.Vector3();

anomaly.Environment.prototype.loadTexture = function(materialUrls)
{
    var self = this,
        material = [];        
       
    $(materialUrls).each(function(index, materialUrl)
    { 
        var image = new Image(),
            texture = new THREE.Texture(this.texturePlaceholder),
            materialElem = new THREE.MeshBasicMaterial({ map: texture, overdraw: true });

        image.onload = function () {
            texture.needsUpdate = true;
            materialElem.map.image = this;

            self.updateEnvironment();
        };

        image.src = materialUrl;

        material.push(materialElem);
    });

    return material;
}

anomaly.Environment.prototype.updateEnvironment = function()
{
    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = THREE.Math.degToRad(90 - this.lat);
    this.theta = THREE.Math.degToRad(this.lon);

    this.target.x = 500 * Math.sin(this.phi) * Math.cos(this.theta) + this.cameraCoords.x;
    this.target.y = 500 * Math.cos(this.phi) + this.cameraCoords.y;
    this.target.z = 500 * Math.sin(this.phi) * Math.sin(this.theta) + this.cameraCoords.z;
    // console.log("latitude => " + this.lat + ", longitude => " + this.lon);
    // console.log("this.target.x => " + this.target.x + ", this.target.y => " + this.target.y + ", this.target.z => " + this.target.z);
    // console.log("this.camera.position.x => " + this.camera.position.x + ", this.camera.position.y => " + this.camera.position.y + ", this.camera.position.z => " + this.camera.position.z);
}

anomaly.Environment.prototype.onDocumentMouseDown = function(event)
{
    event.preventDefault();

    this.isUserInteracting = true;

    this.lon = event.clientX * 0.1;
    this.lat = event.clientY * 0.1;

    //console.log("latitude => " + this.lat + ", longitude => " + this.lon);
}
  
anomaly.Environment.prototype.onDocumentMouseMove = function(event, cameraCoords)
{
    if (this.isUserInteracting)
    {
        var mouseMovementX =    event.movementX         ||
                                event.mozMovementX      ||
                                event.webkitMovementX   ||
                                0,
            mouseMovementY =    event.movementY         ||
                                event.mozMovementY      ||
                                event.webkitMovementY   ||
                                0;

        this.lon += mouseMovementX;
        this.lat += -mouseMovementY;
        this.cameraCoords = cameraCoords;
        this.updateEnvironment();
        // console.log("latitude => " + this.lat + ", mouseMovementX => " + mouseMovementX + ", longitude => " + this.lon + ", mouseMovementY => " + mouseMovementY);
    }
}

anomaly.Environment.prototype.onDocumentMouseUp = function(event)
{
    this.isUserInteracting = false;
    //this.updateEnvironment();
}
    
anomaly.Environment.prototype.onDocumentMouseWheel = function(event)
{
    //this.updateEnvironment();
}
