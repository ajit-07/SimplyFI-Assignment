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

/*It is a mongoose pre-save middleware function which basically helps to calculate total marks and save result status 
according to the criteria mentioned before saving the document.
After calculating it calls the next middleware function to call the next function in save process.*/

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