let OBJ_CTOR = {}.constructor;

let compareObj = ( a, b ) => {

    if ( Object.keys( a ).length !== Object.keys( b ).length ) return false;

    let result = true;
    let val = null;
    for ( let k in a ) {
        if ( !( k in b ) ) return false;

        val = a[ k ];
        if ( val && val.constructor === OBJ_CTOR )
            result = result && compareObj( val, b[ k ] );
        else if ( val !== b[ k ] ) return false;
    }
    return result;

};

export { compareObj };
