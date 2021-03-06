const {
  http_response_code: { BAD_REQUEST, SUCCESS, NOT_FOUND, CREATED },
} = require('../../enums/enums');

const UPLOADS_PATH = './../../uploads/',
  BOOKS_IMAGES_PATH = `${UPLOADS_PATH}books/`,
  BOOK_MAX_IMAGES = 5,
  isImage = require('is-image'),
  path = require('path'),
  fs = require('fs'),
  { validationResult } = require('express-validator'),
  {
    Book,
    Book_Images,
    Author,
    Book_Category,
    Category,
    Category_Image,
  } = require('../../models/models'),
  { book_image_url } = require('../../config/enviroment'),
  {
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
        {
          model: Category,
          through: { attributes: [] },
          required: false,
          attributes: ['id', 'name'],
          include: [
            {
              model: Category_Image,
              required: false,
              attributes: ['icon_url'],
            },
          ],
        },
      ],
    });
    res.status(SUCCESS).send({ books });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function createBook(req, res) {
  try {
    handleMiddlewareErrors(req, res);
    const {
      files: { image },
      user: { id_user },
      body: { name, authorName, etat, summary, categories },
    } = req;

    if (!image || !isImage(image.path))
      throw new HttpError('image is required');

    let id_author = null;
    if (authorName) {
      const author = await createNewAuthor(authorName);
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
    await storeBookCategories(categories, book.id);

    res.status(CREATED).send({ book, bookImage });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
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
    res.status(SUCCESS).send({ message: 'book was deleted' });
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
    res.status(SUCCESS).send({ book });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function deleteBookImage(req, res) {
  try {
    const { id_image } = req.params;
    const bookImage = await Book_Images.findByPk(id_image);
    await bookImage.destroy();
    res.status(SUCCESS).send({ message: 'image was deleted' });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function createNewAuthor(authorName) {
  authorName = authorName.trim().toLowerCase();
  const author = await checkIfAuthorExists(authorName);
  if (author) return author;
  return Author.create({ name: authorName });
}

async function updateBookCover(req, res) {
  try {
    const {
      params: { id_book: BookId },
      files: { image },
    } = req.params;
    if (!isImage(image.path)) throw new HttpError('image is required');
    const bookImage = await Book_Images.findOne({ where: { BookId } });
    fs.renameSync(image.path, bookImage.image_path);
    return res.status(SUCCESS).send({ bookImage });
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
      throw new HttpError('image is required', BAD_REQUEST);
    if (await checkBookMaxImages(id))
      throw new HttpError('cant add new Image, max acceded', BAD_REQUEST);
    const bookImage = await addImageToBook(name, id, image);
    return res.status(CREATED).send({ bookImage });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function checkBookMaxImages(idBook) {
  const images = await Book_Images.findAll({ where: { BookId: idBook } });
  return images.length == BOOK_MAX_IMAGES;
}

async function addCategoryToBook(CategoryId, BookId) {
  return Book_Category.create({ CategoryId, BookId });
}

async function storeBookCategories(categories, BookId) {
  await categories?.forEach(
    async (category) => await addCategoryToBook(category.id, BookId)
  );
}

async function addAuthorToBook(book, idAuthor) {
  book.AuthorId = idAuthor;
  return book.save();
}

function generateBookImageName(bookName, image, idBook) {
  return bookName.replace(/ /g, '-') + idBook + path.extname(image.path);
}

function generateBookImagePath(imageName) {
  return path.join(__dirname, BOOKS_IMAGES_PATH + imageName);
}

async function checkIfAuthorExists(authorName) {
  return Author.findOne({ where: { name: authorName } });
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
