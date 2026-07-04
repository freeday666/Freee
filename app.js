const API_KEY = "5e6235a7a088c373e121fe3e9a4d1834";

async function searchMovies() {
  const query = document.getElementById("search").value;

  if (!query) return;

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
  );

  const data = await res.json();

  const results = document.getElementById("results");

  results.innerHTML = data.results.map(movie => `
    <div class="card">
      <img style="width:100%;border-radius:8px"
        src="https://image.tmdb.org/t/p/w300${movie.poster_path || ''}" />
      <h4>${movie.title}</h4>
    </div>
  `).join("");
}
