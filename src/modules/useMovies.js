import { ref, onMounted } from 'vue';
import { moviesCollection, moviesFirebaseCollectionRef, db } from './firebase';
import { onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';

export const useMovies = () => {
  // Step 1: Define a variable and store it in a ref
const newMovieTitle = ref('');

// Step 2: Create a list of movies and store it in a ref
const movies = ref([]);


// Step 3: Create a function to retrieve a new movie to the list
onMounted(() => {
  onSnapshot(moviesCollection, (snapshot) => {
    movies.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
      // title: doc.data().title
    }))
  })
})

// Step 4: Create a function that adds a new movie to the list
const addMovie = async() => {
  if (newMovieTitle.value.trim() === '') return; // Prevent empty strings

  await addDoc(moviesCollection, {
    Title: newMovieTitle.value
  })

  newMovieTitle.value = '';
}

// Step 5: Create a function that removes a movie from the list
const deleteMovie = async(id) => {
  console.log(id);
  await deleteDoc(doc(db, moviesFirebaseCollectionRef, id));
}

return {
  newMovieTitle,
  movies,
  addMovie,
  deleteMovie
}

};