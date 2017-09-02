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

import { PLANE_GEOM } from './utils/geometry-factory';
import { BACK_DEFAULT, MAT_USELESS } from './utils/material-factory';

import checkProperty from './utils/property-check';

const PROP_TO = {
    background: `_updateBackground`
};

/**
 * Abstract class describing an element: layout, view, ...
 * Contains element-relative options, e.g: width, height, paddingTop...
 *
 * @export
 * @class Element
 */
export default class Element {

    /**
     * Creates an instance of Element. An elment can be added to any layout.
     *
     * @param {Object} [style] - Style properties. e.g: { width: 1.0, ... }
     * @memberof Element
     */
    constructor( style ) {

        this.group = new THREE.Group();
        this.group.userData.element = this;

        this.hover = false;

        this._dimensions = {
            margin: {},
            padding: {}
        };

        // Reference to parent dimensions. This element is really important.
        // It should be set when the element is added in the hierarchy.
        // It is gross but allows the _refreshLayout method to be
        // parameter free, and so to update only part of the UI at a time.
        this._parentDimensions = null;

        // Creates the background of the element. By default, the background
        // is invisible and is only used to check intersection.
        this._background = new THREE.Mesh( PLANE_GEOM, MAT_USELESS );
        this._background.visible = false;
        this.group.add( this._background );

        // The below properties store callbacks that will be executed
        // on events. e.g: button is clicked, input is hover the element...
        this._onHoverEnter = null;
        this._onHoverExit = null;
        this._onChange = null;

        this.style = {};
        if ( style ) this.set( style );

        this._setStyleForUndefined( {
            width: 1.0,
            height: 1.0,
            depth: 0.0,
            padding: { top: 0.0, bottom: 0.0, left: 0.0, right: 0.0 },
            margin: { top: 0.0, bottom: 0.0, left: 0.0, right: 0.0 }
        }, this.style );

    }

    /**
     * Adds callback triggered when input is hover the element.
     *
     * @param {function} callback - callback to trigger when event is called.
     * @returns this instance, allowing to chain the calls.
     * @memberof Element
     */
    onHoverEnter( callback ) {

        this._onHoverEnter = callback;
        return this;

    }

    /**
     * Adds callback triggered when input is not anymore hover the element.
     *
     * @param {function} callback - callback to trigger when event is called.
     * @returns this instance, allowing to chain the calls.
     * @memberof Element
     */
    onHoverExit( callback ) {

        this._onHoverExit = callback;
        return this;

    }

    /**
     * Adds callback triggered when element is changed. Depending on the view,
     * the onChange callback is not triggered with the same data.
     * e.g: ButtonView are triggered with 'pressed' attribute.
     *
     * @param {function} callback - callback to trigger when event is called.
     * @returns this instance, allowing to chain the calls.
     * @memberof Element
     */
    onChange( callback ) {

        this._onChange = callback;
        return this;

    }

    /**
     * Sets the style of the element. e.g: { width: 1.0, etc... }
     *
     * @param {Object} style - Style to apply.
     * @memberof Element
     */
    set( style ) {

        for ( let k in style ) {
            if ( checkProperty( k, style[ k ] ) ) {
                this.style[ k ] = style[ k ];
                if ( PROP_TO[ k ] ) {
                    let methodName = PROP_TO[ k ];
                    this[ methodName ]( style[ k ] );
                }
            }
        }

    }

    /**
     * Checks whether the element is hovered or not. If changes happen,
     * this method will call the onHoverEnter / onHoverExit callbacks.
     *
     * @param {THREE.Raycaster} raycaster - Raycaster with its origin and
     * direction already set.
     * @param {THREE.Mesh} object - Object to check intersection with.
     * @param {function} onHoverEnter - Callback called when input begins
     * to be hover the object.
     * @param {function} onHoverExit - Callback called when input ends to
     * be hover the object.
     * @returns true if the input is hover the element, false otherwise.
     * @memberof Element
     */
    _checkHover( raycaster, object, onHoverEnter, onHoverExit ) {

        let objs = raycaster.intersectObject( object, false );
        if ( objs.length === 0 ) {
            if ( this.hover ) {
                this.hover = false;
                if ( onHoverExit ) onHoverExit();
            }
            return false;
        }

        if ( !this.hover ) {
            if ( onHoverEnter ) onHoverEnter();
            this.hover = true;
        }

        return true;

    }

    /**
     * Computes bounds of the element, as well as its relative position
     * according to its parent bounds & location.
     *
     * @param {number} maxWidth - Maximum width that can use this element, in
     * Three.js units.
     * @param {number} maxHeight - Maximum height that can use this element, in
     * Three.js units.
     * @memberof Element
     */
    refresh() {

        let maxWidth = this._parentDimensions.width;
        let maxHeight = this._parentDimensions.height;

        let dimensions = this._dimensions;

        dimensions.width = this.style.width * maxWidth;
        dimensions.height = this.style.height * maxHeight;
        dimensions.halfW = dimensions.width / 2.0;
        dimensions.halfH = dimensions.height / 2.0;

        let margin = dimensions.margin;
        margin.top = this.style.margin.top * maxHeight;
        margin.bottom = this.style.margin.bottom * maxHeight;
        margin.left = this.style.margin.left * maxWidth;
        margin.right = this.style.margin.right * maxWidth;

        let padding = dimensions.padding;
        padding.top = this.style.padding.top * maxHeight;
        padding.bottom = this.style.padding.bottom * maxHeight;
        padding.left = this.style.padding.left * maxWidth;
        padding.right = this.style.padding.right * maxWidth;

        let background = this._background;
        background.position.x = dimensions.halfW;
        background.position.y = - dimensions.halfH;
        //background.position.z = this.group.userData.position.z;
        background.scale.x = dimensions.width;
        background.scale.y = dimensions.height;

    }

    _updateBackground( background ) {

        let material = ( background.material || BACK_DEFAULT ).clone();

        this._background.material = material;
        this._background.visible = background.visible || true;

    }

    _setStyleForUndefined( style, writeTo ) {

        for ( let k in style ) {
            let element = style[ k ];
            if ( typeof element === `object` ) {
                if ( !( k in writeTo ) ) writeTo[ k ] = {};
                this._setStyleForUndefined( element, writeTo[ k ] );
            } else if ( !( k in writeTo ) ) {
                writeTo[ k ] = style[ k ];
            }
        }

    }

}
