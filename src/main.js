/**
* VRUI Javascript UI Library
* https://github.com/artflow-vr/vr-ui
*
* MIT License
*
* Copyright (c) 2017 artflow-vr
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

import Page from './page';

export default class VRUI {

    constructor( pages ) {

        if ( !pages ) {
            this.pages = [];
            return;
        }

        if ( pages.constructor === Array ) {
            this.pages = pages.slice();
        } else if ( pages.constructor === Page ) {
            this.pages = [];
            this.pages.push( pages );
        } else {
            let errorMsg = `VRUI was provided a wrong value. You can `;
            errorMsg += `instanciate a new UI whether without arguments, or `;
            errorMsg += `either with a single VRUI.Page or an array of VRUI.Page`;
            throw new TypeError( `VRUI.ctor(): ` + errorMsg );
        }

        this._raycaster = new THREE.Raycaster( new THREE.Vector3(),
                                                new THREE.Vector3() );

        this._mouse = {
            coords: new THREE.Vector2( -1.0, -1.0 ),
            enabled: false,
            camera: null,
            renderer: null,
            down: null,
            up: null,
            move: null
        };

        this._state = {
            pressed: false
        };

    }

    update() {

        if ( this.pages.length === 0 ) return;

        //this._raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
        //this._raycaster.ray.direction.set( 0, 0, -1 ).applyMatrix4( tempMatrix );

        let page = this.pages[ 0 ];
        this._checkIntersection( page.root, this._state );

    }

    refresh() {

        for ( let elt of this.pages ) {
            elt.refresh();
        }

    }

    addToScene( scene ) {

        if ( scene.constructor !== THREE.Scene ) {
            let errorMsg = `the provided scene does not inherit from `;
            errorMsg += `Three.Scene.`;
            throw new TypeError( `VRUI.addToScene(): ` + errorMsg );
        }

        for ( let elt of this.pages ) {
            scene.add( elt.root.group );
        }

    }

    enableMouse( camera, renderer ) {

        if ( !camera ) {
            let errorMsg = `you did not provide any camera.`;
            throw Error( `VRUI.enableMouse(): ` + errorMsg );
        }

        if ( camera.constructor === THREE.Camera ) {
            let errorMsg = `the provided image is not a THREE.Camera.`;
            throw Error( `VRUI.enableMouse(): ` + errorMsg );
        }

        this._mouse.camera = camera;
        this._mouse.renderer = renderer;
        this._mouse.enabled = true;

        this._mouse.move = ( event ) => {

            let coords = this._mouse.coords;
            coords.x = ( event.offsetX / this._mouse.renderer.domElement.width ) * 2 - 1;
            coords.y = - ( event.offsetY / this._mouse.renderer.domElement.height ) * 2 + 1;
        };

        this._mouse.up = () => {

            this._state.pressed = false;

        };

        this._mouse.down = ( event ) => {

            if ( event.button === 0 ) this._state.pressed = true;

        };

        window.addEventListener( `mousemove`, this._mouse.move );
        window.addEventListener( `mousedown`, this._mouse.down );
        window.addEventListener( `mouseup`, this._mouse.up );

    }

    disableMouse() {

        this._mouse.enabled = false;

        window.removeEventListener( `mousemove`, this._mouse.move );
        window.removeEventListener( `mousedown`, this._mouse.down );
        window.removeEventListener( `mouseup`, this._mouse.up );

    }

    _checkIntersection( mainLayout, state ) {

        this._raycaster.setFromCamera( this._mouse.coords, this._mouse.camera );
        return mainLayout._intersect( this._raycaster, state );

    }

}
