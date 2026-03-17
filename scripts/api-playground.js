// api-playground.js
// API Playground functionality

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const methodSelect = document.querySelector('.method-select');
    const urlInput = document.querySelector('.url-input');
    const sendButton = document.querySelector('.send-button');
    const responsePre = document.querySelector('.response-pre');
    const responseHeader = document.querySelector('.response-header');
    const exampleLinks = document.querySelectorAll('.example-link');
    
    // Store headers
    let headers = [];
    
    // History (localStorage)
    let requestHistory = [];
    try {
        const saved = localStorage.getItem('apiPlayground_history');
        if (saved) requestHistory = JSON.parse(saved);
    } catch (e) {
        console.log('No history yet');
    }
    
    // Example endpoints
    const examples = {
        '🐙': 'https://api.github.com/users/duskyfelis',
        '☁️': 'https://api.weather.gov/points/39.7456,-97.0892',
        '⚡': 'https://pokeapi.co/api/v2/pokemon/pikachu',
        '📦': 'https://jsonplaceholder.typicode.com/posts/1',
        '💰': 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=gbp',
        '📺': 'https://api.tvmaze.com/shows/1'
    };
    
    // Initialize
    function init() {
        // Load last request from history
        if (requestHistory.length > 0) {
            const last = requestHistory[0];
            methodSelect.value = last.method || 'GET';
            urlInput.value = last.url || '';
        }
        
        // Add event listeners
        sendButton.addEventListener('click', sendRequest);
        urlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendRequest();
        });
        
        // Example links
        exampleLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const card = this.closest('.example-card');
                const icon = card.querySelector('.example-icon').textContent;
                const url = examples[icon];
                if (url) {
                    urlInput.value = url;
                    methodSelect.value = 'GET';
                    sendRequest();
                }
            });
        });
        
        // Add headers UI
        addHeadersUI();
    }
    
    // Send request
    async function sendRequest() {
        const method = methodSelect.value;
        let url = urlInput.value.trim();
        
        if (!url) {
            showError('Please enter a URL');
            return;
        }
        
        // Add https:// if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
            urlInput.value = url;
        }
        
        // Update UI
        sendButton.textContent = 'Sending...';
        sendButton.disabled = true;
        responsePre.textContent = 'Loading...';
        
        // Get headers
        const requestHeaders = getHeaders();
        
        try {
            const startTime = performance.now();
            
            const response = await fetch(url, {
                method: method,
                headers: requestHeaders,
                mode: 'cors'
            });
            
            const endTime = performance.now();
            const timeMs = Math.round(endTime - startTime);
            
            // Get response text
            let responseText;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                try {
                    const json = await response.json();
                    responseText = JSON.stringify(json, null, 2);
                } catch {
                    responseText = await response.text();
                }
            } else {
                responseText = await response.text();
            }
            
            // Update response window
            responsePre.textContent = responseText;
            
            // Update header with status
            const statusSpan = responseHeader.querySelector('span:last-child');
            if (response.ok) {
                statusSpan.className = 'status-success';
                statusSpan.textContent = `${response.status} ${response.statusText} · ${timeMs}ms`;
            } else {
                statusSpan.className = 'status-error';
                statusSpan.textContent = `${response.status} ${response.statusText} · ${timeMs}ms`;
            }
            
            // Save to history
            saveToHistory(method, url);
            
        } catch (error) {
            showError(`Error: ${error.message}`);
        } finally {
            sendButton.textContent = 'Send';
            sendButton.disabled = false;
        }
    }
    
    // Get headers from UI
    function getHeaders() {
        const headersObj = {};
        const headerRows = document.querySelectorAll('.header-row');
        
        headerRows.forEach(row => {
            const keyInput = row.querySelector('.header-key');
            const valueInput = row.querySelector('.header-value');
            
            if (keyInput && valueInput) {
                const key = keyInput.value.trim();
                const value = valueInput.value.trim();
                if (key && value) {
                    headersObj[key] = value;
                }
            }
        });
        
        return headersObj;
    }
    
    // Add headers UI
    function addHeadersUI() {
        const demoContainer = document.querySelector('.demo-container');
        if (!demoContainer) return;
        
        // Headers section
        const headersDiv = document.createElement('div');
        headersDiv.className = 'headers-section';
        headersDiv.style.cssText = `
            margin-top: 1.5rem;
            border-top: 1px solid rgba(168, 85, 247, 0.2);
            padding-top: 1.5rem;
        `;
        
        headersDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="color: white; margin: 0; font-size: 1.1rem;">Headers</h4>
                <button class="add-header-btn" style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.2); color: white; padding: 0.25rem 1rem; border-radius: 9999px; cursor: pointer; font-size: 0.9rem; transition: all 0.3s ease;">+ Add Header</button>
            </div>
            <div class="headers-list"></div>
        `;
        
        demoContainer.appendChild(headersDiv);
        
        // Add header button
        const addBtn = headersDiv.querySelector('.add-header-btn');
        addBtn.addEventListener('click', () => addHeaderRow());
        
        // Add common headers dropdown
        addCommonHeaders();
        
        // Add one empty header row
        addHeaderRow();
    }
    
    // Add common headers dropdown
    function addCommonHeaders() {
        const headersDiv = document.querySelector('.headers-section');
        if (!headersDiv) return;
        
        const commonDiv = document.createElement('div');
        commonDiv.style.cssText = `
            margin-bottom: 1rem;
            display: flex;
            gap: 0.5rem;
            align-items: center;
        `;
        
        commonDiv.innerHTML = `
            <span style="color: #9ca3af; font-size: 0.9rem;">Common:</span>
            <button class="common-header" data-key="Content-Type" data-value="application/json" style="background: rgba(168,85,247,0.05); border: 1px solid rgba(168,85,247,0.2); color: #a78bfa; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; cursor: pointer;">application/json</button>
            <button class="common-header" data-key="Authorization" data-value="Bearer token" style="background: rgba(168,85,247,0.05); border: 1px solid rgba(168,85,247,0.2); color: #a78bfa; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; cursor: pointer;">Bearer Auth</button>
            <button class="common-header" data-key="Accept" data-value="application/json" style="background: rgba(168,85,247,0.05); border: 1px solid rgba(168,85,247,0.2); color: #a78bfa; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; cursor: pointer;">Accept JSON</button>
        `;
        
        headersDiv.insertBefore(commonDiv, headersDiv.querySelector('.headers-list'));
        
        // Add event listeners to common headers
        document.querySelectorAll('.common-header').forEach(btn => {
            btn.addEventListener('click', function() {
                const key = this.dataset.key;
                const value = this.dataset.value;
                addHeaderRow(key, value);
            });
        });
    }
    
    // Add header row
    function addHeaderRow(key = '', value = '') {
        const headersList = document.querySelector('.headers-list');
        if (!headersList) return;
        
        const row = document.createElement('div');
        row.className = 'header-row';
        row.style.cssText = `
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            align-items: center;
        `;
        
        row.innerHTML = `
            <input type="text" class="header-key" placeholder="Header name (e.g., Authorization)" value="${key}" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(168,85,247,0.2); color: white; padding: 0.6rem; border-radius: 0.5rem; font-size: 0.9rem;">
            <input type="text" class="header-value" placeholder="Value" value="${value}" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(168,85,247,0.2); color: white; padding: 0.6rem; border-radius: 0.5rem; font-size: 0.9rem;">
            <button class="remove-header" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.5rem; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">×</button>
        `;
        
        // Remove button
        const removeBtn = row.querySelector('.remove-header');
        removeBtn.addEventListener('click', function() {
            const rows = document.querySelectorAll('.header-row');
            if (rows.length > 1) {
                row.remove();
            } else {
                // Clear inputs instead of removing last row
                row.querySelector('.header-key').value = '';
                row.querySelector('.header-value').value = '';
            }
        });
        
        headersList.appendChild(row);
    }
    
    // Save to history
    function saveToHistory(method, url) {
        const entry = { method, url, timestamp: Date.now() };
        
        // Remove duplicates
        requestHistory = requestHistory.filter(e => !(e.method === method && e.url === url));
        
        // Add to front
        requestHistory.unshift(entry);
        
        // Keep only last 20
        if (requestHistory.length > 20) requestHistory.pop();
        
        // Save
        try {
            localStorage.setItem('apiPlayground_history', JSON.stringify(requestHistory));
        } catch (e) {
            console.log('Failed to save history');
        }
    }
    
    // Show error in response window
    function showError(message) {
        responsePre.textContent = message;
        const statusSpan = responseHeader.querySelector('span:last-child');
        if (statusSpan) {
            statusSpan.className = 'status-error';
            statusSpan.textContent = 'Error';
        }
    }
    
    // Add keyboard shortcut (Ctrl+Enter)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            sendRequest();
        }
    });
    
    // Add history dropdown
    function addHistoryDropdown() {
        if (requestHistory.length === 0) return;
        
        const historyBtn = document.createElement('button');
        historyBtn.className = 'history-btn';
        historyBtn.innerHTML = '📋 History';
        historyBtn.style.cssText = `
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(168,85,247,0.2);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            cursor: pointer;
            margin-left: 0.5rem;
            transition: all 0.3s ease;
        `;
        
        historyBtn.addEventListener('mouseenter', () => {
            historyBtn.style.background = 'rgba(255,255,255,0.1)';
        });
        historyBtn.addEventListener('mouseleave', () => {
            historyBtn.style.background = 'rgba(255,255,255,0.05)';
        });
        
        // Insert next to send button
        const requestBar = document.querySelector('.request-bar');
        if (requestBar) {
            requestBar.appendChild(historyBtn);
        }
        
        historyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showHistoryMenu(historyBtn);
        });
    }
    
    // Show history menu
    function showHistoryMenu(anchor) {
        // Remove existing menu
        const existingMenu = document.querySelector('.history-menu');
        if (existingMenu) existingMenu.remove();
        
        const menu = document.createElement('div');
        menu.className = 'history-menu';
        menu.style.cssText = `
            position: absolute;
            background: rgba(20,20,25,0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(168,85,247,0.2);
            border-radius: 1rem;
            padding: 0.5rem;
            z-index: 1000;
            max-height: 300px;
            overflow-y: auto;
            min-width: 350px;
            box-shadow: 0 20px 30px -10px rgba(0,0,0,0.5);
        `;
        
        if (requestHistory.length === 0) {
            menu.innerHTML = '<div style="padding: 1rem; color: #9ca3af; text-align: center;">No history yet</div>';
        } else {
            requestHistory.slice(0, 10).forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.style.cssText = `
                    padding: 0.75rem;
                    cursor: pointer;
                    border-radius: 0.5rem;
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                    transition: all 0.2s ease;
                `;
                historyItem.innerHTML = `
                    <span style="color: #a855f7; font-weight: 600; min-width: 60px;">${item.method}</span>
                    <span style="color: #9ca3af; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;">${item.url}</span>
                `;
                
                historyItem.addEventListener('mouseenter', () => {
                    historyItem.style.background = 'rgba(168,85,247,0.1)';
                });
                historyItem.addEventListener('mouseleave', () => {
                    historyItem.style.background = 'none';
                });
                
                historyItem.addEventListener('click', () => {
                    methodSelect.value = item.method;
                    urlInput.value = item.url;
                    menu.remove();
                });
                
                menu.appendChild(historyItem);
            });
        }
        
        // Position menu
        const rect = anchor.getBoundingClientRect();
        menu.style.top = rect.bottom + window.scrollY + 5 + 'px';
        menu.style.left = rect.left + window.scrollX + 'px';
        
        // Close on click outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && e.target !== anchor) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
        
        document.body.appendChild(menu);
    }
    
    // Initialize history dropdown after a short delay
    setTimeout(addHistoryDropdown, 100);
    
});