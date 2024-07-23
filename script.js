let $ = document;
let autoCompleteContainer = $.querySelector(".search-input-container");
let searchInputElement = $.querySelector("input");
let autoCompleteBox = $.querySelector(".auto-complete-box");
let searchBtn = $.getElementById("search-icon");
let allData = [];

function fetchData(searchInputValue) {
  fetch(
    `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchInputValue}&limit=10&namespace=0&format=json&origin=*`
  )
    .then((res) => res.json())
    .then((data) => {
      allData = data[1];
      displaySuggestions(allData);
    })
    .catch((err) => {
      console.log(err, "can not catch data");
    });
}

function debounce(fun, delay) {
  let timeOut = null;
  return (...args) => {
    clearTimeout(timeOut);//Clears any existing timeout to reset the delay
    timeOut = setTimeout(() => {
      fun(...args);
    }, delay);
  };
}

const debouncedFetchData = debounce(fetchData, 500);

function searchInputHandler() {
  let searchInputValue = searchInputElement.value.trim();

  //Checks if the search input value is not empty
  if (searchInputValue) {
    autoCompleteContainer.classList.add("active");
    debouncedFetchData(searchInputValue);
  } else {
    autoCompleteContainer.classList.remove("active");
    autoCompleteBox.innerHTML = "";
  }
}

searchInputElement.addEventListener("keyup", searchInputHandler);

function displaySuggestions(allData) {
  autoCompleteBox.innerHTML = allData
    .map(
      (word) =>
        `<li><a href="https://en.wikipedia.org/wiki/${encodeURIComponent(
          word
        )}" target="_blank">${word}</a></li>`
    )
    .join("");
}

function SearchedWordPage(searchValue) {
  let wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
    searchValue
  )}`;
  let anchor = document.createElement("a");
  anchor.href = wikiUrl;
  anchor.target = "_blank";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function handleSearch() {
  let searchInputValue = searchInputElement.value.trim();
  if (searchInputValue) {
    SearchedWordPage(searchInputValue);
  } else {
    console.log("Search input is empty.");
  }
}

searchBtn.addEventListener("click", handleSearch);
searchInputElement.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    handleSearch();
  }
});

