import cloudinary from 'cloudinary'
import { errorHandler } from './errorHandler';


export default ()=>cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_SECRET_KEY 
  }); 

  export const saveImage = async(avatar,next,folder)=>{
    try {
      const result = await cloudinary.v2.uploader.upload(avatar,{
        width : folder==="avatars" ? '250':'400',
         height: folder==="avatars" ? '250':'450',
         gravity: folder==="avatars" ? "faces":undefined, 
         crop: folder==="avatars" ?"fill":"fit",
        folder
      })
      // if(!result) return next(new errorHandler("File upload Failed",400))
      console.log("id=",result.public_id ,"\n url=", result.secure_url);
      return {
        public_id : result.public_id,
        url : result.secure_url
      }
    } catch (error) {
      next(new errorHandler(error.message,400))
    }
    
  }
  export const destroyImage= async(id,next)=>{
    try {
      
      const result = await cloudinary.v2.uploader.destroy(id)
    } catch (error) {
      next(new errorHandler(error.message,400))
    }
  }