let Mocha = require( `mocha` );

let mocha = new Mocha();

mocha.addFile( `build/tests.js` );
mocha.run();
