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

import AbstractLayout from './abstract-layout';

export default class GridLayout extends AbstractLayout {

    constructor( data, style ) {

        if ( !data || !data.rows || !data.columns ) {
            let errorMsg = `data object should at least contains 'columns' `;
            errorMsg += `and 'rows' properties.`;
            throw Error( `GridLayout.ctor(): ` + errorMsg );
        }

        super( data, style );

    }

    refresh( maxWidth, maxHeight ) {

        super.refresh( maxWidth, maxHeight );

        let dimensions = this._dimensions;

        let padRel = {
            top: dimensions.padding.top * dimensions.height,
            bottom: dimensions.padding.bottom * dimensions.height,
            left: dimensions.padding.left * dimensions.width,
            right: dimensions.padding.right * dimensions.width
        };

        /*
            _dimensions.width_
            |                |
            |  padded_width  |
            |  |__|___|__|   |
            |  |__|___|__|   |
            |  |__|___|__|   |
            |________________|
        */

        let nbRows = this.data.nbRows;
        let nbColumns = this.data.nbColumns;
        let hSpace = this.data.hSpace;
        let vSpace = this.data.vSpace;

        // Computes bounds by adding padding to the whole grid.
        // The new width is the total width witout the padding width,
        // The new height is the total height witout the padding height.
        let paddedWidth = dimensions.width - ( padRel.left + padRel.right );
        let paddedHeight = dimensions.height - ( padRel.top + padRel.bottom );

        // Computes the maximum size occupied by each element,
        // without spacing.
        let maxEltWidth = paddedWidth / nbColumns;
        let maxEltHeight = paddedHeight / nbRows;

        // Computes the space between each element, in world units.
        let hSpaceRel = hSpace * paddedWidth;
        let vSpaceRel = vSpace * paddedHeight;

        // Computes the maximum size occupied by each element,
        // in world units.
        let maxWidthRel = maxEltWidth - hSpaceRel;
        let maxHeightRel = maxEltHeight - vSpaceRel;

        hSpaceRel /= 2.0;
        vSpaceRel /= 2.0;

        let offset = {
            x: hSpaceRel + ( dimensions.halfW - paddedWidth * 0.5 )
                                                + padRel.left - padRel.right,
            y: - vSpaceRel - ( dimensions.halfH - paddedHeight * 0.5 )
                                                    + padRel.bottom - padRel.top
        };

        for ( let i = 0; i < this._elements.length; ++i ) {
            let elt = this._elements[ i ];
            elt.refresh( maxWidthRel, maxHeightRel );
            let eltDim = elt._dimensions;

            let colIDX = i % nbColumns;
            if ( colIDX === 0 && i !== 0 ) {
                offset.x = this.group.position.x + hSpaceRel;
                offset.y -= maxHeightRel + vSpaceRel;
            }

            switch ( elt.style.position ) {
                case `right`:
                    elt.group.position.x = maxWidthRel - eltDim.width;
                    break;
                case `center`:
                    elt.group.position.x = ( maxWidthRel / 2.0 ) - eltDim.halfW;
                    break;
            }

            switch ( elt.style.align ) {
                case `bottom`:
                    elt.group.position.y = - maxEltHeight + eltDim.height;
                    break;
                case `center`:
                    elt.group.position.y = - ( maxEltHeight / 2 ) + eltDim.halfH;
                    break;
            }

            offset.x += hSpaceRel;

            elt.group.position.x += offset.x;
            elt.group.position.y += offset.y;

            offset.x += maxWidthRel + hSpaceRel;
        }

    }

    /**
     * Checks whether the layout is full or not.
     * Note: this function is O(n), because developer can remove elements by
     * hand.
     *
     */
    isFull() {

        return this._elements.length === this.data.nbColumns * this.data.nbRows;

    }

    clone() {

        return new GridLayout( this.data, this.style );

    }

}
