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
import createText from '../helper/text';

import {
    checkAndClone,
    IS_INSTANCE_OF
} from '../utils/property-check';

let PROP_TO_CHECK = {
    string: { "data": [`string`], "function": IS_INSTANCE_OF },
    color: { "data": [ `number`], "function": IS_INSTANCE_OF }
};

export default class TextView extends ElementView {

    constructor( data, style ) {

        if ( !data || data.string === undefined || data.string === null ) {
            let errorMsg = `provided string is null or undefined.`;
            throw Error( `TextView: ctor(): ` + errorMsg );
        }

        let userData = {};
        checkAndClone( data, PROP_TO_CHECK, userData );

        super( createText( userData.string, userData.color ), style );

        this.data = userData;
        this.type = `text`;
        this.text = this.data.string;

    }

    updateStr( str ) {

        this.text = str;
        this.textMesh.geometry.update( str );

    }

}
