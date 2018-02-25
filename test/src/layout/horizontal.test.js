import { expect } from 'chai';

import VRUI from 'main';
import Element from 'element';
import HorizontalLayout from 'layout/horizontal-layout';

let tests = () => {

    describe(`Multiple Add`, () => {

        let uiDim = { width: 0.5, height: 0.75 };

        it(`array-based`, () => {
            let layout = new HorizontalLayout();
            let ui = new VRUI( Object.assign({}, uiDim) );
            ui.addPage( layout );

            const nbElt = 5;
            let arr = new Array( nbElt );
            for (let i = 0; i < nbElt; ++i)
                arr[i] = new Element( null, { width: 1.0 / nbElt } );

            layout.add( arr );
            layout.refresh();

            expect( layout._elements.length, 'wrong nb of elements' ).to.equal( nbElt );
            expect( layout.isFull(), 'layout should be full' ).to.equal( true );
        });

        it(`variadic-based`, () => {
            let layout = new HorizontalLayout();
            let ui = new VRUI( Object.assign({}, uiDim) );
            ui.addPage( layout );
            ui.refresh();

            const nbElt = 3;
            let eltA = new Element( null, { width: 1.0 / nbElt } );
            let eltB = new Element( null, { width: 1.0 / nbElt } );
            let eltC = new Element( null, { width: 1.0 / nbElt } );

            layout.add( eltA, eltB, eltC );
            layout.refresh();

            expect( layout._elements.length, 'wrong nb of elements' ).to.equal( nbElt );
            expect( layout.isFull(), 'layout should be full' ).to.equal( true );
        });

    });

    describe(`Default Style`, () => {

        let layout = new HorizontalLayout();

        let uiDim = { width: 0.5, height: 0.75 };
        let ui = new VRUI( Object.assign({}, uiDim) );
        ui.addPage( layout );
        ui.refresh();

        it(`add default element`, () => {
            let elt = new Element();
            layout.add( elt );
            layout.refresh();

            expect( elt._dimensions.width ).to.equal( uiDim.width );
            expect( elt._dimensions.height ).to.equal( uiDim.height );
        });

        // TODO: add several test checking item position, size, etc...

    });

    describe(`Styled Layout`, () => {

        // TODO: add several test checking item position, size, etc...
        // The HorizontalLayout should also be styled (margins, padding, etc...)

    });

};

export default () => {

    describe( `Layout`, () => {

        describe( `HorizontalLayout`, () => {

            tests();

        });

    } );

};
