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

        super( style );

        this.nbRows = data.rows;
        this.nbColumns = data.columns;
        this.hSpace = data.hSpace || 0.0;
        this.vSpace = data.vSpace || 0.0;

    }

    refresh( maxWidth, maxHeight ) {

        super.refresh( maxWidth, maxHeight );

        let dimensions = this._dimensions;

        let maxEltWidth = ( dimensions.width ) / this.nbColumns;
        let maxEltHeight = ( dimensions.height ) / this.nbRows;

        let hSpaceRel = this.hSpace * dimensions.width;
        let vSpaceRel = this.vSpace * dimensions.height;

        let maxWidthRel = maxEltWidth - hSpaceRel;
        let maxHeightRel = maxEltHeight - vSpaceRel;

        hSpaceRel /= 2.0;
        vSpaceRel /= 2.0;

        let xOffset = hSpaceRel;
        let yOffset = - vSpaceRel;
        for ( let i = 0; i < this._elements.length; ++i ) {
            let elt = this._elements[ i ];
            elt.refresh( maxWidthRel, maxHeightRel );

            let colIDX = i % this.nbColumns;
            if ( colIDX === 0 && i !== 0 ) {
                xOffset = this.group.position.x + hSpaceRel;
                yOffset -= maxHeightRel + vSpaceRel;
            }

            xOffset += hSpaceRel;

            elt.group.position.x = xOffset;
            elt.group.position.y = yOffset;

            xOffset += maxWidthRel + hSpaceRel;
        }

    }

}
