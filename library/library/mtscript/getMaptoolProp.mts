
[h: args = macro.args]

[h: id = json.get(args,"tokenId")]
[h: MaptoolFunct = json.get(args,"MaptoolFunctionName")]



[h, if(MaptoolFunct=="getName"): value = getName(id)]

[h: return(0,value)]

[h, if(MaptoolFunct=="getSize"): value = getSize(id)]

[h: return(0,value)]

[h, if(MaptoolFunct=="getGMName"): value = getGMName(id)]

[h: return(0,value)]