const userMessage = [
  ["html", "css", "javascript"],
  ["frontend", "backend", "fullstack"],
  ["framework", "library", "tool"],
  ["tutorial", "resource", "guide"],
  ["debug", "error", "issue"],
  ["web design", "user experience", "UI/UX"],
  ["responsive design", "mobile-friendly"],
  ["portfolio", "resume", "personal website"],
  ["git", "version control", "repository"],
  ["hosting", "deployment", "server"],
  ["career", "job", "freelance"],
  ["portfolio review", "code review"],
  ["learning path", "career advice"],
  ["community", "forum", "networking"]
];

const botReply = [
  ["Great! Let's talk about HTML/CSS/JavaScript. What do you need help with?"],
  ["Are you focusing on frontend, backend, or fullstack development?"],
  ["Are you looking for a framework, library, or tool recommendation?"],
  ["Do you need a tutorial, resource, or guide on a specific topic?"],
  ["Facing any debugging issues? Let's tackle them together."],
  ["Interested in web design, user experience, or UI/UX principles?"],
  ["Need help with making your website responsive or mobile-friendly?"],
  ["Thinking about building a portfolio, resume, or personal website?"],
  ["Want to learn more about Git, version control, or managing repositories?"],
  ["Questions about hosting, deployment, or setting up a server?"],
  ["Seeking advice on your career path, job opportunities, or freelancing?"],
  ["Interested in getting feedback on your portfolio or code?"],
  ["Looking for guidance on your learning path or career development?"],
  ["Interested in joining a community, forum, or networking with others?"]
];

const alternative = [
  "Could you please provide more details?",
  "Let's dive deeper into that topic.",
  "I'm here to assist you!",
  "Feel free to ask anything else.",
  "I'm listening. How can I help?"
];

// Define triggers for OpenAI
const openaiTriggers = ["tutorial", "resource", "guide", "debug", "error", "issue", "web design", "user experience", "UI/UX", "responsive design", "mobile-friendly", "portfolio", "resume", "personal website", "git", "version control", "repository", "hosting", "deployment", "server", "career", "job", "freelance", "portfolio review", "code review", "learning path", "career advice", "community", "forum", "networking"];

// Function to check if user input triggers OpenAI request
function shouldInvokeOpenAI(input) {
    return openaiTriggers.some(trigger => input.includes(trigger));
}

// Function to make API request to OpenAI
async function getOpenAIResponse(input) {
    // Define your OpenAI API key
    const apiKey = 'your-api-key';

    // Define the OpenAI API endpoint
    const apiUrl = 'https://api.openai.com/v1/completions';

    // Define the data to send in the request body
    const data = {
        model: 'text-davinci-003', // Specify the model you want to use
        prompt: input, // Pass the user input as the prompt
        max_tokens: 50 // Specify the maximum number of tokens in the response
    };

    try {
        // Make the API request using fetch
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // Include your API key in the Authorization header
            },
            body: JSON.stringify(data) // Convert the data object to JSON format
        });

        // Parse the JSON response
        const responseData = await response.json();

        // Extract the generated text from the response
        const generatedText = responseData.choices[0].text.trim();

        return generatedText;
    } catch (error) {
        console.error('Error making API request to OpenAI:', error);
        // Return an error message or handle the error as needed
        return 'An error occurred while processing your request. Please try again later.';
    }
}

function output(input) {
    let product;

    let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");

    text = text
        .replace(/[\W_]/g, " ")
        .replace(/ a /g, " ")
        .replace(/i feel /g, "")
        .replace(/whats/g, "what is")
        .replace(/please /g, "")
        .replace(/ please/g, "")
        .trim();

    // Check if user input triggers an OpenAI request
    if (shouldInvokeOpenAI(text)) {
        // Make request to OpenAI API and get response
        product = await getOpenAIResponse(input);
    } else {
        // Continue using predefined responses
        let comparedText = compare(userMessage, botReply, text);
        product = comparedText ? comparedText : alternative[Math.floor(Math.random() * alternative.length)];
    }

    addChat(input, product);
}

function compare(triggerArray, replyArray, string) {
    let item;
    for (let x = 0; x < triggerArray.length; x++) {
        for (let y = 0; y < replyArray.length; y++) {
            if (triggerArray[x][y] == string) {
                items = replyArray[x];
                item = items[Math.floor(Math.random() * items.length)];
            }
        }
    }
    //containMessageCheck(string);
    if (item) return item;
    else return containMessageCheck(string);
}

function containMessageCheck(string) {
let expectedReply = [
  [
    "Feel free to ask if you have any more questions!",
    "Happy coding! Let me know if you need further assistance.",
    "Keep learning and exploring! Bye for now."
  ],
  ["Rest well and come back refreshed for more coding adventures!"],
  ["Enjoy your evening! Don't hesitate to reach out if you need help."],
  ["Have a productive day of coding ahead!"],
  ["Hope you have a productive afternoon!"]
];
let expectedMessage = [
  ["bye", "tc", "take care"],
  ["night", "good night"],
  ["evening", "good evening"],
  ["morning", "good morning"],
  ["noon"]
];

    let item;
    for (let x = 0; x < expectedMessage.length; x++) {
        if (expectedMessage[x].includes(string)) {
            items = expectedReply[x];
            item = items[Math.floor(Math.random() * items.length)];
        }
    }
    return item;
}

function addChat(input, product) {
    const mainDiv = document.getElementById("message-section");
    let userDiv = document.createElement("div");
    userDiv.id = "user";
    userDiv.classList.add("message");
    userDiv.innerHTML = `<span id="user-response">${input}</span>`;
    mainDiv.appendChild(userDiv);

    let botDiv = document.createElement("div");
    botDiv.id = "bot";
    botDiv.classList.add("message");
    botDiv.innerHTML = `<span id="bot-response">${product}</span>`;
    mainDiv.appendChild(botDiv);
    var scroll = document.getElementById("message-section");
    scroll.scrollTop = scroll.scrollHeight;
}

// Example usage
output("I need help with CSS");
