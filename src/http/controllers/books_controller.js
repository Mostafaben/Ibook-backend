const { validationResult } = require('express-validator');
const isImage = require('is-image');
const { Book, Book_Images } = require('../../models/book');
const {
  handleHttpError,
  handleMiddlewareErrors,
} = require('../../utils/error_handlers');
const path = require('path');
const fs = require('fs');
const { book_image_url } = require('../../config/enviroment');
const booksImagesPath = './../../uploads/books/';
const MAX_IMAGES = 5;

async function getUserBooks(req, res) {
  try {
    const { id_user } = req.user;
    const books = await Book.findAll({
      where: { UserId: id_user },
      attributes: { exclude: ['UserId'] },
      include: [
        { model: Book_Images, required: false, attributes: ['image_url'] },
      ],
    });
    res.status(200).send({ books });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function createBook(req, res) {
  try {
    const { image } = req.files;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleMiddlewareErrors(res, errors, 400);
    if (!isImage(image.path))
      return handleHttpError(res, new Error('image is required'), 400);
    const { id_user } = req.user;
    const { name, author, etat, summary } = req.body;
    const book = await Book.create({
      name,
      author,
      etat,
      UserId: id_user,
      summary,
    });
    const bookImage = await addImageToBook(name, book.id, image);
    return res.status(201).send({ book, bookImage });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

function generateBookImageName(bookName, image, idBook) {
  return bookName.replace(/ /g, '-') + idBook + path.extname(image.path);
}

function generateBookImagePath(imageName) {
  return path.join(__dirname, booksImagesPath + imageName);
}

async function addImageToBook(bookName, idBook, image) {
  const imageName = generateBookImageName(bookName, image, idBook);
  const outputPath = generateBookImagePath(imageName);
  fs.renameSync(image.path, outputPath);
  return Book_Images.create({
    image_path: outputPath,
    image_name: imageName,
    image_url: book_image_url + imageName,
    BookId: idBook,
  });
}

async function deleteBookById(req, res) {
  try {
    const book = req.book;
    const bookImage = await Book_Images.findOne({ where: { BookId: book.id } });
    fs.unlinkSync(bookImage.image_path);
    await book.destroy();

    res.status(200).send({ message: 'book was deleted' });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function updateBook(req, res) {
  try {
    const book = req.book;
    const { name, author, etat } = req.body;
    if (etat) book.etat = etat;
    if (name) book.name = name;
    if (author) book.author = author;
    await book.save();
    res.status(200).send({ book });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function deleteBookImage(req, res) {
  try {
    const { id_image } = req.params;
    const bookImage = await Book_Images.findByPk(id_image);
    await bookImage.destroy();
    res.status(200).send({ message: 'image was deleted' });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function updateBookCover(req, res) {
  try {
    const { id_book } = req.params;
    const { image } = req.files;
    if (!isImage(image.path))
      return handleHttpError(res, new Error('image is required'), 400);
    const bookImage = await Book_Images.findOne({ where: { BookId: id_book } });
    fs.renameSync(image.path, bookImage.image_path);
    return res.status(200).send({ bookImage });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function addBookImage(req, res) {
  try {
    const { name, id } = req.book;
    const { image } = req.files;

    if (!image || !isImage(image.path))
      return handleHttpError(res, new Error('image is required'), 400);

    if (await checkBookMaxImages(id))
      return handleHttpError(
        res,
        new Error('cant add new Image, max acceded'),
        400
      );

    const bookImage = await addImageToBook(name, id, image);
    return res.status(201).send({ bookImage });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function checkBookMaxImages(idBook) {
  const images = await Book_Images.findAll({ where: { BookId: idBook } });
  console.log(images.length == MAX_IMAGES);
  return images.length == MAX_IMAGES;
}

module.exports = {
  createBook,
  getUserBooks,
  updateBook,
  updateBookCover,
  deleteBookById,
  deleteBookImage,
  addBookImage,
};
