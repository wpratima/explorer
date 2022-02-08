const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    name: String,
    description: String,
    startDate: {
        type: Date,
        default: () => Date.now()
    },
    endDate: {
        type: Date,
        default: () => Date.now()
    },
    createdBy: mongoose.Types.ObjectId
})

module.exports = mongoose.model('Project', projectSchema)