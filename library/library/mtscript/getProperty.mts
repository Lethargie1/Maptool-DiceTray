[h: args = macro.args]
[h: id = json.get(args,"tokenId")]
[h: assert(id!="", "TokenId must be set", 0) ]
[h: propName = json.get(args,"propertyName")]
[h: prop = getProperty(propName,id)]

[h: return(0,prop)]