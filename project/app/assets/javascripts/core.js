(function(window, $, undefined){

    if(typeof window.anomaly === "undefined")
    {
        window.anomaly = {};
    }

    window.anomaly.Core = function(options){
        this.toString = function(){
            return "anomaly.Core";
        }

        this.defaults = {
            contador: 0
        }

        this.options = $.extend(this.defaults, options);

        this._initialize();
    }

    window.anomaly.Core.prototype = {

        _initialize: function()
        {
            var ambient = new THREE.AmbientLight(0xffffff),
                pointLight = new THREE.PointLight(0xffffff, 2);

            this.canvas = document.getElementById("viewport");

            this.cube = new window.anomaly.SphereOne();
            this.cubeObject3D = this.cube._getObject3D();
            this.environment = new window.anomaly.Environment();
            this.environmentMesh = this.environment._getMesh();
            this.environmentTarget = this.environment._getTarget();
            this.viewportWidth = window.innerWidth;
            this.viewportHeight = window.innerHeight;

            this.keyboard = new THREEx.KeyboardState();

            this.camera = new THREE.PerspectiveCamera(75, this.viewportWidth / this.viewportHeight, 1, 10000);
            this.camera.position.z = 0;

            this.scene = new THREE.Scene();
            this.scene.matrixAutoUpdate = true;
            this.scene.add(ambient);
            this.scene.add(pointLight);

            this.scene.add(this.cubeObject3D);
            this.scene.add(this.environmentMesh);

            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(this.viewportWidth, this.viewportHeight);

            this._definePointerUtils();

            document.body.appendChild(this.renderer.domElement);

            this._bindEventListeners();
            this._loop();
        },
        _loop: function()
        {
            var self = this;
            // note: three.js includes requestAnimationFrame shim
            requestAnimationFrame(this._loop.bind(this));  

            this.options.contador += 0.01

            var levitation = Math.sin(this.options.contador);

            this._keyboardEvents();

            //console.log("levitation: " + levitation + ", position y: " + this.cubeObject3D.position.y);
            this.cubeObject3D.position.y += levitation * 0.1;

            //this.cubeObject3D.rotation.x += 0.1;
            this.cubeObject3D.rotation.y += 0.01;

            this.renderer.render(self.scene, self.camera);
        },
        _keyboardEvents: function()
        {
            // Z position +1
            if(this.keyboard.pressed("w")){
                this.camera.position.z += 1;
                this.environmentTarget.z = this.camera.position.z;
            }

            // Z position -1
            if(this.keyboard.pressed("s")){
                this.camera.position.z -= 1;
                this.environmentTarget.z = this.camera.position.z;
            }

            // X position -1
            if(this.keyboard.pressed("a")){
                this.camera.position.x -= 1;
                this.environmentTarget.x = this.camera.position.x;
            }

            // X position +1
            if(this.keyboard.pressed("d")){
                this.camera.position.x += 1;
                this.environmentTarget.x = this.camera.position.x;
            }
            //console.log("this.environmentTarget.x => " + this.environmentTarget.x + ", this.environmentTarget.y => " + this.environmentTarget.y + ", this.environmentTarget.z => " + this.environmentTarget.z);
            //console.log("this.camera.position.x => " + this.camera.position.x + ", this.camera.position.y => " + this.camera.position.y + ", this.camera.position.z => " + this.camera.position.z);
        },
        _bindEventListeners: function()
        {
            var self = this;

            if(typeof this.currentPointerString !== "undefined")
            {
                document.addEventListener(this.currentPointerString, this._changeCallback.bind(this), false);
            }
            else
            {
                document.addEventListener("mousedown", this.onDocumentMouseDown.bind(this), false);
                document.addEventListener("mousemove", this.onDocumentMouseMove.bind(this), false);
                document.addEventListener("mouseup", this.onDocumentMouseUp.bind(this), false);
                document.addEventListener("mousewheel", this.onDocumentMouseWheel.bind(this), false);
            }

            document.addEventListener("touchstart", this.onDocumentTouchStart.bind(this), false);
            document.addEventListener("touchmove", this.onDocumentTouchMove.bind(this), false);

            document.addEventListener("click", function()
            {
                self.requestPointerLockFunction();
            }
            , false);

            window.addEventListener('resize', this.onWindowResize.bind(this), false);
        },
        _definePointerUtils: function()
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
        },
        _changeCallback: function(event)
        {
            console.log("document.webkitPointerLockElement => " + document.webkitPointerLockElement);
            if(document.pointerLockElement === this.canvas ||
                document.mozPointerLockElement === this.canvas ||
                document.webkitPointerLockElement === this.canvas)
            {
                // Pointer was just locked
                // Enable the mousemove listener
                console.log("activate mousemove");
                document.addEventListener("mousedown", this.onDocumentMouseDown.bind(this), false);
                document.addEventListener("mousemove", this.onDocumentMouseMove.bind(this), false);
            } else {
                // Pointer was just unlocked
                // Disable the mousemove listener
                console.log("remove mousemove");
                document.removeEventListener("mousedown", this.onDocumentMouseDown.bind(this), false);
                document.removeEventListener("mousemove", this.onDocumentMouseMove.bind(this), false);
            }
        },
        onWindowResize: function(event)
        {
            this.viewportWidth = window.innerWidth;
            this.viewportHeight = window.innerHeight;

            this.camera.aspect = this.viewportWidth / this.viewportHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.viewportWidth, this.viewportHeight);
        },
        onDocumentKeyDown: function(event)
        {
            // sphereOne event
            this.sphereOne.onDocumentKeyDown(event);
        },
        onDocumentMouseDown: function(event)
        {
            //Environment event
            this.environment.onDocumentMouseDown(event);
            this.camera.lookAt(this.environmentTarget);
        },
        onDocumentMouseMove: function(event)
        {
            //Environment event
            var cameraCoords = {};
            cameraCoords.x = this.camera.position.x
            cameraCoords.y = this.camera.position.y
            cameraCoords.z = this.camera.position.z

            this.environment.onDocumentMouseMove(event, cameraCoords);
            this.camera.lookAt(this.environmentTarget);
        },
        onDocumentMouseUp: function(event)
        {
            //Environment event
            this.environment.onDocumentMouseUp(event);
            this.camera.lookAt(this.environmentTarget);
        },
        onDocumentMouseWheel: function(event)
        {
            //Core event
            // self.camera.fov -= event.wheelDeltaY * 0.05;
            // self.camera.updateProjectionMatrix();
            // self.camera.lookAt(self.environmentTarget);
        },
        onDocumentTouchStart: function(event)
        {
            //Environment event
            this.environment.onDocumentTouchStart(event);
        },
        onDocumentTouchMove: function(event)
        {
            //Environment event
            this.environment.onDocumentTouchMove(event);
            this.camera.lookAt(this.environmentTarget);
        }
    }
})(window, jQuery);
