const { validationResult } = require('express-validator');
const isImage = require('is-image');
const { User_Image, Address } = require('../../models/models');
const {
  handleHttpError,
  handleMiddlewareErrors,
} = require('../../utils/error_handlers');
const userImagePath = './../../uploads/user/';
const fs = require('fs');
const path = require('path');
const { user_image_url } = require('../../config/enviroment');

async function updateUserAddress(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleMiddlewareErrors(res, errors, 400);
    const {
      user: { id_user },
      body: { id_wilaya, address },
    } = req;

    let userAddress = await Address.findOne({ where: { UserId: id_user } });
    if (userAddress) {
      userAddress.WilayaId = id_wilayal;
      userAddress.address = address;
      await userAddress.save();
    } else {
      userAddress = await Address.create({
        UserId: id_user,
        WilayaId: id_wilaya,
        address,
      });
    }
    return res.status(201).send({ userAddress });
  } catch (error) {
    return handleHttpError(res, error, 400);
  }
}

async function updateUserProfileImage(req, res) {
  try {
    const {
      user: { id_user },
      files: { image },
    } = req;

    if (!isImage(image.path)) {
      return handleHttpError(res, new Error('image is required'), 400);
    }
    let userImage = await User_Image.findOne({ where: { UserId: id_user } });
    if (!userImage) {
      const image_name = id_user + path.extname(image.path);
      const image_path = path.join(__dirname, userImagePath + image_name);
      fs.renameSync(image.path, image_path);
      const image_url = user_image_url + image_name;
      userImage = await User_Image.create({
        image_path,
        image_name,
        image_url,
        UserId: id_user,
      });
    } else {
      fs.renameSync(image.path, userImage.image_path);
    }
    return res.status(201).send({ userImage });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

module.exports = { updateUserAddress, updateUserProfileImage };
