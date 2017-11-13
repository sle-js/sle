// data Errors =
//      UnknownModule { package :: String, source :: String, name :: String, code :: String }
//    | UnrecognisedNameFormat { package :: String, source :: String, name :: String }


const UnknownModule = source => name => code =>
    ({package: "sle", kind: "UnknownModule", source, name, code});


const UnrecognisedNameFormat = source => name =>
    ({package: "sle", kind: "UnrecognisedNameFormat", source, name});


module.exports = {
    UnknownModule,
    UnrecognisedNameFormat
};