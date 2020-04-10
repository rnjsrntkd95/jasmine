import "../scss/main.scss";
import "babel-polyfill";
import axios from "axios";

/*
Movie API

영화 리스트
https://yts.mx/api/v2/list_movies.json

영화 상세 정보
https://yts.mx/api/v2/movie_details.json?movie_id=

관련 영화 정보
https://yts.mx/api/v2/movie_suggestions.json?movie_id=
*/

/*
Youtube Link
https://www.youtube.com/watch?v=
*/

const fetchMovieList = async () => {
    try {
        const response = await axios.get("https://yts.mx/api/v2/list_movies.json")
        const movieList = response.data.data.movies;
    
        console.log(movieList);    
    } catch (error) {
        console.log(error);
    }
}

// fetchMovieList();


//// promise 체이닝
// axios
//   .get("https://yts.mx/api/v2/list_movies.json?sort_by=rating")
//   .then((response) => {
//     console.log("movie list");
//     console.log(response);
//     const movieList = response.data.data.movies;

//     return axios.get(
//       `https://yts.mx/api/v2/movie_suggestions.json?movie_id=${movieList[0].id}`
//     );
//   })
//   .then((response) => {
//     console.log("movie suggestions list");
//     console.log(response);
//     const movies = response.data.data.movies;

//     return axios.get(
//       `https://yts.mx/api/v2/movie_suggestions.json?movie_id=${movies[0].id}`
//     );
//   })
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((error) => {
//     console.log(error);
//   });



  
const fetchMovieDetail = async () => {
    try {
        const listResponse = await axios.get(
            "https://yts.mx/api/v2/list_movies.json?sort_by=rating"
          );
        
        console.log("movie list");
        const movieList = listResponse.data.data.movies;
    
        //
        const suggestionResponse = await axios.get(
        `https://yts.mx/api/v2/movie_suggestions.json?movie_id=${movieList[0].id}`
        );
    
        console.log("movie suggestion list");
        const movies = suggestionResponse.data.data.movies;
    
        const detailResponse = await axios.get(
        `https://yts.mx/api/v2/movie_details.json?movie_id=${movies[0].id}`
        );
        console.log("movie detail");
        console.log(detailResponse);
    } catch (error) {
        console.log(error);
    }
};

// fetchMovieDetail();



// // Vue JS
// const app = new Vue({
//     el: "#app",
//     data() {
//         return {
//             message: "jasmine",
//             className: "strong",
//             isShow: false,
//             list: [1, 2, 3],
//             isClicked: false,
//         };
//     },
//     computed: {
//         reversedMessage() {
//             return this.message.split("").reverse().join("");
//         }
//     },
//     methods: {
//         alertMessage() {
//             alert(this.message);
//         },
//         clickBtn() {
//             this.isClicked = !this.isClicked;
//         }
//     }
// });


const app = new Vue({
    el: "#app",
    data() {
        return {
            movieList: [],
            suggestedMovies: [],
        };
    },
    async created() {
        try {
            const response = await axios.get(
                "https://yts.mx/api/v2/list_movies.json?sort_by=download_count"
            );
            this.movieList = response.data.data.movies;
        
            console.log(this.movieList);
        } catch (error) {
            console.log(error);
        }
    },
    methods: {
        getTrailerLink(code) {
            return `https://www.youtube.com/watch?v=${code}`;
        },
        async fetchDetails(movieId) {
            const suggestionResponse = await axios.get(
                `https://yts.mx/api/v2/movie_suggestions.json?movie_id=${movieId}`
            );
            console.log(suggestionResponse);
            this.suggestedMovies = suggestionResponse.data.data.movies;

            // 직렬처리 - for문
            // for (const movie of this.suggestedMovies) {
            //     const detailResponse = await axios.get(
            //         `https://yts.mx/api/v2/movie_details.json?movie_id=${movie.id}`
            //     );
            //     movie["download_count"] = detailResponse.data.data.movie.download_count;
            //     console.log(detailResponse);
            // }

            // 병렬처리
            const promises = this.suggestedMovies.map(async (movie) => {
                const detailResponse = await axios.get(
                    `https://yts.mx/api/v2/movie_details.json?movie_id=${movie.id}`
                );
                movie["download_count"] = detailResponse.data.data.movie.download_count;
                console.log(detailResponse);
            })
            
            await promises.all(promises);
        }
    },

})