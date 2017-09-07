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

let IS_IN_RANGE = ( data, propID, value ) => {

    let min = data[ 0 ];
    let max = data[ 1 ];
    if ( value < min || value > max ) {
        let errorMsg = `Element property ${propID} should be in the range `;
        errorMsg += `[${min}, ${max}]`;
        console.error( errorMsg );
        return false;
    }

    return true;

};

let IS_IN_LIST = ( data, propID, value ) => {

    if ( !data.includes( value ) ) {
        let errorMsg = `Element property ${propID} should have one of the `;
        errorMsg += `following values: ` + data.toString();
        console.error( errorMsg );
        return false;
    }

    return true;

};

let IS_INSTANCE_OF = ( data, propID, value ) => {

    if ( !value ) return true;

    for ( let Type of data ) {
        if ( ( Type === `number` && !isNaN( value ) ) || value instanceof Type )
            return true;
    }

    let errorMsg = `Element property ${propID} does not have the good type `;
    console.error( errorMsg );

    return false;

};

let checkTerminalProp = ( obj, expected, propID ) => {

    let callback = expected[ propID ].function;
    let data = expected[ propID ].data;

    if ( !callback( data, propID, obj[ propID ] ) ) return false;

    return true;

};

let OBJ_CTOR = {}.constructor;

let checkAndClone = ( obj, expected, result ) => {

    for ( let k in obj ) {
        let val = expected[ k ];
        if ( !val ) {
            let warnMsg = `property ${k} is not recognized. Please take a `;
            warnMsg += `look at the documentation to see the complete set.`;
            console.warn( `check(): ` + warnMsg );
            continue;
        }
        if ( obj[ k ] && obj[ k ].constructor === OBJ_CTOR ) {
            if ( !result[ k ] ) result[ k ] = {};
            checkAndClone( obj[ k ], expected[ k ], result[ k ] );
            continue;
        }

        if ( !checkTerminalProp( obj, expected, k ) ) continue;

        result[ k ] = obj[ k ];
    }

};

let setUndefinedProps = ( obj, result ) => {

    for ( let k in obj ) {
        let val = obj[ k ];
        if ( !result[ k ] && val && val.constructor === OBJ_CTOR )
            result[ k ] = {};

        if ( val && val.constructor === OBJ_CTOR ) {
            setUndefinedProps( val, result[ k ] );
            continue;
        }
        if ( !result[ k ] ) result[ k ] = obj[ k ];
    }

};

export {
    IS_IN_RANGE,
    IS_IN_LIST,
    IS_INSTANCE_OF,
    checkAndClone,
    setUndefinedProps
};
