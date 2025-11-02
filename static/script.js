// Use the lucide UMD build in the browser (loaded via CDN in the template).
// `lucide-react` is a React package and cannot be imported directly in the browser.
function safeCreateIcons() {
    try {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    } catch (err) {
        // non-fatal: allow rest of script to run even if icons are not available yet
        console.warn('lucide createIcons not available yet', err);
    }
}

        let chatHistory = [];

        const welcomeScreen = document.getElementById('welcome-screen');
        const chatInterface = document.getElementById('chat-interface');
        const startButton = document.getElementById('start-button');
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        const messagesContainer = document.getElementById('messages-container');
        const typingIndicator = document.getElementById('typing-indicator');
        const themeToggle = document.getElementById('theme-toggle');
        const deleteButton = document.getElementById('delete-btn');
        const bulkCopyButton = document.getElementById('bulk-copy-btn');
        const downloadButton = document.getElementById('download-btn');
        const actionCards = document.querySelectorAll('.action-card');
        const particlesBg = document.getElementById('particles-bg');

        function createParticles() {
            // Clear existing particles
            particlesBg.innerHTML = '';
            
            for (let i = 0; i < 25; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.width = Math.random() * 4 + 2 + 'px';
                particle.style.height = particle.style.width;
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
                particle.style.animationDelay = Math.random() * 5 + 's';
                particle.style.opacity = Math.random() * 0.4 + 0.1;
                particlesBg.appendChild(particle);
            }
        }

        function init() {
            setupEventListeners();
            initializeWelcomeScreen();
            createParticles();
            loadTheme();
            loadChatHistory();
            // Attempt to render any <i data-lucide> icons that are present in the static HTML.
            // Call immediately, then retry shortly in case the lucide UMD CDN is still loading.
            safeCreateIcons();
            setTimeout(safeCreateIcons, 500);
            // Also try again after full load in case some resources are delayed.
            window.addEventListener('load', safeCreateIcons);
        }

        function setupEventListeners() {
            startButton.addEventListener('click', startChat);
            sendButton.addEventListener('click', sendMessage);
            messageInput.addEventListener('keydown', handleInputKeydown);
            themeToggle.addEventListener('change', toggleTheme);
            deleteButton.addEventListener('click', clearChat);
            bulkCopyButton.addEventListener('click', copyChatHistory);
            downloadButton.addEventListener('click', downloadChat);
            
            actionCards.forEach(card => {
                card.addEventListener('click', () => {
                    const prompt = card.getAttribute('data-prompt');
                    messageInput.value = prompt;
                    sendMessage();
                });
            });

            // Recreate particles on resize for better distribution
            window.addEventListener('resize', createParticles);
        }

        function initializeWelcomeScreen() {
            const typingText = document.getElementById('typing-text');
            const welcomeDescription = document.getElementById('welcome-description');
            const socialContainer = document.getElementById('social-container');

            typeWriter(typingText, "CS Assistant", 0, () => {
                setTimeout(() => {
                    welcomeDescription.style.opacity = '1';
                    setTimeout(() => {
                        socialContainer.style.opacity = '1';
                        setTimeout(() => {
                            startButton.style.opacity = '1';
                        }, 500);
                    }, 500);
                }, 500);
            });
        }

        function typeWriter(element, text, index, callback) {
            if (index < text.length) {
                element.innerHTML = text.substring(0, index + 1) + '<span class="cursor">|</span>';
                setTimeout(() => typeWriter(element, text, index + 1, callback), 100);
            } else {
                element.innerHTML = text;
                if (callback) callback();
            }
        }

        function startChat() {
            welcomeScreen.style.opacity = '0';
            setTimeout(() => {
                welcomeScreen.classList.add('hidden');
                chatInterface.classList.remove('hidden');
                messageInput.focus();
                
                chatInterface.style.opacity = '0';
                chatInterface.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    chatInterface.style.opacity = '1';
                    chatInterface.style.transform = 'translateY(0)';
                    chatInterface.style.transition = 'all 0.5s ease';
                }, 100);
            }, 500);
        }

        function handleInputKeydown(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
            
            setTimeout(() => {
                messageInput.style.height = 'auto';
                messageInput.style.height = Math.min(messageInput.scrollHeight, 130) + 'px';
            }, 0);
        }

        async function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;

            addMessage(message, 'user');
            messageInput.value = '';
            messageInput.style.height = 'auto';
            
            showTypingIndicator();
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message })
                });
                
                const data = await response.json();
                hideTypingIndicator();
                addMessage(data.response, 'bot');
                
            } catch (error) {
                hideTypingIndicator();
                addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                console.error('Error:', error);
            }
        }

        function addMessage(content, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i data-lucide="${sender === 'user' ? 'user' : 'bot'}"></i>
                </div>
                <div class="message-content">${formatMessage(content)}</div>
                <div class="message-time">
                    <i data-lucide="clock"></i>
                    <span class="timestamp">${timestamp}</span>
                </div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            scrollToBottom();
            
            if (sender === 'bot') {
                addMessageActions(messageDiv);
            }
            
            chatHistory.push({ content, sender, timestamp: new Date().toISOString() });
            saveChatHistory();

            safeCreateIcons();
        }

        function formatMessage(content) {
            return content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/- (.*?)(?=\\n|$)/g, '• $1<br>')
                .replace(/\\n/g, '<br>');
        }

        function addMessageActions(messageDiv) {
            const messageContent = messageDiv.querySelector('.message-content');
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';
            
            actionsDiv.innerHTML = `
                <button class="msg-action-btn copy-btn">
                    <i data-lucide="copy"></i>
                    <span>Copy</span>
                </button>
                <button class="msg-action-btn feedback-btn">
                    <i data-lucide="thumbs-up"></i>
                    <span>Helpful</span>
                </button>
                <button class="msg-action-btn feedback-btn">
                    <i data-lucide="thumbs-down"></i>
                    <span>Not Helpful</span>
                </button>
            `;
            
            messageContent.appendChild(actionsDiv);
            
            const copyBtn = actionsDiv.querySelector('.copy-btn');
            const feedbackBtns = actionsDiv.querySelectorAll('.feedback-btn');
            
            copyBtn.addEventListener('click', () => {
                const textToCopy = messageContent.textContent.replace(/CopyHelpfulNot Helpful/g, '').trim();
                    navigator.clipboard.writeText(textToCopy).then(() => {
                    const icon = copyBtn.querySelector('i');
                    const span = copyBtn.querySelector('span');
                    icon.setAttribute('data-lucide', 'check');
                    span.textContent = 'Copied!';
                    safeCreateIcons();
                    setTimeout(() => {
                        icon.setAttribute('data-lucide', 'copy');
                        span.textContent = 'Copy';
                        safeCreateIcons();
                    }, 2000);
                });
            });
            
            feedbackBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const wasHelpful = btn.querySelector('i').getAttribute('data-lucide') === 'thumbs-up';
                    showFeedback(wasHelpful);
                });
            });

            safeCreateIcons();
        }

        function showTypingIndicator() {
            typingIndicator.classList.remove('hidden');
            scrollToBottom();
        }

        function hideTypingIndicator() {
            typingIndicator.classList.add('hidden');
        }

        function scrollToBottom() {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }

        function loadTheme() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            setTheme(savedTheme);
            themeToggle.checked = savedTheme === 'light';
            
            // Update icons based on theme
            updateThemeIcons(savedTheme);
        }

        function toggleTheme() {
            const newTheme = themeToggle.checked ? 'light' : 'dark';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        }

        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }

        function updateThemeIcons(theme) {
            const sunIcon = document.querySelector('.sun-icon');
            const moonIcon = document.querySelector('.moon-icon');
            
            if (theme === 'light') {
                sunIcon.style.opacity = '1';
                sunIcon.style.transform = 'translateY(-50%) scale(1.2)';
                moonIcon.style.opacity = '0';
                moonIcon.style.transform = 'translateY(-50%) scale(0.8)';
            } else {
                sunIcon.style.opacity = '0';
                sunIcon.style.transform = 'translateY(-50%) scale(0.8)';
                moonIcon.style.opacity = '1';
                moonIcon.style.transform = 'translateY(-50%) scale(1.2)';
            }
        }

        function loadChatHistory() {
            const saved = localStorage.getItem('chatHistory');
            if (saved) {
                chatHistory = JSON.parse(saved);
            }
        }

        function saveChatHistory() {
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }

        function clearChat() {
            if (confirm('Are you sure you want to clear the chat history?')) {
                messagesContainer.innerHTML = `
                    <div class="message bot-message">
                        <div class="message-avatar">
                            <i data-lucide="bot"></i>
                        </div>
                        <div class="message-content">
                            Chat cleared! Ready to explore new CS topics.
                            <div class="message-actions">
                                <button class="msg-action-btn">
                                    <i data-lucide="copy"></i>
                                    <span>Copy</span>
                                </button>
                            </div>
                        </div>
                        <div class="message-time">
                            <i data-lucide="clock"></i>
                            <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                `;
                
                chatHistory = [];
                saveChatHistory();
                safeCreateIcons();
            }
        }

        function copyChatHistory() {
            const chatText = chatHistory.map(msg => 
                `${msg.sender === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
            ).join('\\n\\n');
            
            navigator.clipboard.writeText(chatText).then(() => {
                const icon = bulkCopyButton.querySelector('i');
                const span = bulkCopyButton.querySelector('span');
                const originalIcon = icon.getAttribute('data-lucide');
                const originalText = span.textContent;
                
                icon.setAttribute('data-lucide', 'check');
                span.textContent = 'Copied!';
                safeCreateIcons();

                setTimeout(() => {
                    icon.setAttribute('data-lucide', originalIcon);
                    span.textContent = originalText;
                    safeCreateIcons();
                }, 2000);
            });
        }

        function downloadChat() {
            const chatText = chatHistory.map(msg => 
                `${msg.sender === 'user' ? 'You' : 'Assistant'} (${msg.timestamp}): ${msg.content}`
            ).join('\\n\\n');
            
            const blob = new Blob([chatText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cs-assistant-chat-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function showFeedback(wasHelpful) {
            const feedback = document.createElement('div');
            feedback.textContent = wasHelpful ? 'Thanks for your feedback! 👍' : "Sorry to hear that. I'll try to improve! 👎";
            feedback.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${wasHelpful ? '#4CAF50' : '#f44336'};
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                z-index: 1000;
                animation: slideInRight 0.4s ease;
                font-weight: 600;
            `;
            
            document.body.appendChild(feedback);
            
            setTimeout(() => {
                feedback.style.animation = 'slideOutRight 0.4s ease';
                setTimeout(() => {
                    document.body.removeChild(feedback);
                }, 400);
            }, 3000);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.addEventListener('DOMContentLoaded', init);