

[h: ids = getSelected('json')]
[h: len = json.length(ids)]
[h: first = json.get(ids,0)]

[h: runJsFunction("Monster sheet", "frame", "window.comm.ChangeTokenId", "null", json.append("[]", first))]
