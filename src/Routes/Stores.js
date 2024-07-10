import express from 'express'
import multer from "multer"
import path from "path"
import StoreController from '../Controllers/Stores.js'
import Auth from '../Common/Auth.js'

const router = express.Router();

//use of multer package
let storage = multer.diskStorage({
    destination :(req, file, cb)=>{          
        cb(null, "Public/Images")
    },
    filename:(req, file, cb)=>{
        const uniqueSuffix = Date.now() + path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

let maxSize = 2 * 1000 * 1000;
let upload = multer({
    storage : storage,
    limits : {
        fileSize : maxSize
    }
});

router.post("/create",upload.array('images',3),Auth.adminGaurd,StoreController.createStore)
router.put("/:id",Auth.adminGaurd,StoreController.editStore)
router.delete("/:id",StoreController.deleteStore)
router.get("/",StoreController.getStores)
// router.get("/",StoreController.getAllStoresByLocation)
router.get("/:id",StoreController.getStoresById)

export default router