const config = require('config');

module.exports = function(){
    if(!config.get('jwtPrivateKey')){
        throw new Error('FATALL ERRORR: jwtPrivateKey is not defined');
    }
}