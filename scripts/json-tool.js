// json-tool.js
// JSON Formatter & Validator

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const formatBtn = document.getElementById('formatBtn');
    const validateBtn = document.getElementById('validateBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const clearInputBtn = document.getElementById('clearInputBtn');
    const copyBtn = document.getElementById('copyBtn');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusMessage = document.getElementById('statusMessage');
    const outputBadge = document.getElementById('outputBadge');
    const indentSize = document.getElementById('indentSize');
    const realtimeToggle = document.getElementById('realtimeToggle');
    const charCount = document.getElementById('charCount');
    const lineCount = document.getElementById('lineCount');
    const jsonSize = document.getElementById('jsonSize');
    
    // Example cards
    const exampleCards = document.querySelectorAll('.example-mini-card');
    
    // Examples data
    const examples = {
        user: `{
  "name": "duskyfelis",
  "age": 28,
  "email": "duskyfelis@tuta.io",
  "isDeveloper": true,
  "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
  "projects": [
    {
      "name": "QR-Now",
      "type": "browser-extension",
      "active": true
    },
    {
      "name": "API Playground",
      "type": "web-tool",
      "active": true
    }
  ]
}`,
        products: `[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "price": 79.99,
    "inStock": true,
    "colors": ["black", "white", "blue"]
  },
  {
    "id": 2,
    "name": "Mechanical Keyboard",
    "price": 129.99,
    "inStock": false,
    "colors": ["black", "silver"]
  },
  {
    "id": 3,
    "name": "USB-C Hub",
    "price": 39.99,
    "inStock": true,
    "colors": ["gray"]
  }
]`,
        nested: `{
  "apiVersion": "1.0.0",
  "metadata": {
    "requestId": "req_123456",
    "timestamp": "2026-03-17T15:30:00Z",
    "source": "json-tool-demo"
  },
  "data": {
    "users": [
      {
        "id": "user_1",
        "profile": {
          "displayName": "Dusky Felis",
          "avatar": "https://example.com/avatar.png",
          "settings": {
            "theme": "dark",
            "notifications": {
              "email": true,
              "push": false,
              "sms": false
            }
          }
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 47
    }
  }
}`,
        api: `{
  "success": true,
  "status": 200,
  "data": {
    "weather": [
      {
        "city": "London",
        "temperature": 15.2,
        "unit": "celsius",
        "conditions": "Partly cloudy",
        "humidity": 72,
        "windSpeed": 8.5
      },
      {
        "city": "Tokyo",
        "temperature": 22.8,
        "unit": "celsius",
        "conditions": "Clear sky",
        "humidity": 45,
        "windSpeed": 3.2
      }
    ]
  },
  "message": "Weather data retrieved successfully"
}`
    };
    
    // Initialize
    function init() {
        // Event listeners
        formatBtn.addEventListener('click', formatJSON);
        validateBtn.addEventListener('click', validateJSON);
        minifyBtn.addEventListener('click', minifyJSON);
        clearBtn.addEventListener('click', clearAll);
        pasteBtn.addEventListener('click', pasteFromClipboard);
        clearInputBtn.addEventListener('click', clearInput);
        copyBtn.addEventListener('click', copyToClipboard);
        
        jsonInput.addEventListener('input', handleInput);
        
        // Example cards
        exampleCards.forEach(card => {
            card.addEventListener('click', function() {
                const example = this.dataset.example;
                if (examples[example]) {
                    jsonInput.value = examples[example];
                    handleInput();
                    // Auto-format when loading example
                    setTimeout(formatJSON, 50);
                }
            });
        });
        
        // Indent size change
        indentSize.addEventListener('change', function() {
            // Re-format with new indent if there's valid JSON
            if (jsonOutput.textContent && !jsonOutput.textContent.startsWith('❌')) {
                formatJSON();
            }
        });
        
        // Load last session
        loadLastSession();
    }
    
    // Handle input (real-time validation)
    function handleInput() {
        updateStats();
        
        if (realtimeToggle.checked) {
            validateJSON(false); // silent validation
        }
    }
    
    // Format JSON
    function formatJSON() {
        const input = jsonInput.value.trim();
        
        if (!input) {
            showStatus('invalid', 'No input to format');
            jsonOutput.textContent = 'Enter some JSON first';
            outputBadge.textContent = 'empty';
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            const indent = getIndent();
            const formatted = JSON.stringify(parsed, null, indent);
            
            jsonOutput.textContent = formatted;
            outputBadge.textContent = 'formatted';
            showStatus('valid', 'Valid JSON — formatted successfully');
            
        } catch (error) {
            jsonOutput.textContent = `❌ Error: ${error.message}`;
            outputBadge.textContent = 'error';
            showStatus('invalid', 'Invalid JSON — cannot format');
        }
    }
    
    // Validate JSON
    function validateJSON(showMessage = true) {
        const input = jsonInput.value.trim();
        
        if (!input) {
            if (showMessage) {
                jsonOutput.textContent = '';
                outputBadge.textContent = 'empty';
                showStatus('valid', 'No JSON to validate');
            }
            return;
        }
        
        try {
            JSON.parse(input);
            if (showMessage) {
                jsonOutput.textContent = '✅ JSON is valid!';
                outputBadge.textContent = 'valid';
                showStatus('valid', 'Valid JSON');
            }
        } catch (error) {
            if (showMessage) {
                jsonOutput.textContent = `❌ ${error.message}`;
                outputBadge.textContent = 'invalid';
                showStatus('invalid', 'Invalid JSON');
            }
        }
    }
    
    // Minify JSON
    function minifyJSON() {
        const input = jsonInput.value.trim();
        
        if (!input) {
            showStatus('invalid', 'No input to minify');
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            
            jsonOutput.textContent = minified;
            outputBadge.textContent = 'minified';
            showStatus('valid', 'Minified successfully');
            
        } catch (error) {
            jsonOutput.textContent = `❌ Error: ${error.message}`;
            outputBadge.textContent = 'error';
            showStatus('invalid', 'Invalid JSON — cannot minify');
        }
    }
    
    // Get indent value
    function getIndent() {
        const value = indentSize.value;
        if (value === 'tab') return '\t';
        return parseInt(value, 10);
    }
    
    // Update character/line/size stats
    function updateStats() {
        const text = jsonInput.value;
        const chars = text.length;
        const lines = text.split('\n').length;
        const bytes = new Blob([text]).size;
        
        charCount.textContent = chars.toLocaleString();
        lineCount.textContent = lines.toLocaleString();
        
        if (bytes < 1024) {
            jsonSize.textContent = `${bytes} B`;
        } else if (bytes < 1024 * 1024) {
            jsonSize.textContent = `${(bytes / 1024).toFixed(1)} KB`;
        } else {
            jsonSize.textContent = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        }
        
        // Save to localStorage
        try {
            localStorage.setItem('jsonTool_input', text);
            localStorage.setItem('jsonTool_timestamp', Date.now());
        } catch (e) {
            console.log('Failed to save session');
        }
    }
    
    // Load last session (less than 1 hour old)
    function loadLastSession() {
        try {
            const saved = localStorage.getItem('jsonTool_input');
            const timestamp = localStorage.getItem('jsonTool_timestamp');
            
            if (saved && timestamp) {
                const oneHour = 60 * 60 * 1000;
                if (Date.now() - parseInt(timestamp) < oneHour) {
                    jsonInput.value = saved;
                    updateStats();
                    
                    // Auto-format if there's content
                    if (saved.trim()) {
                        setTimeout(formatJSON, 100);
                    }
                }
            }
        } catch (e) {
            console.log('No saved session');
        }
    }
    
    // Clear all
    function clearAll() {
        jsonInput.value = '';
        jsonOutput.textContent = '';
        outputBadge.textContent = 'empty';
        showStatus('valid', 'Cleared');
        updateStats();
    }
    
    // Clear input only
    function clearInput() {
        jsonInput.value = '';
        updateStats();
        if (realtimeToggle.checked) {
            jsonOutput.textContent = '';
            outputBadge.textContent = 'empty';
            showStatus('valid', 'Input cleared');
        }
    }
    
    // Paste from clipboard
    async function pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            jsonInput.value = text;
            updateStats();
            handleInput();
            // Auto-format after paste
            setTimeout(formatJSON, 50);
        } catch (err) {
            alert('Failed to read clipboard. Please paste manually (Ctrl+V)');
        }
    }
    
    // Copy to clipboard
    async function copyToClipboard() {
        const text = jsonOutput.textContent;
        if (!text || text.startsWith('❌') || text === 'Enter some JSON first') {
            alert('Nothing to copy');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(text);
            
            // Visual feedback
            copyBtn.textContent = '✅';
            setTimeout(() => {
                copyBtn.textContent = '📋';
            }, 1000);
        } catch (err) {
            alert('Failed to copy');
        }
    }
    
    // Show status
    function showStatus(type, message) {
        statusIndicator.className = type === 'valid' ? 'status-valid' : 'status-invalid';
        statusIndicator.textContent = type === 'valid' ? 'Valid' : 'Invalid';
        statusMessage.textContent = message;
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter to format
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            formatJSON();
        }
        
        // Ctrl+Shift+V to validate
        if (e.ctrlKey && e.shiftKey && e.key === 'V') {
            e.preventDefault();
            validateJSON();
        }
        
        // Ctrl+M to minify
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            minifyJSON();
        }
    });
    
    // Start
    init();
});