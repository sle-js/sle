// data Errors =
//      UnknownModule { package :: String, source :: String, name :: String, code :: String }
//    | UnrecognisedNameFormat { package :: String, source :: String, name :: String }
//    | UnrecognisedHandler { package :: String, source :: String, name :: String, handler :: String, handlers :: Array String }
//    | UnableToRetrievePackage { package :: String, source :: String, message :: String }


const UnknownModule = source => name => code =>
    ({package: "sle", kind: "UnknownModule", source, name, code});


const UnrecognisedNameFormat = source => name =>
    ({package: "sle", kind: "UnrecognisedNameFormat", source, name});


const UnrecognisedHandler = source => name => handler => handlers =>
    ({package: "sle", kind: "UnrecognisedHandler", source, name, handler, handlers});


const UnableToRetrievePackage = source => message =>
    ({package: "sle", kind: "UnableToRetrievePackage", source, message});


module.exports = {
    UnknownModule,
    UnrecognisedHandler,
    UnrecognisedNameFormat,
    UnableToRetrievePackage
};