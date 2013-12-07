(function(window, $, undefined){

    if (typeof window.anomaly === "undefined")
    {
        window.anomaly = {};
    }

    window.anomaly.Core = function(options)
    {
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

            document.body.appendChild(this.renderer.domElement);

            this._bindEventListeners();
            this._loop();
        },
        _bindEventListeners: function(){
            //document.addEventListener("keydown", this.onDocumentKeyDown.bind(window, self), false);

            document.addEventListener("mousedown", this.onDocumentMouseDown.bind(this), false);
            document.addEventListener("mousemove", this.onDocumentMouseMove.bind(this), false);
            document.addEventListener("mouseup", this.onDocumentMouseUp.bind(this), false);
            document.addEventListener("mousewheel", this.onDocumentMouseWheel.bind(this), false);

            document.addEventListener("touchstart", this.onDocumentTouchStart.bind(this), false);
            document.addEventListener("touchmove", this.onDocumentTouchMove.bind(this), false);

            window.addEventListener('resize', this.onWindowResize.bind(this), false);
        },
        _loop: function()
        {
            var self = this;
            // note: three.js includes requestAnimationFrame shim
            requestAnimationFrame(this._loop.bind(this));  

            this.options.contador += 0.01

            var levitation = Math.sin(this.options.contador);

            this.cube._bindKeyboardEvents(this.keyboard);

            //console.log("levitation: " + levitation + ", position y: " + this.cubeObject3D.position.y);
            this.cubeObject3D.position.y += levitation * 0.1;

            //this.cubeObject3D.rotation.x += 0.1;
            this.cubeObject3D.rotation.y += 0.01;

            this.renderer.render(self.scene, self.camera);
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
            // Cube event
            this.cube.onDocumentKeyDown(event);
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
            this.environment.onDocumentMouseMove(event);
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
            // this.camera.fov -= event.wheelDeltaY * 0.05;
            // this.camera.updateProjectionMatrix();
            // this.camera.lookAt(this.environmentTarget);
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