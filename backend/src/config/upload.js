const multer = require('multer')
const path = require('path')

exports.uploads = {
    storage: multer.diskStorage({
        destination: path.join(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
            const filename = `${Date.now()}-${file.originalname.replace(
                /\s+/g,
                ''
            )}`
            console.log(filename)
            cb(null, filename)
        },
    }),
    limits: {
        fileSize: 2048 * 2048, // Define o tamanho máximo do arquivo em bytes (2MB neste exemplo)
    },
    fileFilter: (req, file, cb) => {
        // Define o tipo de arquivo permitido como imagem
        if (file.mimetype.startsWith('image/')) {
            cb(null, true) // Aceita o arquivo
        } else {
            cb(new Error('Tipo de arquivo não suportado.')) // Rejeita o arquivo
        }
    },
}
