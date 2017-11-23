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
import AbstractLayout from './layout/abstract-layout';

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
     * @param {number} data - Contains data related to every provided pages.
     * - Contains the width, height, in THREE.js units, applied to each page.
     * - Contains the element adding mode. The mode is used if you want to add
     * an element to the whole UI instead of choosing a target page.
     * e.g
     * {
     *     width: 0.5,
     *     height: 0.2,
     *     mode: {
     *         type: VRUI.AUTOMATIC_ADDING,
     *         newPageLayout: new VRUI.layouts.GridLayout(...),
     *         template: new VRUI.layouts.VerticalLayout(...)
     *     }
     * }
     * @memberof VRUI
     */
    constructor( root, data ) {

        if ( !data.width || data.width <= 0 ) {
            let errorMsg = `parent layout should have a width specified `;
            errorMsg += `in Three.js world units, non-negative nor null.`;
            throw new TypeError( `VRUI.ctor(): ` + errorMsg );
        }
        if ( !data.height || data.height <= 0 ) {
            let errorMsg = `parent layout should have a height specified `;
            errorMsg += `in Three.js world units, non-negative nor null.`;
            throw new TypeError( `VRUI.ctor(): ` + errorMsg );
        }

        this.enabled = true;

        this.data = Object.assign( {}, data );
        this.data.width = this.data.width || 0.5;
        this.data.height = this.data.height || 0.5;
        this.data.mode = this.data.mode || { type: VRUI.AUTOMATIC_ADDING };
        this.data.mode.type = this.data.mode.type || VRUI.AUTOMATIC_ADDING;

        this.inputObject = null;

        // Creates the page system. In VRUI, a UI can only show one page at a
        // time, let's say it is a flyer :P. However, if you want several
        // UI to be accessible at the same time, don't worry, you can just
        // instanciate a new VRUI :).
        this.pages = [];
        this.pageGroup = new THREE.Group();
        this._pageId = 0;
        if ( root !== undefined && root !== null ) this.addPage( root );

        // This is just a really tiny optimization to avoid using the index
        // each time we need to access the currPage.
        this.currPage = this.pages[ this._pageId ];

        this._raycaster = new THREE.Raycaster(
            new THREE.Vector3(), new THREE.Vector3()
        );
        this._controllerRotation = new THREE.Matrix4();

        this._mouse = {
            coords: new THREE.Vector2( -1.0, -1.0 ),
            enabled: false, camera: null, renderer: null, down: null,
            up: null, move: null
        };

        this._state = { pressed: false };
        this._forcePressed = false;

        this._update = this._updateVR;

    }

    /**
     *
     * Updates the UI. This method takes care of checking intersection and
     * forwarding the events.
     *
     * @memberof VRUI
     */
    update() {

        if ( !this.enabled ) return null;

        return this._update();

    }

    /**
     * Recursively computes bounds of each element in the UI.
     *
     * This function will compute the dimensions of the elements, as well
     * as their position relative to the layout they are in.
     */
    refresh() {

        for ( let elt of this.pages ) elt.refresh();

    }

    /**
     * Adds an item to one of the pages, depending on the mode used when creating
     * the UI.
     * If you do not want to use one of the provided mode, you can build your
     * pages by yourself and just create the UI. Our goal is to make everything
     * possible with VRUI! (Okay, it does not work everytime :P)
     *
     * @param {VRUI.Element} element - elements to add, could be any VRUI.Element,
     * so any layout, any button, etc...
     * * @param {VRUI.AbstractLayout} layout - target layout. This will often be
     * empty, but can be useful if you do not want your item to be added in the
     * parent element of the page.
     * For instance, if you have a Vertical Layout containing a Grid Layout as
     * well as an Horizontal Layout, you may want to only add
     */
    add( layoutID = null, element ) {

        if ( element.constructor === Array ) {
            for ( let elt of element ) this._add( elt, layoutID );
        } else if ( arguments.length > 1 ) {
            for ( let i = 1; i < arguments.length; ++i )
                this._add( arguments[ i ], layoutID );
        } else {
            this._add( element,layoutID );
        }

    }

    _add( element, layoutID ) {

        if ( !( element instanceof Element ) ) {
            let errorMsg = `the provided element is neither an instance of `;
            errorMsg += `VRUI.Element, nor an array of VRUI.Element.`;
            throw new TypeError( `VRUI.add(): ` + errorMsg );
        }

        // Automatic adding: push elements until the page is full. Whenever
        // it is full, a new page is created by cloning the previous one.
        let modeType = this.data.mode.type;
        switch ( modeType ) {
            case VRUI.AUTOMATIC_ADDING:
                this._addWithExpansion( element, layoutID );
                break;
            default:
                let warnMsg = `unrecognized mode '` + modeType + `'`;
                console.warn( `VRUI.add(): ` + warnMsg );
                break;
        }

    }

    /**
     * Adds a page to the UI. The page will be added using a push back, and this
     * function will not affect the current page.
     *
     * @param {Array[VRUI.Element] | VRUI.Element} page - New page to add in UI.
     * @param {Object} dimensions - Contains width and height of the page. If
     * this is not specified, or one of the dimension is null or undefined, the
     * function will use the initial dimensions given to the constructor of VRUI.
     */
    addPage( page, dimensions ) {

        let data = this.data;

        let dim = dimensions || { width: data.width, height: data.height };
        dim.width = dim.width || data.width;
        dim.height = dim.height || data.height;

        if ( !( page instanceof Element ) ) {
            let errorMsg = `Page should be provided a VRUI.Element or a`;
            throw new TypeError( `VRUI.addPage(): ` + errorMsg );
        }

        this.pages.push( page );
        this.pageGroup.add( page.group );

        page.parent = null;
        page._parentDimensions = {
            width: dim.width,
            height: dim.height
        };

        page.group.position.x = - dim.width * 0.5;
        page.group.position.y = dim.height * 0.5;

        // We hide the added page by default, excepted if the UI is empty
        if ( this.pages.length !== 1 )
            page.setVisible( false );
        else
            page.setVisible( true );
    }

    nextPage() {

        this._pageId = ( this._pageId + 1 ) % this.pages.length;
        // Hides previous page
        this.currPage.setVisible( false );
        // TODO: Adds transition function chosen by the developer.
        this.currPage = this.pages[ this._pageId ];
        // Show next page
        this.currPage.setVisible( true );

    }

    prevPage() {

        this._pageId = ( this._pageId - 1 ) % this.pages.length;
        // Hides previous page
        this.currPage.setVisible( false );
        // TODO: Adds transition function chosen by the developer.
        this.currPage = this.pages[ this._pageId ];
        // Show next page
        this.currPage.setVisible( true );

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

        scene.add( this.pageGroup );

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

        this._update = this._updateMouse;

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

        this._update = this._updateVR;

    }

    addInput( object ) {

        if ( !( object instanceof THREE.Object3D ) ) {
            let errorMsg = `input object is not a THREE.Object3D instance.`;
            throw Error( `VRUI.addInput(): ` + errorMsg );
        }

        this.inputObject = object;

    }

    setPressed( trigger ) {

        if ( this._mouse.enabled ) {
            let warnMsg = `this method only works with input object.`;
            console.warn( `VRUI.setPressed(): ` + warnMsg );
            return;
        }
        this._forcePressed = trigger;

    }

    _updateMouse() {

        this._raycaster.setFromCamera( this._mouse.coords, this._mouse.camera );
        return this.currPage._intersect( this._raycaster, this._state );

    }

    _updateVR() {

        if ( !this.inputObject ) return null;

        this._state.pressed = this.inputObject.userData.vrui.pressed
                            || this._forcePressed;

        this._controllerRotation.identity().extractRotation(
            this.inputObject.matrixWorld
        );

        this._raycaster.ray.origin.setFromMatrixPosition(
            this.inputObject.matrixWorld
        );
        this._raycaster.ray.direction.set( 0, 0, -1 ).applyMatrix4(
            this._controllerRotation
        );

        return this.currPage._intersect( this._raycaster, this._state );

    }

    _addWithExpansion( element, layoutID ) {

        let template = this.data.mode.template;
        let lastPage = this.pages[ this.pages.length - 1 ];

        if ( !template ) {
            let errorMsg = `adding element is in automatic mode, but `;
            errorMsg += `no page template was provided.`;
            throw Error( `VRUI.add(): ` + errorMsg );
        }

        if ( !( template instanceof AbstractLayout ) ) {
            let errorMsg = `provided template should be an instance of `;
            errorMsg += `VRUI.AbstractLayout.`;
            throw Error( `VRUI.add(): ` + errorMsg );
        }

        let targetLayout = lastPage;
        if ( !( targetLayout instanceof AbstractLayout ) || targetLayout.isFull() ) {
            targetLayout = template.clone();
            this.addPage( targetLayout );
        }

        if ( !layoutID ) {
            targetLayout.add( element );
            return;
        }

        // 'layoutID' is not null, we have to loop through every elements
        // looking for the layout in which we should add the element.
        let visited = [];
        for ( let elt of targetLayout._elements ) visited.push( elt );
        while ( visited.length > 0 ) {
            let elt = visited.shift();
            // The element has been found
            if ( elt.id === layoutID ) {
                if ( !( elt instanceof AbstractLayout ) ) {
                    let errorMsg = `provided layoutID should be an instance of `;
                    errorMsg += `VRUI.AbstractLayout.`;
                    throw Error( `VRUI.add(): ` + errorMsg );
                }
                elt.add( element );
                return;
            }
        }

        // The given 'layoutID' was not found. We have to warn the user.
        let warnMsg = `given layoutID '` + layoutID + `' was not found.`;
        console.warn( `VRUI.add(): ` + warnMsg );

    }

}

VRUI.AUTOMATIC_ADDING = 0x0;
