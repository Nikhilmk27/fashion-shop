const mongooose = require('mongoose')
const connnectDB = async () => {
    try {
        await mongooose.connect("mongodb://127.0.0.1:27017/fashionShop")
        console.log("database running successfully")
        
        
    } catch (error) {
        console.error(`mongodb connection error:`,error)
        
    }
}
module.exports = connnectDB