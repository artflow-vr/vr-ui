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
import { MaterialFactory, createMaterial } from './utils/material';

import { checkAndClone, IS_IN_RANGE, IS_IN_LIST, IS_INSTANCE_OF } from './utils/property-check';

let PROP_TO_CHECK = {
    width: { "data": [0.0, 1.0], "function": IS_IN_RANGE },
    height: { "data": [0.0, 1.0], "function": IS_IN_RANGE },
    aspectRatio: { "data": [0.0, 100.0], "function": IS_IN_RANGE },
    depth: { "data": [0.0, 1.0], "function": IS_IN_RANGE },
    padding: {
        top: { "data": [0.0, 0.49], "function": IS_IN_RANGE },
        bottom: { "data": [0.0, 0.49], "function": IS_IN_RANGE },
        left: { "data": [0.0, 0.49], "function": IS_IN_RANGE },
        right: { "data": [0.0, 0.49], "function": IS_IN_RANGE }
    },
    margin: {
        top: { "data": [0.0, 0.49], "function": IS_IN_RANGE },
        bottom: { "data": [0.0, 0.49], "function": IS_IN_RANGE },
        left: { "data": [0.0, 0.49], "function": IS_IN_RANGE },
        right: { "data": [0.0, 0.49], "function": IS_IN_RANGE }
    },
    position: { "data": [`left`, `right`, `center`], "function": IS_IN_LIST },
    align: { "data": [`top`, `bottom`, `center`], "function": IS_IN_LIST },
    background: { "data": [THREE.Material, THREE.Texture, `number`], "function": IS_INSTANCE_OF }
};

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
     * Creates an instance of Element. An element can be added to any layout.
     *
     * @param {Object} [style] - Style properties. e.g: { width: 1.0, ... }
     * @memberof Element
     */
    constructor( data = null, style ) {

        // The 'type' variable is useful to make some special checks
        // according to the element we are in. It avoids to make call
        // to instance of.
        this.type = `element`;

        // The 'data' attribute is useful to store extra data for any type of
        // element. For instance, the `id' attribute is used when searching
        // for a given item in the hierarchy.
        this.data = data ? Object.assign( {}, data ) : {};

        this.group = new THREE.Group();
        this.group.position.z = 0.001; // prevents z-fighting
        this.group.userData.element = this;

        // Reference to parent.
        this.parent = null;
        this.hover = false;
        this.visible = true;

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
        this._background = new THREE.Mesh( PLANE_GEOM, MaterialFactory.MAT_USELESS );
        this._background.position.z = - 0.001; // prevents z-fighting
        this.group.add( this._background );

        // The below properties store callbacks that will be executed
        // on events. e.g: button is clicked, input is hover the element...
        this._onHoverEnter = null;
        this._onHoverExit = null;
        this._onChange = null;

        this._lastIntersect = null;

        this.style = {};
        if ( style ) this.set( style );

        this._setStyleForUndefined( {
            depth: 0.0,
            padding: { top: 0.0, bottom: 0.0, left: 0.0, right: 0.0 },
            margin: { top: 0.0, bottom: 0.0, left: 0.0, right: 0.0 },
            position: `center`,
            align: `top`,
            background: null
        }, this.style );

        // Custom objects allowing users to save data in element,
        // without interfering with the library internals.
        this.userData = {};

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

        checkAndClone( style, PROP_TO_CHECK, this.style );
        for ( let k in style )
            if ( PROP_TO[ k ] ) this[ PROP_TO[ k ] ]( style[ k ] );

    }

    setVisible( toggle ) {

        this.group.traverse( function ( child ) {

            if ( child instanceof THREE.Object3D ) child.visible = toggle;

        } );

        this.visible = toggle;

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

        if ( !this.visible ) return null;

        let obj = raycaster.intersectObject( object, false );
        if ( obj.length === 0 ) {
            if ( this.hover ) {
                this.hover = false;
                if ( onHoverExit ) {
                    onHoverExit( this, {
                        info: this._lastIntersect
                    } );
                }
            }
            return null;
        }

        this._lastIntersect = obj[ 0 ];
        if ( !this.hover ) {
            if ( onHoverEnter ) {
                onHoverEnter( this, {
                    info: this._lastIntersect
                } );
            }
            this.hover = true;
        }

        return this._lastIntersect;

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
    refresh( maxEltWidth, maxEltHeight ) {

        let maxWidth = maxEltWidth || this._parentDimensions.width;
        let maxHeight = maxEltHeight || this._parentDimensions.height;

        let style = this.style;
        let dimensions = this._dimensions;

        if ( style.aspectRatio && !style.width && !style.height ) {
            style.width = 1.0;
            style.height = 1.0;

            let warnMsg = `aspectRatio provided, but missing`;
            warnMsg = ` width or height properties.`;
            console.warn( `Element.refresh(): ` + warnMsg );
        }

        dimensions.width = null;
        dimensions.height = null;

        // TODO: What should we do if the specified base size is larger
        // than the other one that is allowed?
        if ( style.aspectRatio ) {
            if ( style.width )
                dimensions.height = style.aspectRatio * style.width * maxWidth;
            else
                dimensions.width = style.aspectRatio * style.height * maxHeight;
        }
        dimensions.width = dimensions.width || ( ( style.width || 1.0 ) * maxWidth );
        dimensions.height = dimensions.height || ( ( style.height || 1.0 ) * maxHeight );
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

        background.scale.x = dimensions.width;
        background.scale.y = dimensions.height;

    }

    /**
     * Clones the properties that are commong to each element.
     * For now, this only support the shallow copy.
     * TODO: Support deep copy by using a boolean.
     */
    _clone( dest ) {

        // TODO: add style parameter to clone, to allow to easily change
        // the style of an object when cloning, instead of calling set by hand.

        // Copies callback
        dest.onChange( this._onChange );
        dest.onHoverEnter( this._onHoverEnter );
        dest.onHoverExit( this._onHoverExit );

    }

    _updateBackground( background ) {

        if ( !background ) {
            this._background.material = MaterialFactory.BACK_DEFAULT.clone();
            this._background.material.visible = false;
            return;
        }

        let material = createMaterial( background, MaterialFactory.BACK_DEFAULT );

        this._background.material = material;
        this._background.visible = true;

    }

    _setStyleForUndefined( style, writeTo ) {

        for ( let k in style ) {
            let element = style[ k ];
            if ( element !== null && element !== undefined &&
                 typeof element === `object` ) {
                if ( !element ) {
                    writeTo[ k ] = null;
                    continue;
                }
                if ( !( k in writeTo ) ) writeTo[ k ] = {};
                this._setStyleForUndefined( element, writeTo[ k ] );
            } else if ( !( k in writeTo ) ) {
                writeTo[ k ] = style[ k ];
            }
        }

    }

}
