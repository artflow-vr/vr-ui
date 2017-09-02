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
 *
 * Abstract class describing an element: layout, view, ...
 * Contains element-relative options, e.g: width, height, paddingTop...
 *
 * @export
 * @class Element
 */
export default class Element {

    constructor( style ) {

        this.group = new THREE.Group();
        this.group.userData.element = this;

        this._background = new THREE.Mesh( PLANE_GEOM, MAT_USELESS );
        this._background.visible = false;
        this.group.add( this._background );

        this.group.userData.dimensions = {
            maxWidth: 0.0,
            maxHeight: 0.0,
            halfWidth: 0.0,
            halfHeight: 0.0,
            margin: {
                top: 0.0,
                bottom: 0.0,
                left: 0.0,
                right: 0.0
            },
            padding: {
                top: 0.0,
                bottom: 0.0,
                left: 0.0,
                right: 0.0
            }
        };
        this.group.userData.position = {
            x: 0,
            y: 0,
            z: 0
        };

        this.style = {};
        if ( style )
            this.set( style );

        this._setStyleForUndefined( {
            width: 1.0,
            height: 1.0,
            depth: 0.0,
            padding: {
                top: 0.0,
                bottom: 0.0,
                left: 0.0,
                right: 0.0
            },
            margin: {
                top: 0.0,
                bottom: 0.0,
                left: 0.0,
                right: 0.0
            }
        }, this.style );

        this.hover = false;

        this._onHoverEnter = null;
        this._onHoverExit = null;
        this._onChange = null;

    }

    onHoverEnter( callback ) {

        this._onHoverEnter = callback;
        return this;

    }

    onHoverExit( callback ) {

        this._onHoverExit = callback;
        return this;

    }

    onChange( callback ) {

        this._onChange = callback;
        return this;

    }

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
     *
     * Computes bounds, item size, and move them accordingly.
     *
     * @memberof Element
     */
    _refreshLayout( maxWidth, maxHeight ) {

        let dimensions = this.group.userData.dimensions;

        dimensions.maxWidth = this.style.width * maxWidth;
        dimensions.maxHeight = this.style.height * maxHeight;
        dimensions.halfWidth = dimensions.maxWidth / 2.0;
        dimensions.halfHeight = dimensions.maxHeight / 2.0;

        this.group.userData.position.x = dimensions.halfWidth;
        this.group.userData.position.y = - dimensions.halfHeight;

        let margin = this.group.userData.dimensions.margin;
        margin.top = this.style.margin.top * maxHeight;
        margin.bottom = this.style.margin.bottom * maxHeight;
        margin.left = this.style.margin.left * maxWidth;
        margin.right = this.style.margin.right * maxWidth;

        let padding = this.group.userData.dimensions.padding;
        padding.top = this.style.padding.top * maxHeight;
        padding.bottom = this.style.padding.bottom * maxHeight;
        padding.left = this.style.padding.left * maxWidth;
        padding.right = this.style.padding.right * maxWidth;

        let background = this._background;
        if ( background ) {
            background.position.x = this.group.userData.position.x;
            background.position.y = this.group.userData.position.y;
            background.position.z = this.group.userData.position.z;
            background.scale.x = dimensions.maxWidth;
            background.scale.y = dimensions.maxHeight;
        }

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
