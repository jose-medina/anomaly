(function(window, $, undefined){
    
    if(typeof window.anomaly === "undefined")
        window.anomaly = {};

    window.anomaly.SphereOne = function(options)
    {
        this.toString = function()
        {
            return "anomaly.SphereOne";
        }

        this.defaults = {
            object3DX: 20,
            object3DY: 20,
            object3DZ: 20
        }

        this.options = $.extend(this.defaults, options);
        this._initialize();
    }

    window.anomaly.SphereOne.prototype = {
        _initialize: function()
        {
            var environmentMaterialUrls = [
                    'assets/static_objects/environment/px.jpg', // right
                    'assets/static_objects/environment/nx.jpg', // left
                    'assets/static_objects/environment/py.jpg', // top
                    'assets/static_objects/environment/ny.jpg', // bottom
                    'assets/static_objects/environment/pz.jpg', // back
                    'assets/static_objects/environment/nz.jpg'  // front
                ];

            this.reflectionMaterial = THREE.ImageUtils.loadTextureCube(environmentMaterialUrls);

            this.geometry1 = new THREE.SphereGeometry(100,100,10);
            this.geometry2 = new THREE.SphereGeometry(40,44,10);

            this.material1 = new THREE.MeshBasicMaterial(
            {
                wireframe: false,
                map: THREE.ImageUtils.loadTexture('assets/dynamic_objects/sphere_1/jupiter.jpg'),
                overdraw: true
            });

            this.material2 = new THREE.MeshBasicMaterial(   
            {
                color: 0xcccccc,
                envMap: this.reflectionMaterial
            });

            THREE.GeometryUtils.merge(this.geometry1,this.geometry2);

            this.espher1 = new THREE.Mesh(this.geometry1, this.material1);
            this.espher2 = new THREE.Mesh(this.geometry2, this.material2);
            this.object3D = new THREE.Object3D();

            //this.object3D.add(this.espher1);
            this.object3D.add(this.espher2);

            this.object3D.position.z = -400;
        },
        _bindKeyboardEvents: function(keyboard)
        {
            // Z position +1
            if(keyboard.pressed("w"))
                this.object3D.position.z += 1;

            // Z position -1
            if(keyboard.pressed("s"))
                this.object3D.position.z -= 1;

            // X position -1
            if(keyboard.pressed("left"))
                this.object3D.position.x -= 1;

            // X position +1
            if(keyboard.pressed("right"))
                this.object3D.position.x += 1;

            // Y position +1
            if(keyboard.pressed("down"))
                this.object3D.position.y += 1;

            // Y position -1
            if(keyboard.pressed("up"))
                this.object3D.position.y -= 1;
        },
        _getObject3D: function(){
            return this.object3D;
        }
    }
})(window, jQuery);