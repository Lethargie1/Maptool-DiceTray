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
        messageQueue.push(message)
        if(!pendingTimeout){
            pendingTimeout = setTimeout(() => {
                clearQueue()
                pendingTimeout=null
            }, 2500);
        }
    }
        
}

const makeRemoveMessage = (message) => {
    const {target, diceList} = message
    const value = target.rolling ? "was rolling" : `had value ${target.value}`
    const type = target.display ? target.display : `1d${target.maximum}`
    return `Removed a ${type} which ${value}`
}
const makeAddMessage = (message) => {
    const {target, diceList} = message
    const type = target.display ? target.display : `1d${target.maximum}`
    return `Added a ${type}`
}

const makeRollResultMessage = (message) => {
    const {target, diceList} = message
    const type = target.display ? target.display : `1d${target.maximum}`
    return `${type} finished rolling.`
}

const formatDiceListInHtml = (diceList, markedDice=null) =>{
    const wrappedDices = diceList.map(dice => {
        const color = dice.id === markedDice?.id ? "bgcolor=aqua" : ""
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

let pendingTimeout = null
let messageQueue = []
  
  
function clearQueue(){
    sendAQueue(messageQueue)
    messageQueue=[]
    return
}

async function sendAQueue(queue){
    let sentInfo=""
    const targeted=[]
    queue.forEach(message => {
        switch(message.action){
            case(messaging.remove):
                sentInfo+= makeRemoveMessage(message)
                break
            case(messaging.add):
                sentInfo+= makeAddMessage(message)
                break
            case(messaging.clear):
            case(messaging.roll):
                return
            case(messaging.rollResult):
                sentInfo+= makeRollResultMessage(message)
                break
            case(messaging.new):
                sentInfo+= `New tray was filled for throwing <br> ${formatDiceListHeaderOnly(message.diceList)}`
                break
            default:
                sentInfo = "Received unknown message: "+message.action  
        }
        message.target != null ? targeted.push(message.target) : false
    });
    const lastmessage = queue.pop()
    const tray = lastmessage?.diceList?.length ? formatDiceListInHtml(lastmessage.diceList) : "Tray empty"


    sentInfo= `<table style="border:1px solid black; margin: 0px; padding: 2px">
                <tr><td>${sentInfo}</td></tr>
                <tr><td>${tray}</td></tr>
                </table>` 
    if (process.env.NODE_ENV != 'production'){
        console.log(sentInfo)
        return null
    
    }
    runArbitraryMacroJson("broadcast",sentInfo)
}