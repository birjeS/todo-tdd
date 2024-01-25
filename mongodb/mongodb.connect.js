const mongoose = require ("mongoose")

async function connect() {
    try {
        await mongoose.connect(
            "mongodb://local:qwerty@localhost:27017/tests?authSource=admin",
            {useNewUrlParser: true}
        )
    } catch (error) {
        console.log('Error connectingon to mongoDB')
        console.log(error)
    }
}

module.exports = { connect }