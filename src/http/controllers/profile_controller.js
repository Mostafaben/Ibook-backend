const { validationResult } = require('express-validator');
const isImage = require('is-image');
const { User_Image, Address, User } = require('../../models/models');
const {
  HttpErrorHandler,
  handleMiddlewareErrors,
  HttpError,
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
    return HttpErrorHandler(res, error);
  }
}

async function updateUserProfileImage(req, res) {
  try {
    const {
      user: { id_user },
      files: { image },
    } = req;
    if (!isImage(image.path)) throw new HttpError('image is required');
    let userImage = await User_Image.findOne({ where: { UserId: id_user } });
    if (!userImage) await storeUserImage(image, id_user);
    else fs.renameSync(image.path, userImage.image_path);
    return res.status(201).send({ userImage });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function storeUserImage(image, id_user) {
  const image_name = id_user + path.extname(image.path);
  const image_path = path.join(__dirname, userImagePath + image_name);
  fs.renameSync(image.path, image_path);
  const image_url = user_image_url + image_name;
  return User_Image.create({
    image_path,
    image_name,
    image_url,
    UserId: id_user,
  });
}

async function updateUserInformations(req, res) {
  try {
    const {
      body: { name, address, WilayaId },
      user: { id_user: UserId },
    } = req;
    const user = await User.findByPk(UserId);
    user.name = name;
    await user.save();

    const userAddress = await Address.findOne({ where: { UserId } });
    if (userAddress) updateUserAddress(userAddress);
    else await createAddress(address, WilayaId, UserId);

    res.status(200).send({ message: 'user was updated' });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function createAddress(address, WilayaId, UserId) {
  return Address.create({ address, UserId, WilayaId });
}

async function updateUserAddress(userAddress) {
  userAddress.WilayaId = WilayaId;
  userAddress.address = address;
  return userAddress.save();
}

module.exports = {
  updateUserAddress,
  updateUserProfileImage,
  updateUserInformations,
};
