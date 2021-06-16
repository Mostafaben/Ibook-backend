const UPLOADS_PATH = './../../uploads/';
const BOOKS_IMAGES_PATH = `${UPLOADS_PATH}books/`;
const AUTHOR_IMAGES_PATH = `${UPLOADS_PATH}authors/`;
const BOOK_MAX_IMAGES = 5;
const isImage = require('is-image');
const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');
const { Book, Book_Images, Author } = require('../../models/models');
const { book_image_url, author_image_url } = require('../../config/enviroment');
const {
  HttpErrorHr,
  handleMiddlewareErrors,
  HttpError,
  HttpErrorHandler,
} = require('../../utils/error_handlers');

async function getUserBooks(req, res) {
  try {
    const { id_user } = req.user;
    const books = await Book.findAll({
      where: { UserId: id_user },
      attributes: { exclude: ['UserId'] },

      include: [
        {
          model: Author,
          required: false,
          attributes: ['name', 'id', 'image_url'],
        },
        {
          model: Book_Images,
          required: false,
          attributes: ['image_url', 'id'],
        },
      ],
    });
    res.status(200).send({ books });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function checkIfAuthorExists(authorName) {
  return Author.findOne({ where: { name: authorName } });
}

async function addNewAuthor(authorName) {
  authorName = authorName.trim().toLowerCase();
  const author = await checkIfAuthorExists(authorName);
  if (author) return author;
  return Author.create({ name: authorName });
}

function storeAuthorImage(image, authorName) {
  const imageName = generateUniqueAuthorName(authorName);
  const outputPath = path.join(__dirname, AUTHOR_IMAGES_PATH + imageName);
  fs.renameSync(image.path, outputPath);
  return { imageName, outputPath };
}

function generateUniqueAuthorName(authorName) {
  return authorName.replace(/ /g, '-') + Date.now() + path.extname(image.path);
}

async function addAuthorToBook(book, idAuthor) {
  book.AuthorId = idAuthor;
  return book.save();
}

async function createBook(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleMiddlewareErrors(res, errors, 400);
    const {
      files: { image },
      user: { id_user },
      body: { name, authorName, etat, summary },
    } = req;
    if (!image || !isImage(image.path))
      throw new HttpError('image is required', 400);
    let id_author = null;
    if (authorName) {
      const author = await addNewAuthor(authorName);
      id_author = author.id;
    }
    const book = await Book.create({
      name,
      AuthorId: id_author,
      etat,
      UserId: id_user,
      summary,
    });
    const bookImage = await addImageToBook(name, book.id, image);
    return res.status(201).send({ book, bookImage });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

function generateBookImageName(bookName, image, idBook) {
  return bookName.replace(/ /g, '-') + idBook + path.extname(image.path);
}

function generateBookImagePath(imageName) {
  return path.join(__dirname, BOOKS_IMAGES_PATH + imageName);
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
    await book.destroy();
    await deleteBookImages(book.id);
    res.status(200).send({ message: 'book was deleted' });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function deleteBookImages(id_book) {
  const bookImages = await Book_Images.findAll({ where: { BookId: id_book } });
  for (let i = 0; i < bookImages.length; i++) {
    fs.unlinkSync(bookImages[i].image_path);
  }
}

async function updateBook(req, res) {
  try {
    const {
      body: { name, AuthorId, etat },
      book,
    } = req;
    if (etat) book.etat = etat;
    if (name) book.name = name;
    if (AuthorId) book.AuthorId = AuthorId;
    await book.save();
    res.status(200).send({ book });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function deleteBookImage(req, res) {
  try {
    const { id_image } = req.params;
    const bookImage = await Book_Images.findByPk(id_image);
    await bookImage.destroy();
    res.status(200).send({ message: 'image was deleted' });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function updateBookCover(req, res) {
  try {
    const {
      params: { id_book },
      files: { image },
    } = req.params;
    if (!isImage(image.path)) throw new new HttpError('image is required')();
    const bookImage = await Book_Images.findOne({ where: { BookId: id_book } });
    fs.renameSync(image.path, bookImage.image_path);
    return res.status(200).send({ bookImage });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function addBookImage(req, res) {
  try {
    const {
      book: { name, id },
      files: { image },
    } = req;

    if (!image || !isImage(image.path))
      throw new HttpError('image is required', 400);
    if (await checkBookMaxImages(id))
      throw new HttpError('cant add new Image, max acceded', 400);
    const bookImage = await addImageToBook(name, id, image);
    return res.status(201).send({ bookImage });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function checkBookMaxImages(idBook) {
  const images = await Book_Images.findAll({ where: { BookId: idBook } });
  return images.length == BOOK_MAX_IMAGES;
}

module.exports = {
  createBook,
  getUserBooks,
  updateBook,
  updateBookCover,
  deleteBookById,
  deleteBookImage,
  addBookImage,
  addAuthorToBook,
};
