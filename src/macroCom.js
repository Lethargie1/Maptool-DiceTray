export async function runArbitraryMacroJson(MacroName, Args = null) {
    if (process.env.NODE_ENV != 'production'){
        console.log("called a macro called " + MacroName)
        console.log(Args)
        return null

    }
    let response = await fetch("macro:" + MacroName + "@lib:DiceTray", { method: "POST", body: Args })
    try {
        let data = await response.text();
        let parsed;
        try {
            parsed = JSON.parse(data)
        } catch (e) {
            parsed = data
        }
        return parsed//if theres any
    } catch (error) {
        console.log(`could not parse server response for macro ${MacroName} with args ${Args}`);
        throw (error);
    }

}
export async function runArbitraryMacro(MacroName, Args = null) {
    try {
        let response = await fetch("macro:" + MacroName + "@lib:DiceTray", { method: "POST", body: JSON.stringify(Args) })
        let data = await response.text()
        return data //if theres any
    } catch (error) {
        console.log("no answer from server or " +error)
    }

}