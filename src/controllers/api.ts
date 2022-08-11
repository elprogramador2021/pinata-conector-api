import { Application, Request, Response } from "express";

import CoursesData from "../../data/courses.json";

const base64ToImage = require('base64-to-image');
const fs = require("fs")
const pinataSDK = require("@pinata/sdk")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

export const loadApiEndpoints = (app: Application): void => {
  app.post("/api", async (req: Request, res: Response) => {
    let responseObj
    //console.log(req.body)
    
    let data_url_base64 = req.body.data_url;
    let metadata_json = req.body.metadata;
    const path = "public/images/";
    const optionalObj = { fileName: 'imagen-nft', type: 'png' };

    const { imageType, fileName } = base64ToImage(data_url_base64, path, optionalObj);
    //
    const readableStreamForFile = fs.createReadStream(`${path}/imagen-nft.png`);

    try {
      let respuesta = await pinata.pinFileToIPFS(readableStreamForFile);

      //
      metadata_json.image = `ipfs://${respuesta.IpfsHash}`;

      responseObj = await pinata.pinJSONToIPFS(metadata_json);

      } catch (error) {
          console.log(error)
      }
    
    //return res.status(200).send(`ipfs://${responseObj.IpfsHash}`);
    return res.status(200).send(req.body);
  });
};
