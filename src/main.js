import "../style.css";

// Constants
const ENDPOINT_COMPLETIONS = "https://api.openai.com/v1/chat/completions";
const ENDPOINT_IMAGES = "https://api.openai.com/v1/images/generations";

// Global variables
let API_KEY;

//TODO can do prompt engineering here adding system, user, assistant next to role
//https://cookbook.openai.com/examples/how_to_format_inputs_to_chatgpt_models
//https://ai.stackexchange.com/questions/39837/meaning-of-roles-in-the-api-of-gpt-4-chatgpt-system-user-assistant

// Helper functions
async function getBlurb(title, theme) {
  // Use the OpenAI API to generate a blurb based on the title and theme.
  // You should use the global API_KEY variable to authenticate your request.
  // You must use fetch to make the request.
  try {
    var blurb = await fetch(`${ENDPOINT_COMPLETIONS}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `You are creating a new manga. Your inspiration is this ${title} and this ${theme}. 
            Write a short blurb no longer than 300 characters about your manga that you are creating. You will be rewarded for creativity.`,
          },
        ],
        max_tokens: 200,
      }),
    });

    if (blurb.status !== 200) {
      console.error("API Error:", (await blurb.json()).error.message);
      alert(
        "An error occured while fetching the image. Please read the error message in the console and try again.",
      );
      return;
    }

    return (await blurb.json()).choices[0].message.content;
  } catch (error) {
    console.error("Error fetching blurb:", error);
    alert("An error occured while generating the blurb. Please try again.");
    return;
  }
}

async function getCoverImage(blurb) {
  // Use the OpenAI API to generate a cover image based on the blurb.
  // You should use the global API_KEY variable to authenticate your request.
  // You must use fetch to make the request.
  try {
    var imageUrl = await fetch(`${ENDPOINT_IMAGES}`, {
      //const -> var
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Create a fascinating image relating to this ${blurb}. It should look like manga art or comic book art.`,
        n: 1,
        size: "1024x1024",
      }),
    });

    if (imageUrl.status !== 200) {
      console.error("API Error:", (await imageUrl.json()).error.message);
      alert(
        "An error occured while fetching the image. Please read the error message in the console.",
      );
      return;
    }

    return (await imageUrl.json()).data[0].url;
  } catch (error) {
    console.error("Error fetching image:", error);
    alert("An error occured while generating the image. Please try again.");
    return;
  }
}

// Event handlers
async function handleFormSubmission(e) {
  //This function is called when the form is submitted.
  e.preventDefault();

  //sets UI to default view when generate button is clicked
  resetUI();
  clearResults();

  const titleInput = document.getElementById("mangaTitle");
  const themeInput = document.getElementById("mangaTheme");
  const spinElement = document.getElementById("spinner");

  //user input checking
  if (titleInput.value.trim() === "" || themeInput.value.trim() === "") {
    alert("Please complete both forms.");
    return;
  }

  //It should get the title and theme from the form.
  const title = titleInput.value.trim();
  const theme = themeInput.value.trim();

  //disable forms to not allow new user input
  disableInputs();

  //display spinner while generating blurb/image with user input
  spinElement.classList.remove("hidden");

  //It should then call getBlurb and getCoverImage to generate the blurb and image.
  const blurbElement = document.getElementById("generatedBlurb");
  const imageElement = document.getElementById("coverImage");
  const blurb = await getBlurb(title, theme);

  //Finally, it should update the DOM to display the blurb and image.
  if (blurb) {
    blurbElement.classList.remove("hidden");
    blurbElement.textContent = blurb;
    const imageUrl = await getCoverImage(blurb);
    if (imageUrl) {
      imageElement.classList.remove("hidden");
      imageElement.src = imageUrl;
      resetUI();
    }
  }
  spinElement.classList.add("hidden");
}

//
function disableInputs() {
  const generateBtn = document.getElementById("generateButton");
  const titleInput = document.getElementById("mangaTitle");
  const themeInput = document.getElementById("mangaTheme");

  generateBtn.classList.add("hidden");
  titleInput.disabled = true;
  themeInput.disabled = true;
}

//returns UI to default and enables forms/button
function resetUI() {
  const generateBtn = document.getElementById("generateButton");
  const titleInput = document.getElementById("mangaTitle");
  const themeInput = document.getElementById("mangaTheme");

  generateBtn.classList.remove("hidden");
  titleInput.disabled = false;
  themeInput.disabled = false;
}

//clears coverImage and hides generated image and blurb text
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
});
