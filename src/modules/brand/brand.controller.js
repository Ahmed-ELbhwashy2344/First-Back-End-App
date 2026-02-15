import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { brandModel } from "../../../database/models/brand.model.js";
import { APIFeatures } from "../../utils/APIFeatures.js";
import cloudinary from "../../utils/cloudinary.js";

// export const createBrand = catchAsyncError(async (req, res) => {
//   req.body.slug = slugify(req.body.name);
//   req.body.logo = req.file.filename;
//   let result = new brandModel(req.body);
//   await result.save();
//   res.json({ message: "success", result });
// });

export const createBrand = catchAsyncError(async (req, res) => {
  req.body.slug = slugify(req.body.name);

  // التأكد إن فيه صورة (لو البراند بيطلب logo أو image)
  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "brands" }, // فولدر البراندات في كلاوديناري
        (error, res) => { 
            if (res) resolve(res); 
            else reject(error); 
        }
      );
      stream.end(req.file.buffer); // نرسل الـ Buffer اللي جاي من Multer
    });
    
    // حفظ رابط الصورة اللي رجع من كلاوديناري
    req.body.logo = result.secure_url; 
  }

  let result = new brandModel(req.body);
  await result.save();
  res.json({ message: "success", result });
});
export const getAllBrands = catchAsyncError(async (req, res) => {
  let apiFeatures = new APIFeatures(
    brandModel.find(),
    req.query,
    req._parsedUrl.query,
  )
    .paginate()
    .filter()
    .sort()
    .search()
    .fields();
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "success", PageNumber: apiFeatures.page, result });
});
export const getBrand = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await brandModel.findById(id);
  !result && next(new AppError("Brand not found", 500));
  result && res.json({ message: "success", result });
  // if (result) return res.json({ message: "success", result });
  // next(new AppError("Category not found", 404));
});
export const updateBrand = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.name);
  req.body.logo = req.file.filename;
  let result = await brandModel.findByIdAndUpdate(id, req.body, { new: true });
  if (result) return res.json({ message: "success", result });
  next(new AppError("Brand not found", 500));
});
export const deleteBrand = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await brandModel.findByIdAndDelete(id);
  if (result) return res.json({ message: "success", result });
  next(new AppError("Brand not found", 500));
});
