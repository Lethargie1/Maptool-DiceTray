export async function runArbitraryMacroJson(MacroName, Args = null) {
    
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

export const messager ={
    postUpdate: (message) => {
        let sentInfo;
        switch(message.action){
            case(messaging.remove):
                sentInfo = makeRemoveMessage(message)
                break
            case(messaging.add):
                sentInfo = makeAddMessage(message)
                break
            case(messaging.clear):
            case(messaging.roll):
                return
            case(messaging.rollResult):
                sentInfo = makeRollResultMessage(message)
                break
            case(messaging.new):
                sentInfo = `New tray was filled for throwing <br> ${formatDiceListHeaderOnly(message.diceList)}`
                break

            default:
                sentInfo = "Received unknown message: "+message.action
        }

        sentInfo= `<table style="border:1px solid black; margin: 0px; padding: 2px"><tr><td>${sentInfo}</td></tr></table>` 


        if (process.env.NODE_ENV != 'production'){
            console.log(sentInfo)
            return null
        
        }
        runArbitraryMacroJson("broadcast",sentInfo)
    }
}

const makeRemoveMessage = (message) => {
    const {target, diceList} = message
    const value = target.rolling ? "was rolling" : `had value ${target.value}`
    const type = target.display ? target.display : `1d${target.maximum}`
    const tray = diceList?.length ? formatDiceListInHtml(diceList) : "Tray empty"
    return `Removed a ${type} which ${value} <br> ${tray}`
}
const makeAddMessage = (message) => {
    const {target, diceList} = message
    const type = target.display ? target.display : `1d${target.maximum}`
    const tray = formatDiceListInHtml(diceList,target)
    return `Added a ${type} <br> ${tray}`
}

const makeRollResultMessage = (message) => {
    const {target, diceList} = message
    const type = target.display ? target.display : `1d${target.maximum}`
    const tray = formatDiceListInHtml(diceList,target)
    return `${type} finished rolling. <br> ${tray}`
}

const formatDiceListInHtml = (diceList, markedDice) =>{
    const wrappedDices = diceList.map(dice => {
        const color = dice.id === markedDice.id ? "bgcolor=aqua" : ""
        return `<table width=40 style="border:1px solid black; margin: 0px; padding: 0px">
                <tr><td bgcolor=yellow style="margin: 0px; padding: 0px">${dice.display}</td></tr>
                <tr><td ${color} align=center valign=middle style="margin: 0px; padding: 0px">${dice.rolling ? "?" : dice.value}</td></tr>
                </table>`
    })
    const trayTotal = diceList.reduce(
        (previousTotal, currentDice) => {
            if(previousTotal === "?" || currentDice.rolling )
                return "?"
            else
            return previousTotal + currentDice.value
        },
        0
    );

    return `<table>
            <tr><td>${wrappedDices.join("</td>")}</td></tr>
            </table> result: ${trayTotal}`
}


const formatDiceListHeaderOnly = (diceList) =>{
    const wrappedDices = diceList.map(dice => {
        return `<table width=40 style="border:1px solid black; margin: 0px; padding: 0px">
                <tr><td bgcolor=yellow style="margin: 0px; padding: 0px">${dice.display}</td></tr>
                </table>`
    })

    return `<table>
            <tr><td>${wrappedDices.join("</td>")}</td></tr>
            </table>`
}



const messaging={
    remove:"remove",
    add:"add",
    roll:"roll",
    rollResult:"rollResult",
    rollAll:"rollAll",
    clear:"clear",
    new:"new"
}