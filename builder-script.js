let selectedElement = null;
let elementCounter = 0;
let history = [];
let historyIndex = -1;

// Component Templates
const templates = {
    heading: '<h2 contenteditable="true" style="font-size: 2rem; color: #2d3748; margin: 10px 0;">Your Heading Here</h2>',
    paragraph: '<p contenteditable="true" style="line-height: 1.6; color: #4a5568;">Click to edit this paragraph. Add your content here.</p>',
    button: '<button style="padding: 12px 24px; background: #2c5282; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Click Me</button>',
    link: '<a href="#" contenteditable="true" style="color: #4299e1; text-decoration: none;">Link Text</a>',
    list: '<ul style="padding-left: 20px;"><li contenteditable="true">List item 1</li><li contenteditable="true">List item 2</li><li contenteditable="true">List item 3</li></ul>',
    section: '<div style="padding: 60px 20px; background: #f7fafc; border-radius: 8px;"><h3 contenteditable="true" style="font-size: 1.8rem; margin-bottom: 15px;">Section Title</h3><p contenteditable="true" style="color: #718096;">Section content goes here.</p></div>',
    container: '<div style="max-width: 1200px; margin: 0 auto; padding: 20px; background: white; border-radius: 8px;"><p contenteditable="true">Container content</p></div>',
    navbar: '<nav style="background: #1a202c; padding: 15px 20px; display: flex; gap: 20px; border-radius: 8px;"><a href="#" style="color: white; text-decoration: none;">Home</a><a href="#" style="color: white; text-decoration: none;">About</a><a href="#" style="color: white; text-decoration: none;">Services</a><a href="#" style="color: white; text-decoration: none;">Contact</a></nav>',
    footer: '<footer style="background: #1a202c; color: white; padding: 40px 20px; text-align: center; border-radius: 8px;"><p contenteditable="true">© 2026 Your Website. All rights reserved.</p></footer>',
    columns: '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 20px;"><div style="padding: 20px; background: #f7fafc; border-radius: 8px;"><p contenteditable="true">Column 1</p></div><div style="padding: 20px; background: #f7fafc; border-radius: 8px;"><p contenteditable="true">Column 2</p></div></div>',
    image: '<img src="https://via.placeholder.com/600x400" alt="Placeholder" style="max-width: 100%; height: auto; border-radius: 8px;">',
    video: '<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px;" allowfullscreen></iframe></div>',
    icon: '<div style="font-size: 3rem; text-align: center;">⭐</div>',
    form: '<form style="display: flex; flex-direction: column; gap: 15px; max-width: 500px; padding: 20px; background: #f7fafc; border-radius: 8px;"><input type="text" placeholder="Name" style="padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;"><input type="email" placeholder="Email" style="padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;"><textarea placeholder="Message" style="padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; min-height: 100px;"></textarea><button type="submit" style="padding: 12px; background: #2c5282; color: white; border: none; border-radius: 6px; cursor: pointer;">Submit</button></form>'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initDragDrop();
    initCanvas();
    loadProjectName();
    loadSavedWebsite();
});

// Tab switching
function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// Drag and Drop
function initDragDrop() {
    document.querySelectorAll('.component-item').forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('componentType', this.dataset.type);
}

function initCanvas() {
    const canvas = document.getElementById('canvas');
    
    canvas.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    canvas.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });
    
    canvas.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const componentType = e.dataTransfer.getData('componentType');
        addElementToCanvas(componentType);
    });
}

function addElementToCanvas(type) {
    const canvas = document.getElementById('canvas');
    
    // Remove placeholder
    const placeholder = canvas.querySelector('.canvas-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    
    // Create element wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'canvas-element';
    wrapper.dataset.elementId = elementCounter++;
    wrapper.dataset.type = type;
    
    wrapper.innerHTML = `
        <div class="element-controls">
            <button class="element-btn" onclick="duplicateElement(this)">📋</button>
            <button class="element-btn delete" onclick="deleteElement(this)">🗑️</button>
        </div>
        ${templates[type]}
    `;
    
    canvas.appendChild(wrapper);
    
    // Add click handler
    wrapper.addEventListener('click', function(e) {
        if (!e.target.classList.contains('element-btn')) {
            selectElement(this);
        }
    });
    
    saveToHistory();
}

function selectElement(element) {
    // Clear previous selection
    document.querySelectorAll('.canvas-element').forEach(el => {
        el.classList.remove('selected');
    });
    
    element.classList.add('selected');
    selectedElement = element;
    updatePropertiesPanel(element);
}

function updatePropertiesPanel(element) {
    const panel = document.getElementById('properties-panel');
    const type = element.dataset.type;
    
    panel.innerHTML = `
        <div class="property-group">
            <label>Element Type</label>
            <input type="text" value="${type}" readonly style="background: #e2e8f0;">
        </div>
        
        <div class="property-group">
            <label>Background Color</label>
            <div class="color-input-group">
                <input type="color" id="bg-color" value="#ffffff" onchange="updateStyle('backgroundColor', this.value)">
                <input type="text" id="bg-color-text" placeholder="#ffffff" onchange="updateStyle('backgroundColor', this.value)">
            </div>
        </div>
        
        <div class="property-group">
            <label>Text Color</label>
            <div class="color-input-group">
                <input type="color" id="text-color" value="#000000" onchange="updateStyle('color', this.value)">
                <input type="text" id="text-color-text" placeholder="#000000" onchange="updateStyle('color', this.value)">
            </div>
        </div>
        
        <div class="property-group">
            <label>Padding</label>
            <div class="slider-group">
                <input type="range" min="0" max="100" value="15" oninput="updateStyle('padding', this.value + 'px'); this.nextElementSibling.textContent = this.value + 'px'">
                <span>15px</span>
            </div>
        </div>
        
        <div class="property-group">
            <label>Margin</label>
            <div class="slider-group">
                <input type="range" min="0" max="100" value="10" oninput="updateStyle('margin', this.value + 'px'); this.nextElementSibling.textContent = this.value + 'px'">
                <span>10px</span>
            </div>
        </div>
        
        <div class="property-group">
            <label>Border Radius</label>
            <div class="slider-group">
                <input type="range" min="0" max="50" value="0" oninput="updateStyle('borderRadius', this.value + 'px'); this.nextElementSibling.textContent = this.value + 'px'">
                <span>0px</span>
            </div>
        </div>
        
        <div class="property-group">
            <label>Text Align</label>
            <select onchange="updateStyle('textAlign', this.value)">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
            </select>
        </div>
        
        <div class="property-group">
            <label>Font Size</label>
            <div class="slider-group">
                <input type="range" min="12" max="72" value="16" oninput="updateStyle('fontSize', this.value + 'px'); this.nextElementSibling.textContent = this.value + 'px'">
                <span>16px</span>
            </div>
        </div>
        
        <div class="property-group">
            <label>Font Weight</label>
            <select onchange="updateStyle('fontWeight', this.value)">
                <option value="300">Light</option>
                <option value="400" selected>Normal</option>
                <option value="600">Semi-Bold</option>
                <option value="700">Bold</option>
            </select>
        </div>
    `;
}

function updateStyle(property, value) {
    if (selectedElement) {
        const firstChild = selectedElement.children[1] || selectedElement.firstElementChild;
        if (firstChild) {
            firstChild.style[property] = value;
            saveToHistory();
        }
    }
}

function deleteElement(btn) {
    const element = btn.closest('.canvas-element');
    element.remove();
    selectedElement = null;
    document.getElementById('properties-panel').innerHTML = '<div class="no-selection"><p>Select an element to edit its properties</p></div>';
    saveToHistory();
}

function duplicateElement(btn) {
    const element = btn.closest('.canvas-element');
    const clone = element.cloneNode(true);
    clone.dataset.elementId = elementCounter++;
    element.parentNode.insertBefore(clone, element.nextSibling);
    
    // Re-attach event listeners
    clone.addEventListener('click', function(e) {
        if (!e.target.classList.contains('element-btn')) {
            selectElement(this);
        }
    });
    
    saveToHistory();
}

// Device preview
function setDevice(device) {
    const canvas = document.getElementById('canvas');
    document.querySelectorAll('.device-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    canvas.classList.remove('tablet', 'mobile');
    if (device !== 'desktop') {
        canvas.classList.add(device);
    }
}

// History functions
function saveToHistory() {
    const canvas = document.getElementById('canvas');
    history = history.slice(0, historyIndex + 1);
    history.push(canvas.innerHTML);
    historyIndex++;
}

function undoAction() {
    if (historyIndex > 0) {
        historyIndex--;
        document.getElementById('canvas').innerHTML = history[historyIndex];
        reattachEventListeners();
    }
}

function redoAction() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        document.getElementById('canvas').innerHTML = history[historyIndex];
        reattachEventListeners();
    }
}

function reattachEventListeners() {
    document.querySelectorAll('.canvas-element').forEach(element => {
        element.addEventListener('click', function(e) {
            if (!e.target.classList.contains('element-btn')) {
                selectElement(this);
            }
        });
    });
}

// Save, Preview, Publish
function saveWebsite() {
    const canvas = document.getElementById('canvas');
    const projectName = document.getElementById('projectName').textContent;
    
    const websiteData = {
        name: projectName,
        html: canvas.innerHTML,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('websiteBuilder_' + projectName, JSON.stringify(websiteData));
    
    // Visual feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✅ Saved!';
    btn.style.background = '#38a169';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '#48bb78';
    }, 2000);
}

function previewWebsite() {
    const canvas = document.getElementById('canvas');
    const htmlContent = canvas.innerHTML.replace(/<div class="element-controls">.*?<\/div>/g, '');
    
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Preview</title>
            <style>
                body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            </style>
        </head>
        <body>
            ${htmlContent}
        </body>
        </html>
    `);
}

function publishWebsite() {
    const canvas = document.getElementById('canvas');
    const projectName = document.getElementById('projectName').textContent;
    let htmlContent = canvas.innerHTML;
    
    // Clean up builder-specific elements
    htmlContent = htmlContent.replace(/<div class="element-controls">.*?<\/div>/g, '');
    htmlContent = htmlContent.replace(/class="canvas-element[^"]*"/g, '');
    htmlContent = htmlContent.replace(/data-element-id="[^"]*"/g, '');
    htmlContent = htmlContent.replace(/data-type="[^"]*"/g, '');
    
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
    </style>
</head>
<body>
${htmlContent}
</body>
</html>`;
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = projectName.replace(/\s+/g, '-').toLowerCase() + '.html';
    a.click();
    
    alert('🚀 Website published! File downloaded successfully.\n\nYou can now upload it to any web hosting service.');
}

// Load project name from URL
function loadProjectName() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    if (name) {
        document.getElementById('projectName').textContent = name;
    }
}

// Load saved website
function loadSavedWebsite() {
    const projectName = document.getElementById('projectName').textContent;
    const saved = localStorage.getItem('websiteBuilder_' + projectName);
    
    if (saved) {
        const data = JSON.parse(saved);
        if (confirm('Found a saved version of this project. Would you like to load it?')) {
            document.getElementById('canvas').innerHTML = data.html;
            reattachEventListeners();
            saveToHistory();
        }
    }
}
