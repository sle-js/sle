const String = mrequire("core:Native.Data.String:1.0.0");


String.takeWhile = p => s => {
    let i = 0;

    while(i < s.length) {
        if (p(s.charCodeAt(i))) {
            i += 1;
        } else {
            return s.substring(0, i);
        }
    }

    return s;
};


module.exports = String;