const Book = require('../models/book');
const fs = require('fs');

exports.addRating = (req, res, next) => {
    const { userId, rating } = req.body;
    const bookId = req.params.id;

    if (!bookId || bookId === 'undefined') {
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    Book.findOne({ _id: bookId })
    .then(book => {
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé!' });
        }

        const existingRatingIndex = book.ratings.findIndex(rating => rating.userId === userId);

        if (existingRatingIndex >= 0) {
            book.ratings[existingRatingIndex].grade = rating;
        } else {
            book.ratings.push({ userId, grade: rating });
        }

        const totalRatings = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
        book.averageRating = totalRatings / book.ratings.length;

        book.save()
            .then(savedBook => {
                res.status(200).json({ message: 'Évaluation ajoutée/mise à jour avec succès!', id: savedBook._id });
            })
            .catch(error => res.status(400).json({ error }));

    })
    .catch(error => res.status(500).json({ error }));
};

exports.addBook = (req, res, next) => {
    console.log(req.body)
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        averageRating: bookObject.ratings[0].grade
    });

    book.save()
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};

exports.showBooks = (req, res, next) => {
    Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
};

exports.showSingleBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.showBestBook = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.updateBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res) => {
    Book.findOne({ _id: req.params.id})
       .then(book => {
           if (book.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = book.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};