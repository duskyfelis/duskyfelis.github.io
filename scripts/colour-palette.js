// colour-palette.js
// colour Palette Generator

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const basecolourPicker = document.getElementById('basecolourPicker');
    const basecolourHex = document.getElementById('basecolourHex');
    const schemeButtons = document.querySelectorAll('.scheme-btn');
    const paletteGrid = document.getElementById('paletteGrid');
    const randomBtn = document.getElementById('randomcolourBtn');
    const refreshBtn = document.getElementById('refreshPaletteBtn');
    const lockFirstBtn = document.getElementById('lockFirstBtn');
    const exportTabs = document.querySelectorAll('.export-tab');
    const exportCode = document.getElementById('exportCode');
    const copyBtn = document.getElementById('copyExportBtn');
    const contrastGrid = document.getElementById('contrastGrid');
    const saveBtn = document.getElementById('saveCurrentPalette');
    const savedPalettesList = document.getElementById('savedPalettesList');
    
    // Demo palettes
    const demoPalettes = document.querySelectorAll('.demo-palette');
    
    // State
    let currentScheme = 'monochromatic';
    let currentcolours = [];
    let lockBase = false;
    let savedPalettes = [];
    
    // Initialize
    function init() {
        loadSavedPalettes();
        generatePalette();
        setupEventListeners();
    }
    
    // Event listeners
    function setupEventListeners() {
        // Base colour picker
        basecolourPicker.addEventListener('input', function(e) {
            basecolourHex.value = e.target.value;
            if (!lockBase) generatePalette();
        });
        
        basecolourHex.addEventListener('input', function(e) {
            let value = e.target.value;
            if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
                basecolourPicker.value = value;
                if (!lockBase) generatePalette();
            }
        });
        
        // Scheme buttons
        schemeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                schemeButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentScheme = this.dataset.scheme;
                generatePalette();
            });
        });
        
        // Random button
        randomBtn.addEventListener('click', function() {
            const randomcolour = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            basecolourPicker.value = randomcolour;
            basecolourHex.value = randomcolour;
            if (!lockBase) generatePalette();
        });
        
        // Refresh button
        refreshBtn.addEventListener('click', function() {
            generatePalette();
        });
        
        // Lock base button
        lockFirstBtn.addEventListener('click', function() {
            lockBase = !lockBase;
            this.innerHTML = lockBase ? '<span>🔓</span> Unlock base' : '<span>🔒</span> Lock base';
        });
        
        // Export tabs
        exportTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                exportTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                updateExportCode(this.dataset.format);
            });
        });
        
        // Copy button
        copyBtn.addEventListener('click', function() {
            copyToClipboard(exportCode.textContent);
            showToast('📋 Copied to clipboard!');
        });
        
        // Save button
        saveBtn.addEventListener('click', function() {
            savePalette();
        });
        
        // Demo palettes
        demoPalettes.forEach(palette => {
            palette.addEventListener('click', function() {
                const colours = this.dataset.colours.split(',');
                loadPalettecolours(colours);
            });
        });
    }
    
    // Generate palette based on current scheme
    function generatePalette() {
        const baseHex = basecolourPicker.value;
        const baseRgb = hexToRgb(baseHex);
        
        let colours = [];
        
        switch(currentScheme) {
            case 'monochromatic':
                colours = generateMonochromatic(baseRgb);
                break;
            case 'complementary':
                colours = generateComplementary(baseRgb);
                break;
            case 'analogous':
                colours = generateAnalogous(baseRgb);
                break;
            case 'triadic':
                colours = generateTriadic(baseRgb);
                break;
            case 'tetradic':
                colours = generateTetradic(baseRgb);
                break;
            default:
                colours = generateMonochromatic(baseRgb);
        }
        
        currentcolours = colours;
        renderPalette(colours);
        renderContrastGrid(colours);
        updateExportCode('css');
    }
    
    // colour generation functions
    function generateMonochromatic(rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const colours = [];
        
        // Generate 5 shades
        for (let i = 0; i < 5; i++) {
            const lightness = 20 + (i * 15); // 20%, 35%, 50%, 65%, 80%
            const newHsl = { ...hsl, l: lightness / 100 };
            const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
            colours.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        }
        
        return colours;
    }
    
    function generateComplementary(rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const colours = [rgbToHex(rgb.r, rgb.g, rgb.b)];
        
        // Complementary colour (hue + 180°)
        const compHue = (hsl.h + 0.5) % 1.0;
        
        // Generate variations
        for (let i = 1; i < 5; i++) {
            const lightness = 30 + (i * 10);
            const newHsl = { h: compHue, s: hsl.s, l: lightness / 100 };
            const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
            colours.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        }
        
        return colours;
    }
    
    function generateAnalogous(rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const colours = [];
        
        // Generate 5 analogous colours (30° steps)
        for (let i = -2; i <= 2; i++) {
            const hue = (hsl.h + (i * 0.0833) + 1) % 1.0; // 30° = 0.0833
            const lightness = 30 + (Math.abs(i) * 5);
            const newHsl = { h: hue, s: hsl.s, l: lightness / 100 };
            const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
            colours.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        }
        
        return colours;
    }
    
    function generateTriadic(rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const colours = [rgbToHex(rgb.r, rgb.g, rgb.b)];
        
        // Triadic colours (120° apart)
        const triadicHue1 = (hsl.h + 0.333) % 1.0;
        const triadicHue2 = (hsl.h + 0.667) % 1.0;
        
        // Add variations
        const hues = [triadicHue1, triadicHue2];
        hues.forEach((hue, index) => {
            for (let i = 0; i < 2; i++) {
                const lightness = 30 + (index * 20) + (i * 15);
                const newHsl = { h: hue, s: hsl.s, l: lightness / 100 };
                const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
                colours.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
            }
        });
        
        return colours.slice(0, 5);
    }
    
    function generateTetradic(rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const colours = [];
        
        // Tetradic colours (90° apart)
        for (let i = 0; i < 4; i++) {
            const hue = (hsl.h + (i * 0.25)) % 1.0;
            const lightness = 30 + (i * 8);
            const newHsl = { h: hue, s: hsl.s, l: lightness / 100 };
            const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
            colours.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        }
        
        // Add one more variation
        const lastHue = (hsl.h + 0.125) % 1.0;
        const lastRgb = hslToRgb(lastHue, hsl.s, 0.6);
        colours.push(rgbToHex(lastRgb.r, lastRgb.g, lastRgb.b));
        
        return colours;
    }
    
    // Render palette
    function renderPalette(colours) {
        paletteGrid.innerHTML = '';
        
        colours.forEach((colour, index) => {
            const rgb = hexToRgb(colour);
            const card = document.createElement('div');
            card.className = 'colour-card';
            card.innerHTML = `
                <div class="colour-swatch" style="background: ${colour};" data-colour="${colour}"></div>
                <div class="colour-info">
                    <div class="colour-hex">${colour}</div>
                    <div class="colour-rgb">${rgb.r}, ${rgb.g}, ${rgb.b}</div>
                </div>
            `;
            
            // Copy on swatch click
            const swatch = card.querySelector('.colour-swatch');
            swatch.addEventListener('click', function() {
                copyToClipboard(colour);
                showToast(`🎨 Copied ${colour}`);
            });
            
            paletteGrid.appendChild(card);
        });
    }
    
    // Render contrast grid
    function renderContrastGrid(colours) {
        contrastGrid.innerHTML = '';
        
        // Show contrast between consecutive colours
        for (let i = 0; i < colours.length - 1; i++) {
            const colour1 = colours[i];
            const colour2 = colours[i + 1];
            const ratio = calculateContrast(colour1, colour2);
            const level = getContrastLevel(ratio);
            
            const card = document.createElement('div');
            card.className = 'contrast-card';
            card.innerHTML = `
                <div class="contrast-ratio ${level}">${ratio.toFixed(2)}:1</div>
                <div class="contrast-label">${colour1} ↔ ${colour2}</div>
            `;
            
            contrastGrid.appendChild(card);
        }
    }
    
    // Calculate contrast ratio (WCAG 2.1)
    function calculateContrast(colour1, colour2) {
        const l1 = getLuminance(hexToRgb(colour1));
        const l2 = getLuminance(hexToRgb(colour2));
        
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }
    
    // Get luminance
    function getLuminance(rgb) {
        const rsrgb = rgb.r / 255;
        const gsrgb = rgb.g / 255;
        const bsrgb = rgb.b / 255;
        
        const r = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
        const g = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
        const b = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    
    // Get contrast level
    function getContrastLevel(ratio) {
        if (ratio >= 7) return 'pass-aaa';
        if (ratio >= 4.5) return 'pass-aa';
        return 'fail';
    }
    
    // Update export code
    function updateExportCode(format) {
        let code = '';
        
        switch(format) {
            case 'css':
                code = generateCSSVariables();
                break;
            case 'tailwind':
                code = generateTailwindConfig();
                break;
            case 'scss':
                code = generateSCSSVariables();
                break;
            case 'json':
                code = generateJSON();
                break;
        }
        
        exportCode.textContent = code;
    }
    
    // Export formats
    function generateCSSVariables() {
        let css = '/* CSS Variables */\n:root {\n';
        currentcolours.forEach((colour, index) => {
            css += `  --colour-${index + 1}: ${colour};\n`;
        });
        css += '}';
        return css;
    }
    
    function generateTailwindConfig() {
        let config = '// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colours: {\n';
        currentcolours.forEach((colour, index) => {
            config += `        'primary-${index + 1}': '${colour}',\n`;
        });
        config += '      }\n    }\n  }\n}';
        return config;
    }
    
    function generateSCSSVariables() {
        let scss = '// SCSS Variables\n';
        currentcolours.forEach((colour, index) => {
            scss += `$colour-${index + 1}: ${colour};\n`;
        });
        return scss;
    }
    
    function generateJSON() {
        const palette = {
            name: 'Generated Palette',
            colours: currentcolours,
            scheme: currentScheme,
            timestamp: new Date().toISOString()
        };
        return JSON.stringify(palette, null, 2);
    }
    
    // Save palette
    function savePalette() {
        const name = prompt('Enter a name for this palette:', `Palette ${savedPalettes.length + 1}`);
        if (!name) return;
        
        const palette = {
            id: Date.now(),
            name: name,
            colours: [...currentcolours],
            scheme: currentScheme,
            timestamp: new Date().toISOString()
        };
        
        savedPalettes.unshift(palette);
        if (savedPalettes.length > 10) savedPalettes.pop();
        
        saveToLocalStorage();
        renderSavedPalettes();
        showToast('💾 Palette saved!');
    }
    
    // Load saved palettes
    function loadSavedPalettes() {
        try {
            const saved = localStorage.getItem('colourPalettes');
            if (saved) {
                savedPalettes = JSON.parse(saved);
                renderSavedPalettes();
            }
        } catch (e) {
            console.log('No saved palettes');
        }
    }
    
    // Save to localStorage
    function saveToLocalStorage() {
        try {
            localStorage.setItem('colourPalettes', JSON.stringify(savedPalettes));
        } catch (e) {
            console.log('Failed to save palettes');
        }
    }
    
    // Render saved palettes
    function renderSavedPalettes() {
        savedPalettesList.innerHTML = '';
        
        if (savedPalettes.length === 0) {
            savedPalettesList.innerHTML = '<div style="colour: #9ca3af; text-align: center; padding: 2rem;">No saved palettes yet</div>';
            return;
        }
        
        savedPalettes.forEach(palette => {
            const card = document.createElement('div');
            card.className = 'saved-palette-card';
            
            const coloursHtml = palette.colours.map(c => `<span style="background: ${c};"></span>`).join('');
            
            card.innerHTML = `
                <div class="saved-palette-colours">
                    ${coloursHtml}
                </div>
                <div class="saved-palette-info">
                    <span class="saved-palette-name">${palette.name}</span>
                    <div class="saved-palette-actions">
                        <button class="saved-palette-load" data-palette='${JSON.stringify(palette)}'>📂</button>
                        <button class="saved-palette-delete" data-id="${palette.id}">🗑️</button>
                    </div>
                </div>
            `;
            
            // Load palette
            const loadBtn = card.querySelector('.saved-palette-load');
            loadBtn.addEventListener('click', function() {
                const paletteData = JSON.parse(this.dataset.palette);
                loadPalettecolours(paletteData.colours);
            });
            
            // Delete palette
            const deleteBtn = card.querySelector('.saved-palette-delete');
            deleteBtn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                savedPalettes = savedPalettes.filter(p => p.id !== id);
                saveToLocalStorage();
                renderSavedPalettes();
                showToast('🗑️ Palette deleted');
            });
            
            savedPalettesList.appendChild(card);
        });
    }
    
    // Load palette colours
    function loadPalettecolours(colours) {
        basecolourPicker.value = colours[0];
        basecolourHex.value = colours[0];
        
        // Try to detect scheme from colours (simplified)
        currentcolours = colours;
        renderPalette(colours);
        renderContrastGrid(colours);
        updateExportCode('css');
    }
    
    // Copy to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(err => {
            console.log('Failed to copy');
        });
    }
    
    // Show toast notification
    function showToast(message) {
        let toast = document.querySelector('.toast-notification');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }
        
        toast.innerHTML = `<span>${message}</span>`;
        toast.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            toast.style.transform = 'translateY(400px)';
        }, 2000);
    }
    
    // colour conversion utilities
    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }
    
    function rgbToHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return { h, s, l };
    }
    
    function hslToRgb(h, s, l) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    
    // Start
    init();
});