if (typeof anomaly === "undefined") var anomaly = {};

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
    this.lastMouseMovementX;
    this.lastMouseMovementY;
    this.angleY;
    this.angleX;

    this.moveCallbackBind;

    this.currentPointerString;
    this.requestPointerLockFunction;

    this.canvas;

    this.keyboard;

    this.contador = 0; 
}

anomaly.Core.prototype.initialize = function()
{
    var self = this,
        ambient = new THREE.AmbientLight(0xffffff),
        pointLight = new THREE.PointLight(0xffffff, 2);

    this.sphereOne = new anomaly.SphereOne();
    this.sphereOneThreeJsObject = this.sphereOne.initialize();
    this.environment = new anomaly.Environment();
    this.environmentThreeJsObject = this.environment.initialize();
    this.environmentTarget = this.environment.target;
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;

    this.canvas = document.getElementById("viewport");
    
    this.lastMouseMovementX = 0;
    this.lastMouseMovementY = 0;
    this.angleY = 0;
    this.angleX = 0;

    this.keyboard = new THREEx.KeyboardState();

    this.camera = new THREE.PerspectiveCamera(75, this.viewportWidth / this.viewportHeight, 1, 10000);
    this.camera.position.z = 0;

    this.scene = new THREE.Scene();
    this.scene.matrixAutoUpdate = true;
    this.scene.add(ambient);
    this.scene.add(pointLight);

    this.scene.add(self.sphereOneThreeJsObject);
    this.scene.add(self.environmentThreeJsObject);

    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setSize(this.viewportWidth, this.viewportHeight);

    this.onDocumentMouseDownBind = this.onDocumentMouseDown.bind(window, this);
    this.onDocumentMouseUpBind = this.onDocumentMouseUp.bind(window, this);
    this.onDocumentMouseMoveBind = this.onDocumentMouseMove.bind(window, this);

    this.environmentTarget.z = this.camera.position.z;
    this.environmentTarget.x = this.camera.position.x;

    // choose between pointerLock depending on the browser
    this.definePointerUtils();

    document.body.appendChild(self.renderer.domElement);

    this.bindListerners();
}

anomaly.Core.prototype.loop = function()
{
    var self = this;
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(this.loop.bind(this));  

    this.contador += 0.01

    var levitation = Math.sin(this.contador);

    this.bindKeyboardEvents(this.keyboard);

    this.sphereOne.bindKeyboardEvents(this.keyboard);

    //console.log("levitation: " + levitation + ", position y: " + this.sphereOneThreeJsObject.position.y);
    this.sphereOneThreeJsObject.position.y += levitation * 0.1;

    //this.sphereOneThreeJsObject.rotation.x += 0.1;
    this.sphereOneThreeJsObject.rotation.y += 0.01;

    this.renderer.render(self.scene, self.camera);
}

anomaly.Core.prototype.bindKeyboardEvents = function(keyboard)
{
    // Z position +1
    if (keyboard.pressed("w"))
    { 
        this.camera.position.z += 1;
        this.environmentTarget.z = this.camera.position.z;
    }

    // Z position -1
    if (keyboard.pressed("s"))
    { 
        this.camera.position.z -= 1;
        this.environmentTarget.z = this.camera.position.z;
    }

    // X position -1
    if (keyboard.pressed("a"))
    { 
        this.camera.position.x -= 1;
        this.environmentTarget.x = this.camera.position.x;
    }

    // X position +1
    if (keyboard.pressed("d"))
    { 
        this.camera.position.x += 1;
        this.environmentTarget.x = this.camera.position.x;
    }
    //console.log("this.environmentTarget.x => " + this.environmentTarget.x + ", this.environmentTarget.y => " + this.environmentTarget.y + ", this.environmentTarget.z => " + this.environmentTarget.z);
    //console.log("this.camera.position.x => " + this.camera.position.x + ", this.camera.position.y => " + this.camera.position.y + ", this.camera.position.z => " + this.camera.position.z);
}

anomaly.Core.prototype.bindListerners = function()
{
    var self = this;

    if (typeof this.currentPointerString !== "undefined")
    {
        document.addEventListener(this.currentPointerString, this.changeCallback.bind(window, self), false);
    }
    else
    {
        document.addEventListener("mousedown", this.onDocumentMouseDown.bind(window, self), false);
        document.addEventListener("mousemove", this.onDocumentMouseMove.bind(window, self), false);
        document.addEventListener("mouseup", this.onDocumentMouseUp.bind(window, self), false);
        document.addEventListener("mousewheel", this.onDocumentMouseWheel.bind(window, self), false);
    }

    document.addEventListener("touchstart", this.onDocumentTouchStart.bind(window, self), false);
    document.addEventListener("touchmove", this.onDocumentTouchMove.bind(window, self), false);

    document.addEventListener("click", function()
    {
        self.requestPointerLockFunction();
    }
    , false);

    window.addEventListener('resize', this.onWindowResize.bind(window, self), false);
}

anomaly.Core.prototype.definePointerUtils = function()
{
    switch(true)
    {
        case 'pointerLockElement' in document: 
            this.currentPointerString = 'pointerlockchange';
            this.requestPointerLockFunction = function()
            {
                this.canvas.requestPointerLock();
            }
            break;
        case 'mozPointerLockElement' in document: 
            this.currentPointerString = 'mozpointerlockchange';
            this.requestPointerLockFunction = function()
            {
                this.canvas.mozRequestPointerLock();
            }
            break;
        case 'webkitPointerLockElement' in document: 
            this.currentPointerString = 'webkitpointerlockchange';
            this.requestPointerLockFunction = function()
            {
                this.canvas.webkitRequestPointerLock();
            }
            break;
    } 
}

anomaly.Core.prototype.changeCallback = function(self, event)
{
    console.log("document.webkitPointerLockElement => " + document.webkitPointerLockElement);
    if (document.pointerLockElement === self.canvas ||
        document.mozPointerLockElement === self.canvas ||
        document.webkitPointerLockElement === self.canvas)
    {
        // Pointer was just locked
        // Enable the mousemove listener
        console.log("activate mousemove");
        document.addEventListener("mousedown", self.onDocumentMouseDownBind, false);
        document.addEventListener("mousemove", self.onDocumentMouseMoveBind, false);
    } else {
        // Pointer was just unlocked
        // Disable the mousemove listener
        console.log("remove mousemove");
        document.removeEventListener("mousedown", self.onDocumentMouseDownBind, false);
        document.removeEventListener("mousemove", self.onDocumentMouseMoveBind, false);
    }
}

anomaly.Core.prototype.onWindowResize = function(self, event)
{
    self.viewportWidth = window.innerWidth;
    self.viewportHeight = window.innerHeight;

    self.camera.aspect = self.viewportWidth / self.viewportHeight;
    self.camera.updateProjectionMatrix();

    self.renderer.setSize(self.viewportWidth, self.viewportHeight);
}

anomaly.Core.prototype.onDocumentKeyDown = function(self, event)
{
    // sphereOne event
    self.sphereOne.onDocumentKeyDown(event);
}

anomaly.Core.prototype.onDocumentMouseDown = function(self, event)
{
    //Environment event
    self.environment.onDocumentMouseDown(event);
    self.camera.lookAt(self.environmentTarget);
}

anomaly.Core.prototype.onDocumentMouseMove = function(self, event)
{
    //Environment event
    var cameraCoords = {};
    cameraCoords.x = self.camera.position.x
    cameraCoords.y = self.camera.position.y
    cameraCoords.z = self.camera.position.z

    self.environment.onDocumentMouseMove(event, cameraCoords);
    self.camera.lookAt(self.environmentTarget);
}

anomaly.Core.prototype.onDocumentMouseUp = function(self, event)
{
    //Environment event
    self.environment.onDocumentMouseUp(event);
    self.camera.lookAt(self.environmentTarget);
}

anomaly.Core.prototype.onDocumentMouseWheel = function(self, event)
{
    //Core event
    // self.camera.fov -= event.wheelDeltaY * 0.05;
    // self.camera.updateProjectionMatrix();
    // self.camera.lookAt(self.environmentTarget);
}

anomaly.Core.prototype.onDocumentTouchStart = function(self, event)
{
    //Environment event
    self.environment.onDocumentTouchStart(event);
}

anomaly.Core.prototype.onDocumentTouchMove = function(self, event)
{
    //Environment event
    self.environment.onDocumentTouchMove(event);
    self.camera.lookAt(self.environmentTarget);
}