# SimplyFI-Assignment
This project is a web application built using Node.js and a database (MongoDb) to manage student results. It includes models as: a students table with columns for Id, Name, Age, Mark1, Mark2, and Mark3. The application also includes three APIs:

The "/upload" endpoint allows users to upload a CSV file and insert the data into the students table.
The "/students/:id/result" endpoint allows users to retrieve the result of a student by passing in the student's id.
The "/students?resultStatus=passed/failed" endpoint allows users to retrieve all students who have passed or failed by passing in the "resultStatus" querystring.
