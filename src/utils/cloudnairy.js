import { fileURLToPath } from 'url'
import path from 'path';
import dotenv from 'dotenv'

const _dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(_dirname, '../../config/.env') })




import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dk7fjzlvo',
  api_key: '995519651188458',
  api_secret: 'j9so-HnPOpygj8RImp8pUQQj6Os',
  secure: true
});

export default cloudinary