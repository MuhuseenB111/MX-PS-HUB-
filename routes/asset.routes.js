/*=========================================
        ASSET ROUTES
=========================================*/

const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth");

const AssetController = require("../controllers/AssetController");


/*=========================================
        CREATE ASSET
=========================================*/

router.post(

    "/",

    authenticate,

    AssetController.createAsset

);


/*=========================================
        GET AVAILABLE ASSETS
=========================================*/

router.get(

    "/",

    AssetController.getAvailableAssets

);


/*=========================================
        GET USER ASSETS
=========================================*/

router.get(

    "/my-assets",

    authenticate,

    AssetController.getUserAssets

);


/*=========================================
        GET SINGLE ASSET
=========================================*/

router.get(

    "/:assetId",

    AssetController.getAssetById

);


/*=========================================
        UPDATE ASSET
=========================================*/

router.put(

    "/:assetId",

    authenticate,

    AssetController.updateAsset

);


/*=========================================
        DELETE ASSET
=========================================*/

router.delete(

    "/:assetId",

    authenticate,

    AssetController.deleteAsset

);


module.exports = router;
