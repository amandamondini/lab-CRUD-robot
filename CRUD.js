const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/factory')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))

const readline = require('readline')
const readlineInterface = readline.createInterface(process.stdin, process.stdout)

let killer, serialNumber, date;


function ask(questionText){
    return new Promise((resolve,reject)=> {
        readlineInterface.question(questionText, resolve)
    })
}

    const robotSchema = new mongoose.Schema(
    {
        creatorName: String,
        robotName: String,
        robotColor: String,
        killer: Boolean,
        friend: Boolean,
        serialNumber: Number,
        date: Date
    })
    
const Robot = mongoose.model('robots', robotSchema)

async function start(){
    action = await ask('Welcome to robot factory! What do you want to do? (Create, Read, Update, Delete)\n')


if(action === 'Create'){
    let creatorName = await ask('Who is the creator?\n')
    let robotName = await ask('Designate this robot?\n')
    let robotColor = await ask('What color is this robot?\n')
    let friend = await ask('Is this robot a friend? Enter Y or N\n')

    if(friend.toUpperCase === 'N'){
        friend = false
        killer = true
        console.log('Oh no! A killer robot!')
        serialNumber = await ask('What is the serial number?')
        date = new Date()
    } else {
        friend = true;
        killer = false;
        serialNumber = await ask('What is the serial number?')
        date = new Date()
    }
// create new robot instance

const response = new Robot({
    creatorName: creatorName,
    robotName: robotName,
    robotColor: robotColor,
    friend: friend || null,
    killer: killer || null,
    serialNumber: serialNumber,
    date: date,
})

// save new robot 
await response.save();
console.log('Your robot has been created!')

} else if(action === 'read'){
    let allRobots = await Robot.find({})
    console.log(allRobots)
} else if(action === 'update'){
    let allRobots = await Robot.find({})
    console.log(allRobots)
    let updateTarget = await ask('What is the ID of the robot you want to update?   ')
    let updateField = await ask('What field do you want to update?   ')
    let update = await ask('Enter a new value   ')
    await Robot.updateOne({ _id: updateTarget }, { $set: { [updateField]: update } })
    console.log('Your robot has been updated!')

} else if(action === 'delete'){
    let allRobots = await Robot.find({})
    console.log(allRobots)
    let target = await ask('what is the ID of the entry do you want to delete?   ')
    await Robot.deleteOne({ _id: target })
    console.log('your entry has been deleted')  

} else {
    console.log('invalid entry, try again')
}
process.exit()
}
start()
