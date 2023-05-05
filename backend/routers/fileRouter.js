import Router from "express";
import multer from 'multer'
import fs from 'fs'
import fs_mover from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url';
import multiparty from 'multiparty'
import { User } from "../models/userModel.js";
const app = Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
app.post('/upload', function (req, res, next) {
 
    var form_data = new multiparty.Form();
    form_data.parse(req, function(err, fields, files) {

      try{
            var fileName = fields['name'][0] + '.jpg'
            var file = files[0]
            var sourcePath = files.files[0].path
            
            const directoryPath = path.join(__dirname, '../data/banner');
            var  destpath = directoryPath + '/' + fileName;
            
            fs.exists(destpath, function(exists) {
              if(exists) {
                //Show in green
                fs.unlinkSync(destpath);
                
                fs_mover.move(sourcePath, destpath, function (err) {
                    if (err) return console.error(err)
                    res.end("success");
                });

              } else {

                    fs_mover.move(sourcePath, destpath, function (err) {
                    if (err) return console.error(err)
                    res.end("success");
                    });
              }
            });

      }catch(err){
        console.log(err)
        res.end("failed")
      }

    });

})
app.post('/upload_profile', function (req, res, next) {
 


    var form_data = new multiparty.Form();
    form_data.parse(req, async function(err, fields, files) {
            

        if(files.files) {
             
            var fileName = fields['name'][0] + '.jpg'
            var sourcePath = files.files[0].path
             
            const directoryPath = path.join(__dirname, '../data/profile');
            var  destpath = directoryPath + '/' + fileName;
            
            fs.exists(destpath, function(exists) {
              if(exists) {
                //Show in green
                fs.unlinkSync(destpath);
                
                fs_mover.move(sourcePath, destpath, function (err) {
                    if (err) return console.error(err)
                    // res.end("success");
                });

              } else {

                    fs_mover.move(sourcePath, destpath, function (err) {
                    if (err) return console.error(err)
                    // res.end("success");
                    });
              }
            });
        }

        var blockName =  fields['blockName'][0]
        var twiterName =  fields['twiterName'][0]
        var instagramName = fields['instagramName'][0]
        var name = fields['name'][0]

        const users =  await User.find({ algo_address: name })
         
        if(users.length == 0) {
           return  res.send({ result: "failed"})
        }else{

            try{
                const user = users[0]
                user.blockrewardUserName = blockName
                user.twiterName = twiterName
                user.instagramName = instagramName
                await user.save()
                }catch(err){
                    console.log(err)
                    return  res.send({ result: "failed"})
            }
           return  res.send({ result: "success"})
        }


    });

})

  
app.get('/get_banner_file',(req,res)=>{

     
    try{

            const directoryPath = path.join(__dirname, '../data/banner');
            var  pathname = directoryPath + '/' + req.query.name;
            // console.log(pathname,"banner")
            fs.readFile(pathname, function(err, data){
              if(err){
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
              } else {
                // if the file is found, set Content-type and send data
                res.setHeader('Content-type','image/png');
                res.end(data);
              }

            });    

    }catch(err){
      console.log(err,'banner')
    }
})
app.get('/get_profile_file',(req,res)=>{

     
    try{

            const directoryPath = path.join(__dirname, '../data/profile');
            var  pathname = directoryPath + '/' + req.query.name;
            // console.log(pathname,"profile")
            fs.readFile(pathname, function(err, data){
              if(err){
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
              } else {
                // if the file is found, set Content-type and send data
                res.setHeader('Content-type','image/png');
                res.end(data);
              }

            });    

    }catch(err){
      console.log(err,'profile')
    }
})

///////////////////////  Content Edit /////////////////
app.post('/writeContent', function (req, res) {
  const {name, htmlData} = req.body;
  
  fs.readFile("content.json", "utf8", (err, content) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
      const jsoncontent = JSON.parse(content);
      jsoncontent[name] = htmlData;
      try{
        const jsonString = JSON.stringify(jsoncontent);
        fs.writeFile("content.json", jsonString, err => {
            if (err) {
                return res.json({ status: 500, msg: `Error writing file` });
                console.log('Error writing file', err)
            } else {
                return res.json({ status: 200, msg: "The Content JSON file is read successfully!", result : content});
                console.log('Successfully wrote file')
            }
          })
      } catch(err){
        console.log(err)
      }

  });
})

app.get('/readContent', function (req, res) {
  
  try{
    fs.readFile("content.json", "utf8", (err, content) => {
      if(err){
        return res.json({ status: 500, msg: `Error reading content.json from server: ${err}.` });
      } 
      
      try {
        const jsoncontent = JSON.parse(content);
        return res.json({ status: 200, msg: "The Content JSON file is read successfully!", result : jsoncontent});
      } catch (err) {
        return res.json({ status: 404, msg: "Error parsing JSON string:" });
      }
    });
  } catch(err){
    console.log(err)
  }
})
export default app;