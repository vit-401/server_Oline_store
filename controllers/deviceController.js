import model from "../models/models.js"
import {v4} from "uuid";
import path, {dirname} from "path";
import ApiError from "../error/ApiError.js";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class DeviceController {

    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info,testId} = req.body
            const {img} = req.files
            let fileName = v4() + ".jpg"
            img.mv(path.resolve(__dirname, "..", "static", fileName))
            const device = await model.Device.create({name, price, brandId,testId, typeId, img: fileName})

            if (info) {
                info = JSON.parse(info)
                info.forEach(item => {
                    model.DeviceInfo.create({
                        title: item.title,
                        description: item.description,
                        deviceId: device.id
                    })
                })
            }


            return res.json(device)
        } catch (err) {
            console.log(err)
            next(ApiError.badRequest(err.message))

        }

        // return res.json(devices)
    }

    async getAll(req, res) {
        try {
            let {brandId, typeId, limit, page} = req.query

            page = page || 1
            limit = limit || 9
            let offset = page * limit - limit
            let devices

            if (!brandId && !typeId) {
                devices = await model.Device.findAndCountAll({limit, offset})
            }
            if (brandId && !typeId) {
                devices = await model.Device.findAndCountAll({where: {brandId}, limit, offset})

            }
            if (!brandId && typeId) {
                devices = await model.Device.findAndCountAll({where: {typeId}, limit, offset})
            }

            if (brandId && typeId) {
                devices = await model.Device.findAndCountAll({where: {typeId, brandId}, limit, offset})
            }


            return res.json(devices)
        } catch (err) {
            ApiError.badRequest(err.message)
        }

    }

    async getOne(req, res) {
        const {id} = req.params
        const device = await model.Device.findOne({where: {id}, include: [{model: model.DeviceInfo, as: "info"}]})
        res.json(device)
    }

}

export default new DeviceController()