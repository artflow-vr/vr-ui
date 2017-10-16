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
    check: { "data": [THREE.Material, THREE.Texture, `number`], "function": IS_INSTANCE_OF },
    empty: { "data": [THREE.Material, THREE.Texture, `number`], "function": IS_INSTANCE_OF }
};

export default class CheckboxView extends ElementView {

    constructor( data, style ) {

        super( new THREE.Group(), style );
        this.type = `checkbox`;

        this.data = {};
        checkAndClone( data, PROP_TO_CHECK, this.data );
        setUndefinedProps( {
            check: Colors.MARK_CHECKBOX,
            empty: Colors.BACK_CHECKBOX
        }, this.data );

        let emptyMat = createMaterial( this.data.empty, MaterialFactory.BACK_SLIDER );
        let checkMat = createMaterial( this.data.check, MaterialFactory.IMAGE_DEFAULT );

        // Checkbox background texture.
        this.emptyMesh = new THREE.Mesh( PLANE_GEOM, emptyMat );
        this.emptyMesh.position.z = 0.0005;

        // Checkmark texture, not visible by default;
        this.checkMesh = new THREE.Mesh( PLANE_GEOM, checkMat );
        this.checkMesh.position.z = 0.0008;
        this.checkMesh.material.visible = false;

        this.mesh.add( this.emptyMesh );
        this.mesh.add( this.checkMesh );

        this.checked = false;

        this._onHoverEnter = ( object ) => {

            object.emptyMesh.material.color.setHex( Colors.HIGHLIGHT );
            object.checkMesh.material.color.setHex( Colors.HIGHLIGHT );

        };
        this._onHoverExit = ( object ) => {

            object.emptyMesh.material.color.setHex( Colors.WHITE );
            object.checkMesh.material.color.setHex( Colors.WHITE );

        };

    }

    _intersect( raycaster, state ) {

        if ( !state.pressed && this.pressed ) {
            this.pressed = false;
            if ( this._onChange ) {
                this._onChange( this, {
                    pressed: this.pressed,
                    state: this.checked
                } );
                this.checked = !this.checked;
                this.checkMesh.material.visible = this.checked;
                if ( this.listenTo )
                    this.listenTo.object[ this.listenTo.propID ] = this.checked;
            }
        }

        let intersectionDist = this._checkHover( raycaster, this.emptyMesh,
            this._onHoverEnter, this._onHoverExit );

        if ( !intersectionDist ) return null;

        this.pressed = state.pressed && !this.pressed;
        return intersectionDist;

    }

}
