
export const runArbitraryMacro = (function() {

    function fetchMaptool(macroName, macroArg){
        return fetch("macro:" + macroName + "@lib:DiceTray", { method: "POST", body: macroArg })
    }

    async function json(MacroName, Args = null){
        if (process.env.NODE_ENV != 'production') {
            console.log("Calling macro: " + MacroName + " with data: ")
            console.log(Args)
            return null
        }
        let macroArg= JSON.stringify(Args)
        let response = await fetchMaptool(MacroName,macroArg)
        try {
            let data = await response.text();
            let parsed;
            parsed = JSON.parse(data)
            return parsed//if theres any
        } catch (error) {
            console.log(`could not parse  jsonserver response for macro ${MacroName} with args ${Args}`);
            throw (error);
        }
    }

    async function jsonNoResponse(MacroName, Args = null){
        if (process.env.NODE_ENV != 'production') {
            console.log("Calling macro: " + MacroName + " with data: ")
            console.log(Args)
            return null
        }
        let macroArg= JSON.stringify(Args)
        await fetchMaptool(MacroName,macroArg)
        return
    }

    async function text(MacroName, Args = null){
        if (process.env.NODE_ENV != 'production') {
            console.log("Calling macro: " + MacroName + " with data: ")
            console.log(Args)
            return null
        }
        let response = await fetchMaptool(MacroName,Args)
        try {
            let data = await response.text();
            return data
        } catch (error) {
            console.log(`could not parse server response for macro ${MacroName} with args ${Args}`);
            throw (error);
        }
    }

    async function textNoResponse(MacroName, Args = null){
        if (process.env.NODE_ENV != 'production') {
            console.log("Calling macro: " + MacroName + " with data: ")
            console.log(Args)
            return null
        }
        fetchMaptool(MacroName,Args)
    }


    return {
        json:json,
        jsonNoResponse:jsonNoResponse,
        text:text,
        textNoResponse:textNoResponse

    }
})()




export const ComFunctions = (function() {
    async function getPlayerData(){
        return runArbitraryMacro.json("getPlayerData")
    }
    async function setPlayerData(data){
        return runArbitraryMacro.jsonNoResponse("setPlayerData",data)
    }
    return {
        getPlayerData: getPlayerData,
        setPlayerData: setPlayerData
    }
})()




