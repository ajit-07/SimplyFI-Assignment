const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    Id: {
        type: Number,
        required: true,
        unique: true
    },
    Name: {
        type: String,
        required: true
    },
    Age: {
        type: Number,
        required: true
    },
    Mark1: {
        type: Number,
        required: true
    },
    Mark2: {
        type: Number,
        required: true
    },
    Mark3: {
        type: Number,
        required: true
    },
    totalMarks: Number,
    resultStatus: String
}, { timestamps: true })

studentSchema.pre('save', function (next) {
    this.totalMarks = this.Mark1 + this.Mark2 + this.Mark3;
    let avg = this.totalMarks / 3;
    if (avg >= 40) {
        this.resultStatus = 'Passed';
    } else {
        this.resultStatus = 'Failed';
    }
    next();
});


module.exports = mongoose.model('student', studentSchema)