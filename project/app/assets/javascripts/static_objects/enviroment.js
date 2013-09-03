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
    this.onPointerDownPointerX = 0;
    this.onPointerDownPointerY = 0;
    this.onPointerDownLon = 0;
    this.onPointerDownLat = 0;
    this.context;
    this.lon = 90;
    this.lat = 0;
    this.phi = 0; 
    this.theta = 0;

    this.geometry;
    this.material;
    this.enviroment;
}

anomaly.Environment.prototype.initialize = function()
{
    this.texturePlaceholder = document.createElement('canvas');

    this.context = this.texturePlaceholder.getContext('2d');
    this.context.fillStyle = 'rgb( 200, 200, 200 )';
    this.context.fillRect( 0, 0, this.texturePlaceholder.width, this.texturePlaceholder.height );

    this.materialUrls = [

        'assets/static_objects/environment/px.jpg', // right
        'assets/static_objects/environment/nx.jpg', // left
        'assets/static_objects/environment/py.jpg', // top
        'assets/static_objects/environment/ny.jpg', // bottom
        'assets/static_objects/environment/pz.jpg', // back
        'assets/static_objects/environment/nz.jpg'  // front

    ];

    this.material = this.loadTexture(this.materialUrls);

    this.enviroment = new THREE.Mesh(new THREE.CubeGeometry( window.innerWidth, window.innerHeight, window.innerWidth, 7, 7, 7), new THREE.MeshFaceMaterial( this.material ) );
    this.enviroment.scale.x = -1;

    return this.enviroment;
    
}

anomaly.Environment.prototype.target = new THREE.Vector3();

anomaly.Environment.prototype.loadTexture = function( materialUrls )
{

    var self = this,
        material = [];        
       
    $(materialUrls).each(function(index, materialUrl)
    { 
        var image = new Image(),
            texture = new THREE.Texture( this.texturePlaceholder ),
            materialElem = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );

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
    this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
    this.phi = THREE.Math.degToRad( 90 - this.lat );
    this.theta = THREE.Math.degToRad( this.lon );

    this.target.x = 500 * Math.sin( this.phi ) * Math.cos( this.theta );
    this.target.y = 500 * Math.cos( this.phi );
    this.target.z = 500 * Math.sin( this.phi ) * Math.sin( this.theta );
}


anomaly.Environment.prototype.onDocumentMouseDown = function( event )
{

    event.preventDefault();

    this.isUserInteracting = true;

    this.onPointerDownPointerX = event.clientX;
    this.onPointerDownPointerY = event.clientY;

    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;

}

    
anomaly.Environment.prototype.onDocumentMouseMove = function( event )
{

    if ( this.isUserInteracting ) {

        this.lon = ( this.onPointerDownPointerX - event.clientX ) * 0.1 + this.onPointerDownLon;
        this.lat = ( event.clientY - this.onPointerDownPointerY ) * 0.1 + this.onPointerDownLat;
        this.updateEnvironment();
    }
}

anomaly.Environment.prototype.onDocumentMouseUp = function( event )
{

    this.isUserInteracting = false;
    this.updateEnvironment();
}
    
anomaly.Environment.prototype.onDocumentMouseWheel = function( event )
{
    this.updateEnvironment();
}
    
anomaly.Environment.prototype.onDocumentTouchStart = function( event )
{

    if ( event.touches.length == 1 ) {

        event.preventDefault();

        this.onPointerDownPointerX = event.touches[ 0 ].pageX;
        this.onPointerDownPointerY = event.touches[ 0 ].pageY;

        this.onPointerDownLon = this.lon;
        this.onPointerDownLat = this.lat;

    }
}
    
anomaly.Environment.prototype.onDocumentTouchMove = function( event )
{

    if ( event.touches.length == 1 ) {

        event.preventDefault();

        this.lon = ( this.onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + this.onPointerDownLon;
        this.lat = ( event.touches[0].pageY - this.onPointerDownPointerY ) * 0.1 + this.onPointerDownLat;

        this.updateEnvironment();
    }
}