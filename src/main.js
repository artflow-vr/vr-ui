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

import Element from './element';

/**
 *
 * UI class handling layouts, interactions, and events (button clicks, etc...)
 *
 * @export
 * @class VRUI
 */
export default class VRUI {

    /**
     * Creates an instance of VRUI. A VRUI contains an entire page of UI.
     *
     * @param {VRUI.Element} root - Root element. e.g: a ImageButton,
     * a HorizontalLayout, etc...
     * @param {number} widthUnit - Width in Three.js units.
     * @param {number} heightUnit - Height in Three.js units.
     * @param {number} [depthUnit=0.0] - Depth in Three.js units.
     * @memberof VRUI
     */
    constructor( root, widthUnit, heightUnit, depthUnit = 0.0 ) {

        if ( !widthUnit || widthUnit <= 0 ) {
            let errorMsg = `parent layout should have a width specified `;
            errorMsg += `in Three.js world units, non-negative nor null.`;
            throw new TypeError( `VRUI.ctor(): ` + errorMsg );
        }
        if ( !heightUnit || heightUnit <= 0 ) {
            let errorMsg = `parent layout should have a height specified `;
            errorMsg += `in Three.js world units, non-negative nor null.`;
            throw new TypeError( `VRUI.ctor(): ` + errorMsg );
        }

        if ( !root ) {
            let errorMsg = `Page should be provided either a layout or a view.`;
            throw new TypeError( `VRUI.ctor(): ` + errorMsg );
        }

        if ( !( root instanceof Element ) ) {
            let errorMsg = `the provided root does not inherit from `;
            errorMsg += `VRUI.Element.`;
            throw new TypeError( `VRUI.ctor(): ` + errorMsg );
        }

        this.root = root;
        this.root.group.position.x = - widthUnit / 2.0;
        this.root.group.position.y = heightUnit / 2.0;

        this.enabled = true;

        this.root._parentDimensions = {
            width: widthUnit,
            height: heightUnit
        };

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

    /**
     *
     * Updates the UI. This method takes care of checking intersection and
     * forwarding the events.
     *
     * @memberof VRUI
     */
    update() {

        if ( !this.enabled ) return;
        //this._raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
        //this._raycaster.ray.direction.set( 0, 0, -1 ).applyMatrix4( tempMatrix );

        this._checkIntersection( this.root, this._state );

    }


    /**
     * Recursively computes bounds of each element in the UI.
     *
     * This function will compute the dimensions of the elements, as well
     * as their position relative to the layout they are in.
     */
    refresh() {

        this.root.refresh();

    }

    /**
     *
     * Adds this instance of UI in the given scene.
     *
     * @param {THREE.Scene} scene The THREE.Scene in which UI should be added.
     * @memberof VRUI
     */
    addToScene( scene ) {

        if ( scene.constructor !== THREE.Scene ) {
            let errorMsg = `the provided scene does not inherit from `;
            errorMsg += `Three.Scene.`;
            throw new TypeError( `VRUI.addToScene(): ` + errorMsg );
        }

        scene.add( this.root.group );

    }


    /**
     *
     * Enable mouse interactions. The method will bind mouse events
     * on the window element.
     *
     * @param  {THREE.Camera} camera The camera used for unprojection.
     * @param  {THREE.WebGLRenderer} renderer The main THREE renderer.
     */
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


    /**
     *
     * Disable mouse interactions. The method will remove registered events
     * from the window element.
     */
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
