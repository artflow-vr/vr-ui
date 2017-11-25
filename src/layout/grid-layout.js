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
        let padRel = dimensions.padding;

        /*
            _dimensions.width_
            |                |
            |  padded_width  |
            |  |__|___|__|   |
            |  |__|___|__|   |
            |  |__|___|__|   |
            |________________|
        */

        let nbRows = this.data.rows;
        let nbColumns = this.data.columns;

        // Computes bounds by adding padding to the whole grid.
        // The new width is the total width witout the padding width,
        // The new height is the total height witout the padding height.
        let paddedWidth = dimensions.width - ( padRel.left + padRel.right );
        let paddedHeight = dimensions.height - ( padRel.top + padRel.bottom );

        // Computes the maximum size occupied by each element,
        // taking padding into account.
        let maxEltWidthPad = paddedWidth / nbColumns;
        let maxEltHeightPad = paddedHeight / nbRows;

        let offset = {
            x: padRel.left - padRel.right,
            y: padRel.top - padRel.bottom
        };

        let initXOffset = offset.x;
        let initYOffset = offset.y;
        let yBase = initYOffset;

        // TODO: Fix positionning with padding not working.
        for ( let i = 0; i < this._elements.length; ++i ) {
            let elt = this._elements[ i ];
            elt.refresh( maxEltWidthPad, maxEltHeightPad );
            let eltDim = elt._dimensions;

            let colIDX = i % nbColumns;
            offset.x = initXOffset + ( i % nbColumns ) * maxEltWidthPad;
            if ( colIDX === 0 && i !== 0 ) {
                offset.x = initXOffset;
                yBase = initYOffset + maxEltHeightPad * ( i / nbColumns );
            }

            switch ( elt.style.position ) {
                case `left`:
                    offset.x += padRel.left;
                    break;
                case `right`:
                    offset.x += maxEltWidthPad - padRel.right - eltDim.width;
                    break;
                case `center`:
                    offset.x += ( maxEltWidthPad * 0.5 ) - eltDim.halfW;
                    break;
            }

            switch ( elt.style.align ) {
                case `top`:
                    offset.y = - yBase;
                    break;
                case `bottom`:
                    offset.y = - maxEltHeightPad + eltDim.height - yBase;
                    break;
                case `center`:
                    offset.y = - ( maxEltHeightPad / 2 ) + eltDim.halfH - yBase;
                    break;
            }

            elt.group.position.x = offset.x;
            elt.group.position.y = offset.y;

            //offset.x += maxEltWidth;
        }

    }

    /**
     * Checks whether the layout is full or not.
     * Note: this function is O(n), because developer can remove elements by
     * hand.
     */
    isFull() {

        return this._elements.length === this.data.columns * this.data.rows;

    }

    clone() {

        return new GridLayout( this.data, this.style );

    }

}
