const { validationResult } = require('express-validator');
const isImage = require('is-image');
const { Book, Book_Images } = require('../../models/book');
const {
  handleHttpError,
  handleMiddlewareErrors,
} = require('../../utils/error_handlers');
const {
  createBookMiddleware,
  isOwner,
} = require('../middlewares/book_middlewares');
const path = require('path');
const fs = require('fs');
const { book_image_url } = require('../../config/enviroment');
const router = require('express').Router();
const booksImagesPath = './../../uploads/books/';

router.get('/', async (req, res) => {
  try {
    const { id_user } = req.user;
    const books = await Book.findAll({
      where: { UserId: id_user },
      include: [
        { model: Book_Images, required: false, attributes: ['image_url'] },
      ],
    });
    res.status(200).send({ books });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
});

router.post('/', createBookMiddleware, async (req, res) => {
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
    const image_name =
      name.replace(/ /g, '-') + book.id + path.extname(image.path);
    const outputPath = path.join(__dirname, booksImagesPath + image_name);
    fs.renameSync(image.path, outputPath);
    const bookImage = await Book_Images.create({
      image_path: outputPath,
      image_name: image_name,
      image_url: book_image_url + image_name,
      BookId: book.id,
    });
    return res.status(201).send({ book, bookImage });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
});

// delete book
router.delete('/:id_book', isOwner, async (req, res) => {
  try {
    const book = req.book;

    const bookImage = await Book_Images.findOne({ where: { BookId: book.id } });
    fs.unlinkSync(bookImage.image_path);
    await book.destroy();

    res.status(200).send({ message: 'book was deleted' });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
});

// update book
router.patch('/:id_book', isOwner, async (req, res) => {
  try {
    // const { id_book } = req.params;
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
});

// update book cover
router.patch('/cover/:id_book', isOwner, async (req, res) => {
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
});

module.exports = router;
