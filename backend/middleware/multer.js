import multer from 'multer';

// Use diskStorage but without a hardcoded 'destination' 
// This allows Multer to use the OS temp directory if 'uploads' isn't ready
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        // Adding Date.now() prevents errors if two people upload files with the same name
        callback(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

export default upload;