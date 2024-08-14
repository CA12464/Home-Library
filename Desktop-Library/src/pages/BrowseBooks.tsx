import { useEffect, useState } from 'react';
import { searchBooks } from '../functions/searchBookGET'; // Adjust the import path as needed
import { BookImage } from '../functions/BookImageGET'; // Import the BookImage function
import styles from './BrowseBooks.module.css'; // Import the CSS Module for styling

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  publication_date: string;
  cover_image_url?: string; // Adjusted to match the API response
}

function BrowseBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async (): Promise<Book[]> => {
      try {
        const data = await searchBooks(''); // Pass an empty query to get all books
        console.log(data);  // Verify the retrieved data
        return data;
      } catch (error) {
        console.error("Error fetching books: ", error);
        setError('Failed to fetch books');
        return []; // Return an empty array in case of error
      }
    };

    const fetchBookImages = async (books: Book[]) => {
      try {
        const updatedBooks = await Promise.all(
          books.map(async (book) => {
            // Fetch the cover image URL for each book
            const { cover_image_url } = await BookImage(book.id);
            return { ...book, cover_image_url }; // Update the book with the image URL
          })
        );
        setBooks(updatedBooks);
      } catch (error) {
        console.error("Error fetching book images: ", error);
        setError('Failed to fetch book images');
      }
    };

    // Fetch books and then fetch images
    fetchBooks().then((fetchedBooks) => fetchBookImages(fetchedBooks));

  }, []);

  return (
    <div className={styles.browseBooksWrapper}>
      <h1 className={styles.browseBooksHeader}></h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.cardContainer}>
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className={styles.card}>
              {book.cover_image_url ? (
                <img
                  src={book.cover_image_url}  // Use the URL from the book object
                  alt={`${book.title} Cover`}
                  className={styles.card__background}
                />
              ) : (
                <img
                  src="/images/51YsnEoNr-L.png"  // Placeholder image if cover_image_url is not available
                  alt="Placeholder"
                  className={styles.card__background}
                />
              )}
              <div className={styles.card__content}>
                <h2 className={styles.card__title}>{book.title}</h2>
                <p>Author: {book.author}</p>
                <p>Genre: {book.genre}</p>
                <p>Publication Date: {book.publication_date}</p>
                <button className={styles.card__button}>View More</button>
              </div>
            </div>
          ))
        ) : (
          <p>No books found</p>
        )}
      </div>
    </div>
  );
}

export default BrowseBooks;
