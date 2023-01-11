const csv = require('csv-parser');                       //Library for streaming CSV data and parsing it into JS objects
const fs = require('fs')                                 //Build in module of Node-JS used for interacting with file system
const studentModel = require('../models/studentModel.js')

//Handler function for uploading the file and writing its content to DB

const fileUpload = async (req, res) => {
    try {
        //Checking the file is present in request object or not and accepts only csv file.
        if (!req.file) return res.status(400).send("No file was provided.");
        if (req.file.mimetype != 'text/csv') return res.status(400).send('You can only upload csv file')

        let items = []
        /*fs.createReadStream==>It is a method from built-in fs module used to create a readable stream for a specified file
        It takes path of the file as its argument and returns readable stream object.

        .pipe(csv({}))-It is a chaining method on the readable stream returned by fs.createreadstream.It basically
        connects the readable stream to writable stream.
        csv()=>It is function from csv-parser that returns a transform stream that is used to parse data from readablestream.
        It parses the transform stream to JS objects where every object is row of csv file and the properties of object
        are contents of the row.

        ON method=> is the event listener which is emitted from the stream to handle the data and after that perform some 
        operations on it.*/

        fs.createReadStream(req.file.path)
            .pipe(csv({}))
            .on('data', (data) => items.push(data))
            .on('end', async () => {
                try {
                    let errors = {};
                    let errorFlag = false;
                    items.forEach((item, index) => {
                        if (!item.Id) {
                            errors[`item ${index}`] = "Id is Required"
                            errorFlag = true;
                        }
                        if (!item.Name) {
                            errors[`item ${index}`] = "Name is Required"
                            errorFlag = true;
                        }
                        if (!item.Age) {
                            errors[`item ${index}`] = "Age is Required"
                            errorFlag = true;
                        }
                        if (!item.Mark1) {
                            errors[`item ${index}`] = "Mark1 is Required"
                            errorFlag = true;
                        }
                        if (!item.Mark2) {
                            errors[`item ${index}`] = "Mark2 is Required"
                            errorFlag = true;
                        }
                        if (!item.Mark3) {
                            errors[`item ${index}`] = "Mark3 is Required"
                            errorFlag = true;
                        }

                    });
                    if (errorFlag) return res.status(400).send({ status: false, message: 'Validation Error', error: errors });

                    for (let i = 0; i < items.length; i++) {
                        let isIdUnique = await studentModel.countDocuments({ Id: items[i].Id });
                        if (isIdUnique) {
                            errors[`item ${i}`] = "Id is Already Taken"
                            errorFlag = true;
                        }
                    }
                    if (errorFlag) return res.status(404).send({ status: false, message: 'Validation Error', error: errors });


                    let saveData = await studentModel.create(items)
                    return res.status(201).send({ status: true, message: 'File uploaded and data created successfully', data: saveData })

                } catch (error) {
                    console.log(error)
                    return res.status(500).send({ status: false, message: error.message })
                }
            })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//This is a handler unction to get the result of the students by their id in path params.

const getResult = async (req, res) => {
    try {
        let Id = req.params.id

        let idExist = await studentModel.findOne({ Id: Id })
        if (idExist) {
            return res.status(200).send({ status: true, message: `Student resut with Id-${Id} fetched successfully`, data: idExist })
        } else {
            return res.status(404).send({ status: false, message: `No student exist with the given Id-${Id}` })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

//This is the handler function to get the list of students passed/failed by query params.

const getResultStatus = async (req, res) => {
    try {
        let { resultStatus } = req.query

        //Sends an erroe if user sends nothing in query params

        if (Object.keys(req.query).length == 0) return res.status(400).send({ status: false, message: `Please enter query details to fetch result` })
        
        //Checks that resultStatus can contain only two values passed or failed.
        
        let arr = ['Passed', 'Failed']
        if (arr.indexOf(resultStatus) == -1) return res.status(400).send({ status: false, message: `Result status can accept only 'Passed' or 'Failed'` })

        const findStudents = await studentModel.find({ resultStatus: resultStatus })
        if (findStudents.length == 0) return res.status(400).send({ status: false, message: `No Student present iN DB` })
        return res.status(200).send({ status: true, message: `Student data for given query fetched successfully`, data: findStudents })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { fileUpload, getResult, getResultStatus }