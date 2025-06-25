const path = require('path');
const multer = require('multer');
const File = require('../models/File');

class FileController {
    async uploadcsv(req, res, next) {
        try {
            const storage = multer.diskStorage({
                destination: "./files/",
                filename: function(req, file, cb){
                cb(null,"csvfile" + path.extname(file.originalname));
                }
            });
            
            const upload = multer({
                storage: storage,
                limits:{fileSize: 10000000},
            }).single('csv');

            upload(req, res, (err) => {
                
                if(err) {
                    console.error('Multer error: ', err);
                    // return res.status(500).json({ error: 'Failed to upload file' });
                }

                const file = new File();
                file.meta_data = req.body;

                file.save().then(()=>{
                    var csv =  require("csvtojson");
                    csv()
                        .fromFile('./files/csvfile.csv')
                        .then(function(jsonArrayObj) {
                    
                            console.log("JSON: ", jsonArrayObj);

                            File.deleteMany({}, (err) => {
                                if(err) {
                                    console.error('Error deleting documents: ', err);
                                }
                                else {
                                    console.log('All exist documents deleted successfully.');
                                }
                            });
                            File.insertMany(jsonArrayObj, (err, result) => {
                                if (err) console.error('Error importing documents: ', err);
                                if (result) {
                                    console.log('Import CSV into Database successfully.'); 
                                    return res.json({msg:"successed"});
                                } 
                            });
                          
                        })
                })
            })
        }catch(e) {
            next(e);
            return res.status(500).json({ error: 'Failed to upload file' });
        }
    }
}

module.exports = new FileController();