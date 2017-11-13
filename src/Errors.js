// data Errors =
//      UnknownModule { package :: String, source :: String, name :: String, code :: String }


const UnknownModule = source => name => code =>
    ({package: "sle", kind: "UnknownModule", source, name, code});


module.exports = {
    UnknownModule
};