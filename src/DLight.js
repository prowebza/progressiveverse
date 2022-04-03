// Copyright 2022 by Croquet Corporation, Inc. All Rights Reserved.
// https://croquet.io
// info@croquet.io
//
console.log("THIS IS DEPRECATED - Use the Light.js behavior instead");
import { THREE } from "@croquet/worldcore";

import { CardActor, CardPawn } from "./DCard.js";

export class DLight extends CardActor {
    get pawn() {return DLightPawn;}
}

DLight.register('DLight');

class DLightPawn extends CardPawn {
    constructor(options) {
        console.log("construct lights")
        super(options);
        this.addToLayers('light');
        let trm = this.service("ThreeRenderManager");
        let scene =  trm.scene;
        let camera = trm.camera;
        this.setupCSM(scene, camera, THREE);
        let group = this.shape;
        const ambient = new THREE.AmbientLight( 0xffffff, .75 );
        group.add(ambient);

        const sun = this.sun = new THREE.DirectionalLight( 0xffe0b5, 1 );
        sun.position.set(400, 500, 400);
        group.add(sun);

        this.moon = new THREE.DirectionalLight( 0x6cbbff, 0.5 );
        this.moon.position.set(200, 100, -100);
        group.add(this.moon);

        this.hemiLight = this.hemiLight = new THREE.HemisphereLight(0xffeeb1, 0xc7ccff, 0.25);
        group.add(this.hemiLight);
        group.name = "Light Card";
    }

    destroy() {
        console.log("destroy lights")
        if(this.background)this.background.dispose();
        this.sun.dispose();
        this.hemiLight.dispose();
        this.moon.dispose();
        super.destroy();
    }

    setupCSM(scene, camera, THREE){
        this.csm = new THREE.CSM({
            fade: true,
            far: camera.far,
            maxFar: 1000,
            cascades: 4,
            shadowMapSize: 2048,
            shadowbias: 0.00025,
            lightDirection: new THREE.Vector3(-1, -1, -0.5),
            camera: camera,
            parent: scene,
            lightIntensity: 0.6,
            lightFar: 1000,
            mode: "practical"
          });
    }

    update(time){
        if(this.csm)this.csm.update();
    }
}

/* globals ASSETS_DIRECTORY */
