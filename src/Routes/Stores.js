import express from 'express'
import parser from '../Config/multerConfig.js';
import StoreController from '../Controllers/Stores.js'
import Auth from '../Common/Auth.js'

const router = express.Router();



router.post("/create",parser.array("images"),Auth.adminGaurd,StoreController.createStore)
router.put("/:storeId",Auth.adminGaurd,StoreController.editStore)
router.delete("/:storeId",StoreController.deleteStore)
router.get("/",StoreController.getStores)
router.get("/search",StoreController.searchStore)
// router.get("/",StoreController.getAllStoresByLocation)
router.get("/:storeId",StoreController.getStoresById)

export default router