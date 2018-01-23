/* 
 * This is a handy function to create a random printable string
 * Taken from the polyglot developer site.
 * Used by me to create unique urls.
 */
const randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = randomString;
