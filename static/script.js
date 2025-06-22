document.addEventListener('DOMContentLoaded', function() {
    const chatIcon = document.getElementById('chatbot-icon');
    const chatPopup = document.getElementById('chat-popup');
    const closeBtn = document.getElementById('close-chat');

    chatIcon.addEventListener('click', function() {
        chatPopup.classList.remove('hidden');
        chatIcon.style.display = 'none';
    });

    closeBtn.addEventListener('click', function() {
        chatPopup.classList.add('hidden');
        chatIcon.style.display = 'flex';
    });

    // Prevent form submission for now
    document.getElementById('send-btn').addEventListener('click', function(e) {
        e.preventDefault();
        // Placeholder: do nothing
    });

    // Add redirect for 'Shop by Sport' button
    const actionBtns = document.querySelectorAll('.action-btn');
    if (actionBtns.length > 0) {
        actionBtns[0].addEventListener('click', function() {
            window.open('https://www.adidas.de/schuhe', '_blank');
        });
    }
    if (actionBtns.length > 1) {
        actionBtns[1].addEventListener('click', function() {
            window.open('https://www.adidas.de/neu', '_blank');
        });
    }
    if (actionBtns.length > 2) {
        actionBtns[2].addEventListener('click', function() {
            window.open('https://www.adidas.de/manner-accessoires-outlet', '_blank');
        });
    }
    if (actionBtns.length > 3) {
        actionBtns[3].addEventListener('click', function() {
            showHumanModal();
        });
    }

    function showHumanModal() {
        // Create overlay and modal
        const overlay = document.createElement('div');
        overlay.className = 'chat-modal-overlay';
        overlay.innerHTML = `
            <div class="chat-modal">
                <h3>Talk to a Human</h3>
                <label>First Name</label>
                <input type="text" id="modal-firstname" required />
                <label>Last Name</label>
                <input type="text" id="modal-lastname" required />
                <label>Email</label>
                <input type="email" id="modal-email" required />
                <label>Customer Number</label>
                <input type="text" id="modal-customer" required />
                <label>Order ID</label>
                <input type="text" id="modal-orderid" required />
                <button id="modal-submit">Submit</button>
            </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('modal-submit').onclick = function() {
            const fname = document.getElementById('modal-firstname').value.trim();
            const lname = document.getElementById('modal-lastname').value.trim();
            const email = document.getElementById('modal-email').value.trim();
            const customer = document.getElementById('modal-customer').value.trim();
            const orderid = document.getElementById('modal-orderid').value.trim();
            if (!fname || !lname || !email || !customer || !orderid) {
                alert('Please fill in all fields.');
                return;
            }
            showWaitingScreen(overlay);
        };
    }

    function showWaitingScreen(overlay) {
        overlay.innerHTML = `
            <div class=\"chat-modal waiting-screen\">\n                <h3>Thank you! Please wait patiently while we connect you to a human agent.</h3>\n                <p>Estimated waiting time: <span class=\"waiting-timer\" id=\"waiting-timer\">0:05</span></p>\n                <div class=\"waiting-music\">\n                    <audio id=\"waiting-audio\" controls autoplay loop style=\"width: 100%; max-width: 250px;\">\n                        <source src=\"https://cdn.pixabay.com/audio/2022/10/16/audio_12b6fae3b2.mp3\" type=\"audio/mpeg\">\n                        Your browser does not support the audio element.\n                    </audio>\n                </div>\n            </div>\n        `;
        // Timer logic
        let seconds = 5;
        const timerEl = document.getElementById('waiting-timer');
        const interval = setInterval(() => {
            seconds--;
            const min = Math.floor(seconds / 60);
            const sec = seconds % 60;
            timerEl.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
            if (seconds <= 0) {
                clearInterval(interval);
                timerEl.textContent = '0:00';
                // After waiting, close modal and show Max's message
                document.body.removeChild(overlay);
                addMaxMessage();
            }
        }, 1000);
        // Try to play audio after DOM update
        setTimeout(() => {
            const audio = document.getElementById('waiting-audio');
            if (audio) {
                audio.play().catch(() => {});
            }
        }, 100);
    }

    function addMaxMessage() {
        const chatBody = document.getElementById('chat-body');
        // Remove welcome if present
        const welcome = chatBody.querySelector('.chat-welcome');
        if (welcome) welcome.remove();
        // Add Max's message
        const msg = document.createElement('div');
        msg.className = 'chat-message max-message';
        msg.innerHTML = '<strong>Max:</strong> Hi, I am Max, How can I help you.';
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
        // Enable chat input
        document.getElementById('user-input').disabled = false;
        document.getElementById('send-btn').disabled = false;
    }

    // Disable chat input by default until Max is ready
    document.getElementById('user-input').disabled = true;
    document.getElementById('send-btn').disabled = true;

    // Send user message to backend (ChatGPT integration placeholder)
    document.getElementById('send-btn').addEventListener('click', function(e) {
        e.preventDefault();
        const input = document.getElementById('user-input');
        const text = input.value.trim();
        if (!text) return;
        addUserMessage(text);
        input.value = '';
        // Call backend for ChatGPT response
        fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        })
        .then(res => res.json())
        .then(data => {
            addMaxReply(data.reply);
        });
    });

    function addUserMessage(text) {
        const chatBody = document.getElementById('chat-body');
        const msg = document.createElement('div');
        msg.className = 'chat-message user-message';
        msg.innerHTML = `<strong>You:</strong> ${text}`;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    function addMaxReply(text) {
        const chatBody = document.getElementById('chat-body');
        const msg = document.createElement('div');
        msg.className = 'chat-message max-message';
        msg.innerHTML = `<strong>Max:</strong> ${text}`;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}); 