<template>
  <div class="about">
    <h1>This is an about page</h1>
    <input type="text" v-model="newMovieTitle" placeholder="Add a new movie" />
    <button @click="addMovie">Add Movie</button>
    <ul>
      <li v-for="movie in movies" :key="movie">
        {{ movie.id }}
        Title: {{ movie.title }}
        <button @click="deleteMovie(movie.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID

  // apiKey: "AIzaSyDmSO-vHay5OgT9HFn7Q5eZq1OtdQViMeg",
  // authDomain: "fbday-b8af4.firebaseapp.com",
  // projectId: "fbday-b8af4",
  // storageBucket: "fbday-b8af4.appspot.com",
  // messagingSenderId: "830495763705",
  // appId: "1:830495763705:web:ba15e4646abaed83e50628"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Step 1: Define a variable and store it in a ref
const newMovieTitle = ref('');

// Step 2: Create a list of movies and store it in a ref
const movies = ref([]);

// Step 3.5: Create a reference to the movies collection in firebase
const moviesFirebaseCollectionRef = 'movies';
const moviesCollection = collection(db, moviesFirebaseCollectionRef);
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
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
