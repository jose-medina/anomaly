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

    this.moveCallbackBind = this.moveCallback.bind(window, this);

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
    if (keyboard.pressed("s"))
    { 
        this.scene.position.z += 1;
    }

    // Z position -1
    if (keyboard.pressed("w"))
    { 
        this.scene.position.z -= 1;
    }

    // X position -1
    if (keyboard.pressed("a"))
    { 
        this.scene.position.x -= 1;
    }

    // X position +1
    if (keyboard.pressed("d"))
    { 
        this.scene.position.x += 1;
    }
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
        document.addEventListener("mousemove", self.moveCallbackBind, false);
    } else {
        // Pointer was just unlocked
        // Disable the mousemove listener
        console.log("remove mousemove")
        document.removeEventListener("mousemove", self.moveCallbackBind, false);
    }
}

anomaly.Core.prototype.moveCallback = function(self, event)
{
    var mouseMovementX = event.movementX  ||
                    event.mozMovementX    ||
                    event.webkitMovementX ||
                    0,
        mouseMovementY = event.movementY  ||
                    event.mozMovementY    ||
                    event.webkitMovementY ||
                    0,

        mouseDeltaX = mouseMovementX - self.lastMouseMovementX,
        mouseDeltaY = mouseMovementY - self.lastMouseMovementY;

    self.moveLookLocked(mouseDeltaX, mouseDeltaY, self);

    self.scene.rotation.x = self.angleX;
    self.scene.rotation.y = self.angleY;
    //console.log("movementX => " + movementX + ", deltaX => " + deltaX + ", angleX => " + self.angleX + ", movementY => " + movementY + ", deltaY => " + deltaY + ", angleY => " + self.angleY);
}

anomaly.Core.prototype.moveLookLocked = function(deltaX, deltaY, self)
{
    self.angleY += deltaX * 0.0025;

    while (self.angleY < 0)
        self.angleY += Math.PI * 2;
    while (self.angleY >= Math.PI * 2)
        self.angleY -= Math.PI * 2;
            
    self.angleX += deltaY * 0.0025;

    while (self.angleX < -Math.PI * 0.5)
        self.angleX = -Math.PI * 0.5;
    while (self.angleX > Math.PI * 0.5)
        self.angleX = Math.PI * 0.5;
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
    self.environment.onDocumentMouseMove(event);
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