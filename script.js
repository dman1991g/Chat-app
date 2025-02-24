// Smarter chatbot logic with improved response matching
const userMessage = [
    ["hello", "hi", "hey"],
    ["how are you", "how's it going"],
    ["who are you", "what are you"],
    ["what can you do", "features"],
    ["help", "support"],
    ["bye", "goodbye"]
];

const botReply = [
    ["Hello!", "Hi there!", "Hey! How can I help?"],
    ["I'm doing great! How about you?", "I'm good, thanks for asking!"],
    ["I'm a chatbot designed to help answer your questions."],
    ["I can provide information, answer basic questions, and chat with you."],
    ["Sure! How can I assist you today?"],
    ["Goodbye! Have a great day!", "See you later!"]
];

// Alternative responses for unknown inputs
const alternative = [
    "I'm not sure I understand.",
    "Can you rephrase that?",
    "I'm still learning! Could you ask in a different way?"
];

// Memory storage for user conversations
let chatContext = {};

function compare(triggerArray, replyArray, userInput) {
    let response = null;
    userInput = userInput.toLowerCase();

    for (let i = 0; i < triggerArray.length; i++) {
        for (let keyword of triggerArray[i]) {
            if (userInput.includes(keyword)) {
                response = replyArray[i][Math.floor(Math.random() * replyArray[i].length)];
                break;
            }
        }
        if (response) break;
    }

    return response || alternative[Math.floor(Math.random() * alternative.length)];
}

function output(input) {
    let userId = "default"; // Assume one user for now
    if (!chatContext[userId]) chatContext[userId] = { lastMessage: "" };

    let response;
    let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "").trim();

    if (chatContext[userId].lastMessage === "career") {
        response = "Are you looking for a job or just career advice?";
    } else {
        response = compare(userMessage, botReply, text);
    }

    chatContext[userId].lastMessage = text; // Store last message
    addChat(input, response);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            let input = document.getElementById("input").value;
            document.getElementById("input").value = "";
            output(input);
        }
    });

    document.querySelector(".send").addEventListener("click", function() {
        let input = document.getElementById("input").value;
        document.getElementById("input").value = "";
        output(input);
    });
});

function addChat(input, product) {
    const mainDiv = document.getElementById("message-section");

    let userDiv = document.createElement("div");
    userDiv.id = "user";
    userDiv.classList.add("message");
    userDiv.innerHTML = `<span id="user-response">${input}</span>`;
    mainDiv.appendChild(userDiv);

    // Bot Typing Animation
    let typingDiv = document.createElement("div");
    typingDiv.id = "bot-typing";
    typingDiv.classList.add("message");
    typingDiv.innerHTML = "<span>...</span>";
    mainDiv.appendChild(typingDiv);

    setTimeout(() => {
        mainDiv.removeChild(typingDiv);

        let botDiv = document.createElement("div");
        botDiv.id = "bot";
        botDiv.classList.add("message");
        botDiv.innerHTML = `<span id="bot-response">${product}</span>`;
        mainDiv.appendChild(botDiv);

        mainDiv.scrollTop = mainDiv.scrollHeight;
    }, 1000); // Simulate 1s typing delay
}