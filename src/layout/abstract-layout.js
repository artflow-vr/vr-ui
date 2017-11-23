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

import Element from "../element";

/**
 *
 * Abstract class describing a layout: GridLayout, LinearLayout, ...
 *
 * @export
 * @class AbstractLayout
 */
export default class AbstractLayout extends Element {

    /**
     * Creates an instance of AbstractLayout.
     * @param {Object} [style] - Style properties. e.g: { width: 1.0, ... }
     * @memberof AbstractLayout
     */
    constructor( data, style ) {

        super( data, style );
        this._elements = [];

        this._onHoverExitWrapper = () => {

            if ( this._onHoverExit ) this._onHoverExit( this );

            this._forceExit();

        };

    }

    /**
     * Adds an element to the layout.
     * @param {any} element
     * @memberof AbstractLayout
     */
    add( element ) {

        if ( element === undefined || element === null ) {
            let errorMsg = `provided argument is null or undefined.`;
            throw Error( `AbstractLayout: add(): ` + errorMsg );
        }

        if ( arguments.length > 0 )
            for ( let elt of arguments ) this._addItem( elt );
        else if ( element.constructor === Array )
            for ( let elt of element ) this._addItem( elt );
        else
            this._addItem( element );

    }

    clone( ) {

        // Shallow clone the layout.
        let layout = new this.constructor( this.data, this.style );
        // Deep clone every element of the layout
        for ( let elt of this._elements ) layout.add( elt.clone() );
        return layout;

    }

    _addItem( element ) {

        if ( !( element instanceof Element ) ) {
            let errorMsg = `provided element is not an instance of Element`;
            throw Error( `AbstractLayout: addView(): ` + errorMsg );
        }

        this._elements.push( element );
        // Gross hack allowing to keep a simple _refreshLayout method.
        element._parentDimensions = this._dimensions;
        element.parent = this;

        // Builds Three.js scene graph when building the VRUI custom
        // layouts / views hierarchy.
        this.group.add( element.group );

    }

    _forceExit() {

        if ( !this.hover ) return;

        for ( let elt of this._elements ) {
            if ( elt._forceExit ) {
                elt._forceExit();
                if ( elt._onHoverExit )
                    elt._onHoverExit( elt, { info: null } );
            }
            elt.hover = false;
        }
        this.hover = false;

    }

    /**
     * Checks intersection for all elements in the layout.
     * @param {THREE.Raycaster} raycaster - raycaster with its origin and
     * direction already set.
     * @param {Object} state - Misc data. e.g: mouse pressed, etc...
     * @returns True if an intersection occurs with the layout,
     * false otherwise.
     * @memberof AbstractLayout
     */
    _intersect( raycaster, state ) {

        let intersectionInfo = this._checkHover( raycaster, this._background,
            this._onHoverEnter, this._onHoverExitWrapper );
        if ( !intersectionInfo )
            return null;

        for ( let elt of this._elements ) {
            if ( !elt._intersect( raycaster, state ) ) {
                elt._forceExit();
            }
        }

        return intersectionInfo;

    }

}
