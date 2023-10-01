import "../style.css";
//import OpenAI from "openai";


// Constants
const ENDPOINT_COMPLETIONS = "https://api.openai.com/v1/chat/completions";
//key-value pairs are headers, get/append
const ENDPOINT_IMAGES = "https://api.openai.com/v1/images/generations";
const BASE_URL = "https://api.openai.com/v1";


// Global variables
let API_KEY;
//let MODEL = "gpt-3.5-turbo"

//https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type 
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json"); //only one needed for image?
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", `Bearer ${API_KEY}`);

//TODO can do prompt engineering here adding system, user, assistant next to role
//https://cookbook.openai.com/examples/how_to_format_inputs_to_chatgpt_models 
//https://ai.stackexchange.com/questions/39837/meaning-of-roles-in-the-api-of-gpt-4-chatgpt-system-user-assistant
var rawBlurb = JSON.stringify({
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "What is OpenAPI?"
    }
  ]
});

//request()
//TODO replace raw with JSON.stringify({ prompt }/`${blurb}
//https://community.openai.com/t/communicating-with-the-api-in-vanilla-js-no-server-side-stuff/4984/6
var blurbRequestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: rawBlurb, 
  redirect: 'follow'
};

var imageRequestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: imageArgs,
  redirect: 'follow'
};

//TODO for image creation, research 
//https://stackoverflow.com/questions/48284011/how-to-post-image-with-fetch
//https://github.com/sonnysangha/AI-Image-generator-microsoft-azure/blob/main/azure/src/functions/generateImage.js

var imageArgs = JSON.stringify({
  "prompt": "blurb", //TODO replace with ${blurb} ?
  "n": 1,
  "size": "1024x1024"
});

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




//TODO how to print content from reponse/fetch
//print(response["choices"][0]["message"]["content"]);


//TODO fetching an image
//https://developer.mozilla.org/en-US/docs/Web/API/Response#fetching_an_image
//https://stackoverflow.com/questions/50248329/fetch-image-from-api


// const image = document.querySelector('.container img');
// if ( !image.complete) {
// 	image.addEventListener('load', handleImageLoad);
// 	image.addEventListener('error', handleImageLoad);
// }

// Helper functions
async function getBlurb(title, theme) {
  // TODO Implement TITLE AND THEME INTO FETCH/REQUEST
  // Use the OpenAI API to generate a blurb based on the title and theme.
  //fetch(`${BASE_URL}/chat/completions?apikey=${API_KEY}&q=${city}`)
  // fetch(`${ENDPOINT_COMPLETIONS}`, blurbRequestOptions) //TODO replace var 
  try {
    const blurb = fetch(`${ENDPOINT_COMPLETIONS}`, { //TODO should I add await?
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "user",
            "content": `You are a mangaka creating a new manga. Your inspiration is this ${title} and this ${theme}. 
            Write a short blurb about your manga that you are creating. You will be rewarded for creativity.`
          }
        ]
      }), 
    })
    return blurb.choices.message; //TODO undefined
  } catch(error) {
  console.error("Error fetching blurb:", error);
  alert("An error occured while generating the blurb. Please try again.")
  return null;
  };
  // You should use the global API_KEY variable to authenticate your request.
  // You must use fetch to make the request.
  // You should return the generated blurb.
}

async function getCoverImage(blurb) {
  // TODO Implement BLURB INTO FETCH/REQUEST!
  // Use the OpenAI API to generate a cover image based on the blurb.
  // You should use the global API_KEY variable to authenticate your request.

  fetch(`${ENDPOINT_IMAGES}`, imageRequestOptions) //imageRequestOptions is this needed?
  .then(response => {
    return objectURL = response.data.url; //TODO response.data is undefined
  })


  // .then((blob) => {
  //   const objectURL = URL.createObjectURL(blob);
  // })
  .then(result => console.log(result))
  .catch(error => {
  console.error("Error fetching image:", error);
  alert("An error occured while generating the image. Please try again.")
  return null;
  });
  // You must use fetch to make the request.
  // You should return the URL of the generated image.
  return objectURL; //TODO undefined
}

// Event handlers
async function handleFormSubmission(e) {
  // TODO Implement Me!
  // This function is called when the form is submitted.
  e.preventDefault();
  
  const generateBtn = document.getElementById("generateButton");
  const spinElement = document.getElementById("spinner"); 
  const titleElement = document.getElementById("mangaTitle");
  const themeElement = document.getElementById("mangaTheme");
  const imageElement = document.getElementById("coverImage");

  //TODO check if form has input that is not empty
  if (titleElement.value.trim() === "" || themeElement.value.trim() === "") {
    alert(
      "Please complete both forms.");
      return;
  } 
  titleElement.disabled = true;
  themeElement.disabled = true;
 
  

  generateBtn.classList.add("hidden");
  spinElement.classList.remove("hidden");
  spinElement.classList.remove("hidden"); //TODO figure out how to end animation docs  

  // It should get the title and theme from the form.
  const title = titleElement.value.trim();
  titleElement.value = "";
  const theme = themeElement.value.trim();
  themeElement.value = "";
  imageElement.src = "";



  // It should then call getBlurb and getCoverImage to generate the blurb and image.
  //TODO research wrapping in try-catch block
  const blurbElement = document.getElementById("generatedBlurb");
  const blurb = await getBlurb(title, theme);
  blurbElement.innerHTML = blurb;
  

  const imageUrl = await getCoverImage(blurb); 
  imageElement.src = imageUrl;

  if (imageUrl) {
    spinElement.classList.remove("hidden");
  }


  // Finally, it should update the DOM to display the blurb and image.

  
  

  updateUI(blurb, imageElement); //TODO make function refactoring lines43- 46
}

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
