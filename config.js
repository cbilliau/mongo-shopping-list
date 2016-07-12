// Define url variable
var mlabUrl = 'mongodb://user1:abc123@ds033865.mlab.com:33865/cbilliaudata';



exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       process.env.NODE_ENV === 'production' ?
                            'mongodb://localhost/shopping-list' :
                            mlabUrl;
exports.PORT = process.env.PORT || 8080;
