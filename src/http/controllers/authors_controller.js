const {
  handleHttpError,
  handleMiddlewareErrors,
} = require('./../../utils/error_handlers');
const { Author } = require('./../../models/models');
const path = require('path');
const fs = require('fs');
const isImage = require('is-image');
const { author_image_url } = require('../../config/enviroment');
const AUTHOR_IMAGES_PATH = './../../uploads/authors/';

const { validationResult } = require('express-validator');

async function createAuthor(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleMiddlewareErrors(res, errors, 400);

    const {
      files: { image },
      body: { name, resume },
    } = req;
    if (await checkIfAuthorExists(name)) throw Error('author already exists');
    let author = await Author.create({ name, resume });
    author = await storeAuthorImage(image, author);
    return res.status(201).send({ author });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

function checkIfImage(image) {
  return image && isImage(image.path);
}

async function storeAuthorImage(image, author) {
  if (!checkIfImage(image)) return author;
  const { name } = author;
  const imageName = name.replace(/ /g, '-') + path.extname(image.path);
  const outputPath = path.join(__dirname, AUTHOR_IMAGES_PATH + imageName);
  fs.renameSync(image.path, outputPath);
  author.image_name = imageName;
  author.image_url = author_image_url + imageName;
  author.image_path = outputPath;
  return author.save();
}

async function checkIfAuthorExists(authorName) {
  authorName = authorName.trim().toLowerCase();
  return Author.findOne({
    where: { name: authorName },
  });
}

async function getAuthors(_, res) {
  try {
    return res.status(200).send(await Author.findAll());
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function getAuthorsNames(_, res) {
  try {
    const authors = await Author.findAll({
      attributes: ['name', 'id'],
    });
    return res.status(200).send(authors);
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function updateAuthor(req, res) {
  try {
    const {
      body: { name, resume },
      author,
    } = req;
    author.name = name;
    author.resume = resume;
    await author.save();
    return res.status(200).send({ author });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function deleteAuthor(req, res) {
  try {
    const { author } = req;
    await author.destroy();
    return res.status(200).send({ message: 'author deleted' });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}
async function addAuthorImage(req, res) {
  try {
    const {
      files: { image },
      author,
    } = req;
    const { image_url, image_name } = await storeAuthorImage(image, author);
    return res.status(201).send({ image_name, image_url });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

module.exports = {
  createAuthor,
  getAuthors,
  addAuthorImage,
  getAuthorsNames,
  updateAuthor,
  deleteAuthor,
};
