import { expect } from 'chai';

import VRUI from 'main';
import Element from 'element';

const DEFAULT_PADDING = {
    top: 0.0,
    bottom: 0.0,
    left: 0.0,
    right: 0.0
};
const DEFAULT_MARGIN = {
    top: 0.0,
    bottom: 0.0,
    left: 0.0,
    right: 0.0
};

let tests = () => {

    describe( `Check Style Properties`, () => {

        let layout = new Element();
        let uiDim = { width: 0.5, height: 0.5 };

        let ui = new VRUI( Object.assign({}, uiDim) );
        ui.addPage( layout );

        it( `default data`, () => {
            ui.refresh();
            let dim = layout._dimensions;
            expect( dim ).to.include( { width: 0.5, height: 0.5 } );
            expect( dim.margin ).to.include( DEFAULT_MARGIN );
            expect( dim.padding ).to.include( DEFAULT_PADDING );
            expect( layout._background ).to.be.an.instanceof( THREE.Mesh );
        } );

        it( `width / height`, () => {
            let scale = { width: 0.5, height: 0.25 };
            layout.set( scale );
            layout.refresh();

            expect( layout._dimensions.width ).to.equal( scale.width * uiDim.width );
            expect( layout._dimensions.height ).to.equal( scale.height * uiDim.height );
            expect( layout._background.scale.x ).to.equal( scale.width * uiDim.width );
            expect( layout._background.scale.y ).to.equal( scale.height * uiDim.height );
        } );

    });

};

export default () => {

    describe(`Element`, () => {

        tests();

    });

};
