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

    constructor( columns, rows, style ) {

        if ( !rows || !columns ) {
            let errorMsg = `missing argument 'columns'.or 'rows'`;
            throw Error( `GridLayout.ctor(): ` + errorMsg );
        }

        super( style );

        this.nbRows = rows;
        this.nbColumns = columns;

    }

    _refreshLayout( maxWidth, maxHeight, offset ) {

        super._refreshLayout( maxWidth, maxHeight, offset );

        let dimensions = this.group.userData.dimensions;
        let maxEltWidth = dimensions.maxWidth / this.nbColumns;
        let maxEltHeight = dimensions.maxHeight / this.nbRows;

        let xOffset = this.group.position.x;
        let yOffset = this.group.position.y;
        for ( let i = 0; i < this._elements.length; ++i ) {
            let elt = this._elements[ i ];
            elt._refreshLayout( maxEltWidth, maxEltHeight );

            let colIDX = i % this.nbColumns;
            if ( colIDX === 0 && i !== 0 ) {
                xOffset = this.group.position.x;
                yOffset -= maxEltHeight;
            }
            elt.group.position.x = xOffset;
            elt.group.position.y = yOffset;
            xOffset += maxEltWidth;
        }

    }

}
