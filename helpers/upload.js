const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
      cb(null, 'public/img')
    },
    filename: (req, file, cb)=> {
      const exstensi = file.originalname.split('.')
      cb(null, `${file.fieldname}-${Date.now()}.${exstensi[1]}`)
    }
  })
   
const upload = multer({ 
  storage,
  limits: {fileSize: 1000000}, // in byte
  fileFilter(req,file,cb){
    if(file.originalname.match(/\.(JPG|jpg|JPEG|jpeg|png|PNG)\b/)){
      cb(null,true)
    }else{
      cb('image must be jpg jpeg or png',null)
    }
  }
})

module.exports = upload