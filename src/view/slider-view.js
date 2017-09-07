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

import ElementView from './element-view';
import * as Colors from '../utils/colors';
import { MaterialFactory, createMaterial } from '../utils/material';
import { PLANE_GEOM } from '../utils/geometry-factory';

import {
    checkAndClone,
    setUndefinedProps,
    IS_INSTANCE_OF
} from '../utils/property-check';

let PROP_TO_CHECK = {
    background: { "data": [THREE.Material, THREE.Texture, `number`], "function": IS_INSTANCE_OF },
    handle: { "data": [THREE.Material, THREE.Texture, `number`], "function": IS_INSTANCE_OF }
};

let MIN_VALUE = 0.0;
let MAX_VALUE = 1.0;

let HANDLE_SCALE_X = 0.1;
let HANDLE_SCALE_Y = 0.8;

export default class SliderView extends ElementView {

    constructor( data, style ) {

        super( new THREE.Group(), style );
        this.type = `slider`;

        this.data = {};
        checkAndClone( data, PROP_TO_CHECK, this.data );
        setUndefinedProps( {
            background: Colors.MARK_CHECKBOX,
            handle: Colors.BACK_CHECKBOX
        }, this.data );

        let backgroundMat = createMaterial( this.data.background, MaterialFactory.BACK_SLIDER );
        let handleMat = createMaterial( this.data.handle, MaterialFactory.HANDLE_SLIDER );

        // Checkbox background texture.
        this.backgroundMesh = new THREE.Mesh( PLANE_GEOM, backgroundMat );
        this.backgroundMesh.scale.y = 0.5;
        this.backgroundMesh.position.z = 0.0005;

        // Checkmark texture, not visible by default;
        this.handleMesh = new THREE.Mesh( PLANE_GEOM, handleMat );
        this.handleMesh.position.z = 0.0008;
        this.handleMesh.scale.x = HANDLE_SCALE_X;
        this.handleMesh.scale.y = HANDLE_SCALE_Y;

        this.mesh.add( this.backgroundMesh );
        this.mesh.add( this.handleMesh );

        // The slider is bounded by the 'min' and 'max' value.
        // In addition to this, it uses a 'step' attribute to increase
        // it's value relatively.
        this._min = MIN_VALUE;
        this._max = MAX_VALUE;
        this._value = ( this._max - this._min ) / 2.0;

        this._onHoverEnter = null;
        this._onHoverExit = null;

    }

    setValue( value ) {

        if ( value < this._min || value > this._max ) {
            let warnMsg = `value not set because it is out of bounds`;
            console.warn( `SliderView.setValue() ` + warnMsg );
            return this;
        }

        this._value = value;

        let range = this._max - this._min;
        this.handleMesh.position.x = ( ( value - this._min ) / range ) - 0.5;

        return this;

    }

    bounds( min, max ) {

        this._min = min || MIN_VALUE;
        this._max = max || MAX_VALUE;

        return this;

    }

    _intersect( raycaster, state ) {

        if ( !this._checkHover( raycaster, this.backgroundMesh,
            this._onHoverEnter, this._onHoverExit ) ) {
            return false;
        }

        if ( state.pressed ) {
            let point = this._lastIntersect;
            this.handleMesh.position.x = point.uv.x - 0.5;

            let value = point.uv.x;
            this._value = value * ( this._max - this._min ) + this._min;

            if ( this._onChange ) {
                this._onChange( this, {
                    pressed: this.pressed,
                    value: this._value
                } );
            }
            if ( this.listenTo )
                this.listenTo.object[ this.listenTo.propID ] = this._value;
        }

        return true;

    }

}
