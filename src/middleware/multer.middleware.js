
import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cd){
    cd(null, './public/temp')
  },
  filename: function(req, file, cd) {
  
    cd(null, file.originalname)
  }
})

export const upload = multer({
    storage: storage,
      limits: {
        fileSize: 100 * 1024 * 1024 // 100 MB per file
    }
})