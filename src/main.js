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

//TODO for image creation, research 
//https://stackoverflow.com/questions/48284011/how-to-post-image-with-fetch
//https://github.com/sonnysangha/AI-Image-generator-microsoft-azure/blob/main/azure/src/functions/generateImage.js


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
   // You should use the global API_KEY variable to authenticate your request.
  // You must use fetch to make the request.
  try {
    var blurb = await fetch(`${ENDPOINT_COMPLETIONS}`, { //TODO should I add await?
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type" : "application/json"
      },//myHeaders,
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "user",
            "content": `You are creating a new manga. Your inspiration is this ${title} and this ${theme}. 
            Write a short blurb no longer than 200 characters about your manga that you are creating. You will be rewarded for creativity.`
          }
        ],
        "max_tokens": 200
      }), 
    })
    .then (response => response.json())
    .then(json => 
      //console.log(json.choices[0].message.content);
      blurb = json.choices[0].message.content
      //return json.choices[0].message.content
    );
      return blurb;
    
  // You should return the generated blurb.
    // console.log(blurb.choices[0].message.content);
    // return blurb.choices[0].message.content;  //blurb["choices"][0]["message"]["content"]
  } catch(error) {
  console.error("Error fetching blurb:", error);
  alert("An error occured while generating the blurb. Please try again.")
  return null;
  };

}

async function getCoverImage(blurb) {
  // TODO Implement BLURB INTO FETCH/REQUEST!
  // Use the OpenAI API to generate a cover image based on the blurb.
  // You should use the global API_KEY variable to authenticate your request.
  // You must use fetch to make the request.
  try {
    var imageUrl = await fetch(`${ENDPOINT_IMAGES}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type" : "application/json"
      },//myHeaders,
      body: JSON.stringify({
        "prompt": `Create a fascinating image relating to this ${blurb}. It should look like manga art or comic book art.`, 
        "n": 1,
        "size": "1024x1024"
      }), 
  })
  // You should return the URL of the generated image.
  // .then(response => response.json())
  // .then(json => {
  //   console.log(json.data);
  //   imageUrl = json.data.url;
  // });
  //console.log(JSON.parse(imageUrl.json()));
  //console.log(imageUrl.json());
  return (await imageUrl.json()); //(await imageUrl.json());
} catch(error) {
  console.error("Error fetching image:", error);
  alert("An error occured while generating the image. Please try again.")
  return null;
  };
  
  
}


// Event handlers
async function handleFormSubmission(e) {
  // TODO Implement Me!
  // This function is called when the form is submitted.
  e.preventDefault();
  
  //sets UI to default view when generate button is clicked
  resetUI(); 
  clearResults();

  const titleInput = document.getElementById("mangaTitle");
  const themeInput = document.getElementById("mangaTheme");
  const spinElement = document.getElementById("spinner"); 

  if (titleInput.value.trim() === "" || themeInput.value.trim() === "") {
    alert(
      "Please complete both forms.");
      return;
  }

  // It should get the title and theme from the form.
  const title = titleInput.value.trim();
  const theme = themeInput.value.trim();

  //disable forms to not allow new user input
  disableInputs();

  
  //clearResults();

  //display spinner while generating blurb/image with user input
  spinElement.classList.remove("hidden");

  // const imageElement = document.getElementById("coverImage");

  // //imageElement.src = ""; clears results
  // // imageElement.classList.add("hidden");


  // It should then call getBlurb and getCoverImage to generate the blurb and image.
  //TODO research wrapping in try-catch block
  const blurbElement = document.getElementById("generatedBlurb");
  const imageElement = document.getElementById("coverImage");
  const blurb = await getBlurb(title, theme);
  //console.log(blurb);
  
   // Finally, it should update the DOM to display the blurb and image.
   if (blurb) {
     blurbElement.classList.remove("hidden");
     blurbElement.textContent = blurb;
     //spinElement.classList.add("hidden");
     const imageUrl = await getCoverImage(blurb); 
     if (imageUrl) {
      console.log(imageUrl);
      //console.log(imageUrl.json());
       imageElement.classList.remove("hidden");
       imageElement.src = imageUrl.data[0].url;
        resetUI();
       //document.getElementById("generateButton").classList.remove("hidden");
     }
  }
  spinElement.classList.add("hidden");
  //document.getElementById("generateButton").addEventListener("click", clearResults());
       
  
}

function disableInputs() {
  const generateBtn = document.getElementById("generateButton");
  const titleInput = document.getElementById("mangaTitle");
  const themeInput = document.getElementById("mangaTheme");

  generateBtn.classList.add("hidden");
  titleInput.disabled = true;
  themeInput.disabled = true;

}

function resetUI() { //returns UI to default and enables forms/button
  const generateBtn = document.getElementById("generateButton");
  const titleInput = document.getElementById("mangaTitle");
  const themeInput = document.getElementById("mangaTheme");

  generateBtn.classList.remove("hidden");
  titleInput.disabled = false;
  themeInput.disabled = false;

}

function clearResults() {
  const imageElement = document.getElementById("coverImage");
  const blurbElement = document.getElementById("generatedBlurb");


  blurbElement.classList.add("hidden");
  imageElement.classList.add("hidden");
 
  blurbElement.textContent = "";
  imageElement.src = "";

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
//   const myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json"); //only one needed for image?
// //myHeaders.append("Accept", "application/json");
//   myHeaders.append("Authorization", `Bearer ${API_KEY}`);
});
