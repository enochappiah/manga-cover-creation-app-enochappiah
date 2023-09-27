import "../style.css";
import OpenAI from "openai";


// Constants
const ENDPOINT_COMPLETIONS = "https://api.openai.com/v1/chat/completions";
//key-value pairs are headers, get/append
const ENDPOINT_IMAGES = "https://api.openai.com/v1/images/generations";
const BASE_URL = "https://api.openai.com/v1";
const openai = new OpenAI();

// Global variables
let API_KEY;
//let MODEL = "gpt-3.5-turbo"

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json"); //only one needed for image?
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", `Bearer ${API_KEY}`);

//TODO can do prompt engineering here adding system, user, assistant next to role
var raw = JSON.stringify({
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "What is OpenAPI?"
    }
  ]
});

//request()
var blurbRequestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

var imageRequestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

//TODO for image creation, research 

// var raw = JSON.stringify({
//   "prompt": "A cute baby sea otter",
//   "n": 2,
//   "size": "1024x1024"
// });

// var requestOptions = {
//   method: 'POST',
//   headers: myHeaders,
//   body: raw,
//   redirect: 'follow'
// };

// fetch("https://api.openai.com/v1/images/generations", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));


//TODO another way to complete a fetch/reponse with async but missing fetch here
// async function main() {
//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "system", content: "You are a helpful assistant." }],
//     model: "gpt-3.5-turbo",
//   });

//   console.log(completion.choices[0]);
// }

//TODO another way to complete a fetch and reponse --> needs to be combined with fetch
  // response = openai.ChatCompletion.create(
  //   model="gpt-3.5-turbo",
  //   messages=[
  //       {"role": "system", "content": "You are a laconic assistant. You reply with brief, to-the-point answers with no elaboration."},
  //       {"role": "user", "content": "Can you explain how fractions work?"},
  //   ],
  //   temperature=0,
  // );


//TODO how to print content from reponse/fetch
//print(response["choices"][0]["message"]["content"]);


//TODO fetching an image
//https://developer.mozilla.org/en-US/docs/Web/API/Response#fetching_an_image
//https://stackoverflow.com/questions/50248329/fetch-image-from-api




// Helper functions
async function getBlurb(title, theme) {
  // TODO Implement TITLE AND THEME INTO FETCH/REQUEST
  // Use the OpenAI API to generate a blurb based on the title and theme.
  //fetch(`${BASE_URL}/chat/completions?apikey=${API_KEY}&q=${city}`)
  fetch(`${BASE_URL}/chat/completions`, blurbRequestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
  // You should use the global API_KEY variable to authenticate your request.
  // You must use fetch to make the request.
  // You should return the generated blurb.
}

async function getCoverImage(blurb) {
  // TODO Implement BLURB INTO FETCH/REQUEST!
  // Use the OpenAI API to generate a cover image based on the blurb.
  // You should use the global API_KEY variable to authenticate your request.

  fetch(`${BASE_URL}/images/generations` ) //imageRequestOptions is this needed?
  .then(response => response.blob())
  .then((blob) => {
    const objectURL = URL.createObjectURL(blob);
  })
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
  // You must use fetch to make the request.
  // You should return the URL of the generated image.
  return objectURL;
}

// Event handlers
async function handleFormSubmission(e) {
  // TODO Implement Me!
  // This function is called when the form is submitted.
  e.preventDefault();
  // It should get the title and theme from the form.
  const title = document.getElementById("mangaTitle").value.trim();
  document.getElementById("mangaTitle").value = "";
  const theme = document.getElementById("mangaTheme").value.trim();
  document.getElementById("mangaTheme").value = "";
  // It should then call getBlurb and getCoverImage to generate the blurb and image.
  //TODO research wrapping in try-catch block
  const blurb = await getBlurb(title, theme);
  const imageUrl = await getCoverImage(blurb);
  // Finally, it should update the DOM to display the blurb and image.
  const blurbElement = document.getElementById("generatedBlurb");
  const imageElement = document.getElementById("coverImage");
  blurbElement.innerHTML = blurb;
  imageElement.src = await(getCoverImage(blurb));
  updateUI(blurb, imageElement); //TODO make function refactoring lines43- 46
}
//TODO addEventListener to update Dom?
// function updateDom(blurb, urlImage) {
//   const blurbElement = document.getElementById("generatedBlurb");
//   const imageElement = document.getElementById("coverImage");
//   blurbElement.innerHTML = blurb;

// }

document.addEventListener("DOMContentLoaded", () => {
  API_KEY = localStorage.getItem("openai_api_key");

  if (!API_KEY) {
    alert(
      "Please store your API key in local storage with the key 'openai_api_key'.",
    );
    return;
  }

  const mangaInputForm = document.getElementById("mangaInputForm");
  mangaInputForm.addEventListener("submit", handleFormSubmission);
});
