[h: args = macro.args]

[h: id = json.get(args,"tokenId")]
[h: propName = json.get(args,"propertyName")]
[h: prop = json.get(args,"propertyValue")]
[h: setProperty(propName,prop,id)]
[h: return(0,1)]