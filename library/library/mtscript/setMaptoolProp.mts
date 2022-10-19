
[h: args = macro.args]

[h: id = json.get(args,"tokenId")]
[h: MaptoolFunct = json.get(args,"MaptoolFunctionName")]

[h: value = json.get(args,"propertyValue")]

[h, if(MaptoolFunct=="setName"): setName(value,id)]

[h, if(MaptoolFunct=="setSize"): setSize(value,id)]

[h, if(MaptoolFunct=="setGMName"): setGMName(value,id)]

