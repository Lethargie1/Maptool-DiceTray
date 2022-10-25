import { v4 as uuidv4 } from 'uuid';


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

export const messager2 ={
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
    return `Added a ${type} of ${target.id}`
}
const makeRollMessage = (message) => {
    const {target, diceList} = message
    const type = target.display ? target.display : `1d${target.maximum}`
    return `Rolled a ${type} of ${target.id}`
}
const makeRollResultMessage = (message) => {
    const {target, diceList} = message
    const type = target.display ? target.display : `1d${target.maximum}`
    return `${type} finished rolling result: ${target.value}. of ${target.id}`
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

function groupQueue(queue){
    
    const findIndexOfRollSource = (array, rollMessage) => {
        return array.findIndex(groupMessage => groupMessage.findIndex(m => {
            if (m.action === messaging.new)
                return m.diceList.some(dice => dice.id === rollMessage.target.id)
            if (m.action === messaging.add)
                return m.target.id === rollMessage.target.id
            return false
        }) != -1)
    }

    const findIndexOfResultSource = (array, resultMessage) => {
        return array.findIndex(groupMessage => groupMessage.findIndex(m => {
            if(m.action === messaging.roll)
                return m.target.id === resultMessage.target.id
            return false
        }) != -1)
    }
    const groupedMessages=queue.reduce((prev, current)=>{
        let ind;
        switch (current.action) {
            case messaging.remove:
            case messaging.clear:
            case messaging.add:
            case messaging.new:
                prev.push([current])
                break
            case messaging.roll:
                ind = findIndexOfRollSource(prev,current)
                if (ind != -1)
                    prev[ind].push(current)
                else
                    prev.push([current])
                break
            case messaging.rollResult:
                ind = findIndexOfResultSource(prev,current)
                if (ind != -1)
                    prev[ind].push(current)
                else
                    prev.push([current])
                break
        }
        return prev
    },[])
    return groupedMessages
}

const formatter = (function() {
    function NewGroup(group){
        let NotNew;
        let info = `<table><tr><td>Put entirely new dice in</td></tr>`
        if (group.length>1){
            NotNew = group.slice(1)
            let groupedRoll={}
            let ids=[]
            NotNew.forEach( nnm => {
                if(nnm.target.id in groupedRoll)
                    groupedRoll[nnm.target.id].push(nnm)
                else{
                    groupedRoll[nnm.target.id]=[nnm]
                    ids.push(nnm.target.id)
                }
            })
            ids.forEach(id => info+=`<tr><td>${RollGroup(groupedRoll[id])}</tr></td>`)
        }
        else
           info+="<tr><td>didnt roll them</tr></td>"
        info+="</table>"
        return info
        

    }
    function AddGroup(group){
        switch(group.length){
            case 1:
                return `Added a ${group[0].target.display} but didn't roll it`
            case 2:
                return `Added and ${RollGroup(group[1])}`
            case 3:
                return `Added and ${RollGroup(group.slice(1))}`
            default:
                throw("Add group length violation for formatter")
        }

    }
    function RollGroup(group){
        if(group.length===1)
            return `Rolled a ${group[0].target.display} and kept it rolling`
        else if(group.length===2)
            return `Rolled a ${group[0].target.display} and got a ${group[1].target.value}` 
        throw("Roll group length violation for formatter")
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
        const diceContent = wrappedDices.reduce( (prev, current,i)=>{
            let a = i%8
            let linechanger = i > 0 && (a === 0) ? "</tr><tr>" : ""
            return prev+=`${linechanger}<td>${current}</td>`
        },"") 
        return `<table>
                <tr>${diceContent}</tr>
                </table> result: ${trayTotal}`
    }

    function format(groupedMessage){
        let action ={};
        action[messaging.new] = NewGroup
        action[messaging.add] = AddGroup
        action[messaging.roll]= RollGroup
        action[messaging.remove]= group => `Removed a ${group[0].target.display} with value ${group[0].target.value}`
        action[messaging.clear] = group => `Cleared the tray`
        action[messaging.rollResult] = group => `Received a roll from a ${group[0].target.display} with value ${group[0].target.value}`
        const linedMessages = groupedMessage.reduce((info,currentGroup)=>{
            let line;
            if (currentGroup[0].action in action)
                line=`${action[currentGroup[0].action](currentGroup)}`
            else
                line=`Unhandled action: ${currentGroup[0].action}`
            return `${info}<tr><td>${line}</tr></td>` 
        },"")
        return linedMessages

    }
    return {
        formatGroups:format,
        formatDices: formatDiceListInHtml
    }
})()

async function sendAQueue(queue){

    const groupedMess = groupQueue(queue)
    const lastMess = queue.slice(-1)
    const lastTray = lastMess[0].diceList
    let sentInfo= `<table style="border:1px solid black; margin: 0px; padding: 2px">
                ${formatter.formatGroups(groupedMess)}
                <tr><td>${lastTray?.length ? formatter.formatDices(lastTray) : "empty tray"}</td></tr>
                </table>` 
    if (process.env.NODE_ENV != 'production'){
        console.log(sentInfo)
        return null
    
    }
    runArbitraryMacroJson("broadcast",sentInfo)
}


export const messager = (function () {
    const bufferingTime = 2000
    const rollWaitingTime = 500
    let stopBufferingTimeout = null;
    let currentBuffer = Promise.resolve({
        currentBuffering:{
            messages:[],
            waitingDices:[]
        },
        previousBuffering:[]
    })

    async function logBuffer(id) {
        currentBuffer = currentBuffer.then(
            state => {
                const index = state.previousBuffering.findIndex( x => x.id === id)
                if (index === -1) return state
                const logged = state.previousBuffering.splice(index,1)
                sendAQueue(logged[0].messages)               
                return state
            }
        )
    }

    function stopCurrentBuffering(state) {

        const id = uuidv4()
        state.previousBuffering.push({
            id: id,
            ...state.currentBuffering,
            logTimeout: setTimeout(logBuffer, rollWaitingTime, id)
        })
        state.currentBuffering = {
            messages: [],
            waitingDices: []
        }
        return state
    }


    async function postUpdate(message) {
        console.log("getting message: " + message.action)
        currentBuffer = currentBuffer.then(
            state => {
                state = storeMessage(state, message)
                //we only stack new input for a little while, even after stopping buffering new input, well wait for result
                
                return state
            }
        )
    }

    function storeMessage(buffer, message) {
        const bufferCurrent = () => {
            buffer.currentBuffering.messages.push(message)
            if (stopBufferingTimeout) {
                clearTimeout(stopBufferingTimeout)
            }
            stopBufferingTimeout = setTimeout(() => {
                currentBuffer = currentBuffer.then(stopCurrentBuffering)
                stopBufferingTimeout = null
            }, bufferingTime);
        } 
        
        switch (message.action) {
            case (messaging.roll):
                //a roll means we are waiting for a result
                //we do not allow rolling a dice that was already rolled in the same message
                if (buffer.currentBuffering.waitingDices.includes(message.target.id)){
                    buffer = stopCurrentBuffering(buffer)
                }

                    buffer.currentBuffering.waitingDices.push(message.target.id)
                
                
            case (messaging.add):
            case (messaging.clear):
            case (messaging.remove):
            case (messaging.new):
                bufferCurrent()
                return buffer

            case (messaging.rollResult):
                //if we have a result we have to see if someone was waiting for it
                const id = message.target.id
                let waiting = buffer.previousBuffering.find(x =>
                    x.waitingDices.includes(id)
                )
                if (waiting !== undefined) {
                    waiting.messages.push(message)
                    const index = waiting.waitingDices.findIndex(x => x === id)
                    waiting.waitingDices.splice(index, 1)
                }else{
                    bufferCurrent()
                }
                return buffer
            default:
                return buffer
        }
    }


    return {
        postUpdate: postUpdate
    }

})()

