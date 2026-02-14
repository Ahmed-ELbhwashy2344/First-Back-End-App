import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../utils/appError.js";

let options = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folderName}`);
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) return cb(null, true);
    cb(new AppError("images only", 400), false);
  }
  return multer({ storage, fileFilter });
};

export const uploadSingleFile = (fieldName, folderName) =>
  options(folderName).single(fieldName);
export const uploadArrayOfFiles = (arrayOfFields, folderName) =>
  options(folderName).fields(arrayOfFields);
