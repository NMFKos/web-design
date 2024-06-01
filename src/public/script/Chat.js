class InteractiveChatbox {
    constructor(a, b, c) {
        this.args = {
            button: a,
            chatbox: b
        }
        this.icons = c;
        this.state = false; 
    }

    display() {
        const {button, chatbox} = this.args;
        
        button.addEventListener('click', () => this.toggleState(chatbox))
        
    }

    toggleState(chatbox) {
        this.state = !this.state;
        this.showOrHideChatBox(chatbox, this.args.button);
    }

    showOrHideChatBox(chatbox, button) {
        if(this.state) {
            chatbox.classList.add('chatbox--active')
            chatbox.style.display = 'flex';
            this.toggleIcon(true, button);
        } else if (!this.state) {
            chatbox.classList.remove('chatbox--active')
            chatbox.style.display = 'none';
            this.toggleIcon(false, button);
        }
    }
    
      
    
    toggleIcon(state, button) {
        const { isClicked, isNotClicked } = this.icons;
        let b = button.children[0].innerHTML;

        if(state) {
            button.children[0].innerHTML = isClicked; 
        } else if(!state) {
            button.children[0].innerHTML = isNotClicked;
        }
    }
}
const chatHistory = document.getElementById('chatbox-history');
const userInput = document.getElementById('user-input');
const form = document.getElementById('chat-form');

async function sendMessage() {
    const userMessage = userInput.value;
    userInput.value = ''; // Clear input field
    console.log(userMessage)
    chatHistory.innerHTML += `<div class="user-message">${userMessage}</div>`;

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'messages__item messages__item--typing';
    typingIndicator.id = 'typing-indicator';
    typingIndicator.innerHTML = `
        <span class="messages__dot"></span>
        <span class="messages__dot"></span>
        <span class="messages__dot"></span>`;
    chatHistory.appendChild(typingIndicator);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    try {
        const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'userInput': userMessage }),
        });

        const data = await response.json();
        console.log(data)
        const botMessage = data.response;
        console.log(botMessage)
        const existingIndicator = document.getElementById('typing-indicator');
        if (existingIndicator) {
            chatHistory.removeChild(existingIndicator);
        }

        // Add chat message to the chat history
        chatHistory.innerHTML += `<div class="bot-message">${botMessage}</div>`;

        // Scroll to the bottom of the chat history
        chatHistory.scrollTop = chatHistory.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
        // Handle errors gracefully, e.g., display an error message to the user
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission
    const loader = document.getElementById('loader');
    //loader.style.display = 'none'; // Show the loader
    sendMessage().finally(() => {
   // loader.style.display = 'none'; // Hide the loader after the message is sent
    });;
});


//Open chat button
const charForm = document.getElementById('chat-form')
const chatButton = document.querySelector('.chatbox-button');
const chatContent = document.querySelector('.chatbox-support');
const icons = {
    isClicked: '</p>Close</p>',
    isNotClicked: '<p><i class="uil uil-chat"></i>Chatbot</p>'
}
const chatbox = new InteractiveChatbox(chatButton, chatContent, icons);
chatbox.display();
chatbox.toggleIcon(false, chatButton);
