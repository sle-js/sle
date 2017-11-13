// data Errors =
//      UnknownModule { package :: String, source :: String, name :: String }


const UnknownModule = source => name =>
    ({package: "sle", kind: "UnknownModule", source, name});


module.exports = {
    UnknownModule
};