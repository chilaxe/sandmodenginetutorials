document.addEventListener('DOMContentLoaded', () => {
    const tutorialNameInput = document.getElementById('tutorialName');
    const canvasTitle = document.getElementById('canvas-title');
    const contentArea = document.getElementById('content-area');

    // Buttons
    const btnAddSubHeader = document.getElementById('addSubHeader');
    const btnAddParagraph = document.getElementById('addParagraph');
    const btnAddLink = document.getElementById('addLink');
    const btnAddImage = document.getElementById('addImage');
    const btnAddYoutube = document.getElementById('addYoutube');
    const btnExportZip = document.getElementById('exportZip');

    // Store for image files to be zipped
    let imageFiles = new Map();
    let imageCounter = 0;

    // --- INITIALIZATION ---

    tutorialNameInput.addEventListener('input', () => {
        canvasTitle.textContent = tutorialNameInput.value || 'Tutorial Title';
    });

    new Sortable(contentArea, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'sortable-ghost'
    });


    // --- EVENT LISTENERS FOR ADDING ELEMENTS ---

    btnAddSubHeader.addEventListener('click', () => {
        const element = createEditableElement('h2', 'Subheader Text', 'sandmod-tutorial-subtitle');
        const wrapper = wrapElement(element, 'subheader-title', 'hash');
        contentArea.appendChild(wrapper);
    });

    btnAddParagraph.addEventListener('click', () => {
        const element = createEditableElement('p', 'This is a sample paragraph. Select text and click "Add Link" to insert a hyperlink.', 'sandmod-tutorial-paragraph');
        const wrapper = wrapElement(element, 'paragraph-title', 'asterisk');
        contentArea.appendChild(wrapper);
    });

    btnAddImage.addEventListener('click', addImageElement);

    btnAddYoutube.addEventListener('click', () => {
        showPrompt('Enter YouTube Video URL', '', (url) => {
            if (url) {
                const videoId = getYouTubeVideoId(url);
                if (videoId) {
                    const iframe = document.createElement('iframe');
                    iframe.width = '560';
                    iframe.height = '315';
                    iframe.className = 'yt-title';
                    iframe.src = `https://www.youtube.com/embed/${videoId}`;
                    iframe.title = 'YouTube video player';
                    iframe.frameborder = '0';
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                    iframe.allowFullscreen = true;

                    const wrapper = document.createElement('div');
                    wrapper.className = 'youtube-title editable-element';
                    wrapper.appendChild(iframe);
                    addControls(wrapper);
                    contentArea.appendChild(wrapper);
                } else {
                    alert('Invalid YouTube URL. Please use a valid video link.');
                }
            }
        });
    });

    btnAddLink.addEventListener('click', addLinkToParagraph);
    btnExportZip.addEventListener('click', exportToZip);


    // --- CORE ELEMENT CREATION FUNCTIONS ---

    function wrapElement(element, wrapperClass, iconType) {
        const wrapper = document.createElement('div');
        wrapper.className = `${wrapperClass} editable-element`;

        const iconSpan = document.createElement('span');
        iconSpan.innerHTML = getIcon(iconType);

        const contentSpan = document.createElement('span');
        contentSpan.appendChild(element);

        wrapper.appendChild(iconSpan);
        wrapper.appendChild(contentSpan);

        addControls(wrapper);
        return wrapper;
    }

    function createEditableElement(tag, placeholder, className) {
        const element = document.createElement(tag);
        element.textContent = placeholder;
        element.className = className;
        element.setAttribute('contenteditable', 'true');

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
            }
        });
        return element;
    }

    // Adds drag handle and delete button to an element
    function addControls(element) {
        const controls = document.createElement('div');
        controls.className = 'element-controls';

        // Delete button with SVG
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'control-icon delete-btn';
        deleteBtn.title = 'Delete';
        deleteBtn.onclick = () => element.remove();
        deleteBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
               viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
               class="lucide lucide-trash-icon">
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
            <path d="M3 6h18"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        `;

        // Drag handle with SVG
        const dragHandle = document.createElement('button');
        dragHandle.className = 'control-icon drag-handle';
        dragHandle.title = 'Drag to reorder';
        dragHandle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d1d1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-grip-icon lucide-grip"><circle cx="12" cy="5" r="1"/><circle cx="19" cy="5" r="1"/><circle cx="5" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="19" cy="19" r="1"/><circle cx="5" cy="19" r="1"/></svg>
        `;


        controls.appendChild(dragHandle);
        controls.appendChild(deleteBtn);
        element.appendChild(controls);
    }
    
    // --- IMAGE HANDLING ---
    function addImageElement() {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-title editable-element';

        const dropZone = document.createElement('div');
        dropZone.className = 'image-drop-zone';
        dropZone.textContent = 'Drag & Drop an image here, or click to upload';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        dropZone.onclick = () => fileInput.click();
        
        // Handle file selection
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                processImageFile(file, wrapper);
            }
        };

        // Handle drag & drop
        dropZone.ondragover = (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        };
        dropZone.ondragleave = () => dropZone.classList.remove('drag-over');
        dropZone.ondrop = (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) {
                processImageFile(file, wrapper);
            }
        };
        
        wrapper.appendChild(dropZone);
        wrapper.appendChild(fileInput);
        addControls(wrapper);
        contentArea.appendChild(wrapper);
    }

    function processImageFile(file, wrapperElement) {
        const fileName = `${title}${++imageCounter}.${file.name.split('.').pop()}`;
        imageFiles.set(fileName, file);

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = '../' + e.target.result;
            img.alt = 'Tutorial Image';
            img.className = 'sandmod-tutorial-image';
            img.dataset.fileName = fileName;

            const contentSpan = document.createElement('span');
            contentSpan.appendChild(img);

            wrapperElement.innerHTML = '';
            wrapperElement.appendChild(contentSpan);
            addControls(wrapperElement);
        };
        reader.readAsDataURL(file);
    }

    // --- LINK HANDLING ---
  function addLinkToParagraph() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0 || selection.isCollapsed) {
        alert('Please select some text within a paragraph to create a link.');
        return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    let parent = range.commonAncestorContainer;
    if (parent.nodeType !== 1) {
        parent = parent.parentNode;
    }
    if (!parent.closest('.paragraph-title [contenteditable="true"]')) {
        alert('Links can only be added inside a paragraph element.');
        return;
    }

    showPrompt('Enter Link URL', 'https://', (url) => {
        if (url) {
            const a = document.createElement('a');
            a.href = url;
            a.className = 'sandmod-tutorial-link';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = selectedText;

            range.deleteContents();
            range.insertNode(a);

            selection.removeAllRanges();
            range.collapse(false);
            selection.addRange(range);
        }
    });
}

    // --- UTILITY FUNCTIONS ---
    function getIcon(type) {
        const icons = {
            hash: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>',
            asterisk: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12"/><path d="M17.196 9 6.804 15"/><path d="m6.804 9 10.392 6"/></svg>'
        };
        return icons[type] || '';
    }

    function getYouTubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    function showPrompt(title, defaultValue, callback) {
        const existingModal = document.querySelector('.editor-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'editor-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${title}</h3>
                <input type="text" class="modal-input" value="${defaultValue}">
                <div class="modal-buttons">
                    <button class="control-btn" id="modal-cancel">Cancel</button>
                    <button class="control-btn export-btn" id="modal-ok">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        const input = modal.querySelector('.modal-input');
        input.focus();

        const closeModal = () => modal.remove();
        
        modal.querySelector('#modal-ok').onclick = () => {
            callback(input.value);
            closeModal();
        };
        modal.querySelector('#modal-cancel').onclick = closeModal;
        input.onkeydown = (e) => { if (e.key === 'Enter') modal.querySelector('#modal-ok').click(); };
    }


    // --- EXPORT FUNCTIONALITY ---
    async function exportToZip() {
        const zip = new JSZip();
        
        // 1. Create a clean clone of the canvas for HTML generation
        const cleanCanvas = contentArea.cloneNode(true);
        
        // 2. Clean up the clone for export
        cleanCanvas.querySelectorAll('.editable-element').forEach(el => {
            el.classList.remove('editable-element');
            el.querySelector('.element-controls')?.remove();
        });
        cleanCanvas.querySelectorAll('[contenteditable="true"]').forEach(el => {
            el.removeAttribute('contenteditable');
        });
        
        // 3. Update image paths in the clone
        cleanCanvas.querySelectorAll('.sandmod-tutorial-image').forEach(img => {
            const fileName = img.dataset.fileName;
            if (fileName) {
                img.src = `./assets/${fileName}`;
                img.removeAttribute('data-file-name');
            }
        });

        // 4. Generate final HTML content
        const finalContentHtml = cleanCanvas.innerHTML;
        const finalPageHtml = getPageTemplate(canvasTitle.textContent, finalContentHtml);
        
        zip.file('tutorialpage.html', finalPageHtml);

        // 5. Add images to the zip
        const assetsFolder = zip.folder('assets');
        for (const [name, file] of imageFiles.entries()) {
            assetsFolder.file(name, file);
        }

        zip.file('tutorialpage.css', `:root {  
     --main-color_1: #a8b1ff;
     --main-color_2: #5c73e7;
     --main-color_3: #38383888;
     --main-color_4: #3e56dd;
     --black-color: #1b1b1f;
     --grey-color: #414853;
     --grey-color_2: #515c67;
     --text-color: rgba(255, 255, 245, .86);
}

.sandmod-tutorial-content {
    padding: 20px;
}

.header-title {
    display: flex;
    align-items: center;
    font-size: 10px;
    margin: 0px;
    border-radius: 5px;
    color: var(--text-color);
    height: 32px;
    width: 100%;
}

.sandmod-tutorial-title {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    color: var(--text-color);
    width: fit-content;
    background-color: var(--main-color_4);
    padding-left: 25px;
    padding-right: 25px;
    border-radius: 25px;
    height: 32px;
}

.tutorial-content-main {
    padding: 20px;
}

.subheader-title {
    display: flex;
    align-items: center;
    padding: 5px;
    font-size: 14px;
    font-weight: bold;
    color: var(--text-color);
    width: auto;
    border-radius: 5px;
    width: fit-content;
    height: 24px;
    color: #b9b9b9;
    transition: 0.2s ease-in-out;
}

.subheader-title svg {
    display: flex;
    align-items: center;
    width: 24px;
    height: 24px;
    margin-right: 5px;
    stroke: var(--main-color_2);
    transition: 0.2s ease-in-out;
}

.subheader-title:hover {
    cursor: pointer;
}

.subheader-title:hover svg {
    stroke: var(--main-color_1);
}

.paragraph-title {
    display: flex;
    align-items: flex-start;
    font-size: 16px;
    font-weight: bold;
    color: var(--text-color);
    margin-top: 20px;
    margin-left: 20px;
    transition: 0.2s ease-in-out;
    color: #c4c4c4;
}

.paragraph-title:hover {
    cursor: pointer;
}

.paragraph-title svg {
    display: flex;
    align-items: center;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    stroke: var(--main-color_1);
    transition: 0.2s ease-in-out;
}

.sandmod-tutorial-paragraph {
    display: block;
    font-size: 16px;
    color: var(--text-color);
    margin-top: 10px;
    line-height: 1.5;
}

.image-title {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 800px;
    height: 400px;
    margin-left: 20px;
    background: var(--black-color);
    overflow: hidden;
    margin-top: 10px;
}

.sandmod-tutorial-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}

.link-title {
    font-size: 16px;
    font-weight: bold;
    color: var(--text-color);
    transition: 0.2s ease-in-out;
}

.sandmod-tutorial-link {
    font-size: 16px;
    text-decoration-color: var(--main-color_1);
    transition: 0.2s ease-in-out;
    margin: 5px;
    padding: 0px;
    color: var(--main-color_1);
}

.youtube-title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
    margin-left: 20px;
    transition: 0.2s ease-in-out;
}

.yt-title {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 800px;
    height: 400px;
    margin-left: 20px;
    background: var(--black-color);
    overflow: hidden;
    margin-top: 10px;
    border-radius: 10px;
}

.sandmod-tutorial-tools-btn {
    position: absolute;
    top: 0px;
    right: 37px;
}

.sandmod-tutorial-tools-btn:not(:first-child) {
     position: absolute;
     top: 0px;
     right: 5px;
}

.sandmod-header-container {
    position: relative;
}

.styled-comment-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--grey-color);
}
.styled-comment-section h2 {
    color: var(--main-color_1);
    font-size: 18px;
    margin-bottom: 10px;
}
`);
        zip.file('style.css', `/* =========================
    Variables
    ========================= */
:root {  
     --main-color_1: #a8b1ff;
     --main-color_2: #5c73e7;
     --main-color_3: #38383888;
     --black-color: #1b1b1f;
     --grey-color: #414853;
     --grey-color_2: #515c67;
     --text-color: rgba(255, 255, 245, .86);
}

/* =========================
    Base Styles
    ========================= */
body {
     font-family: "Punctuation SC", "Inter", ui-sans-serif, system-ui, "PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", "Heiti SC", "Microsoft YaHei", "DengXian", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
     background-color: var(--black-color);
     color: var(--text-color);
     margin: 0;
     padding: 0;
     overflow-x: hidden;
}

/* =========================
    Header
    ========================= */
.sandmod-header {
     display: flex;
     align-items: center;
     padding: 5px 20px;
     justify-content: center;
     color: var(--text-color);
     border-bottom: 1px solid var(--grey-color);
}

.sandmod-header-container {
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding: 10px 20px;
     background-color: var(--black-color);
     border-bottom: 1px solid var(--grey-color);
}

.sandmod-logo {
     padding-bottom: 5px;
}

.sandmod-logo-icon {
     width: 128px;
}

/* =========================
    Sidebar
    ========================= */
.sandmod-sidebar {
     position: fixed;
     top: 0;
     left: 0;
     width: 200px;
     height: 100vh;
     color: var(--text-color);
     border-right: 1px solid var(--grey-color);
     padding: 10px 20px;
     background-color: var(--black-color);
     z-index: 10;
}

.sandmod-links-list {
     list-style: none;
     padding: 0;
     margin: 0;
}

.sandmod-link-sidebar {
     display: flex;
     align-items: center;
     background-color: none;
     color: rgba(235, 235, 245, .6);
     text-decoration: none;
     padding: 10px;
     margin: 5px;
     height: 24px;
     font-size: 12px;
     border-radius: 0px;
     font-weight: bold;
     transition: 0.2s ease-in-out;
}

.sandmod-link-sidebar:hover,
.sandmod-link-sidebar.active {
     color: var(--main-color_1);
}

.sandmod-link-sidebar:hover svg,
.sandmod-link-sidebar.active svg {
     stroke: var(--main-color_1);
}

.sandmod-sidebar-tool {
     border-left: 1px solid var(--grey-color);
}

.sandmod-sidebar-tool:hover,
.sandmod-sidebar-tool.active {
     border-left: 1px solid var(--main-color_1);
}

.sandmod-link-sidebar:hover .dc-svg,
.sandmod-link-sidebar:hover .sandmod-svg {
     fill: var(--main-color_1);
}

.sandmod-link-sidebar .sandmod-svg {
     width: 24px;
     height: 24px;
     fill: rgba(235, 235, 245, .6);
}

.sandmod-link-sidebar svg {
     display: flex;
     margin-right: 10px;
     stroke: rgba(235, 235, 245, .6);
     transition: 0.2s ease-in-out;
}

.sandmod-link-sidebar img {
     display: flex;
     margin-right: 10px;
}

.sandmod-link-sidebar.links {
     display: flex;
     align-items: center;
     justify-content: center;
     background-color: var(--main-color_3);
     padding: 10px;
     margin: 10px;
     border-radius: 25px;
}

.sandmod-link-sidebar.links:hover {
     background-color: var(--main-color_2);
     color: var(--text-color);
}

.sandmod-link-sidebar.links:hover svg {
     fill: var(--text-color);
}

/* Sidebar Tools */
.sandmod-sidebar-tool-btn {
     display: flex;
     align-items: center;
     position: relative;
     background-color: transparent;
     border: none;
     color: rgba(235, 235, 245, .6);
     text-decoration: none;
     padding: 10px;
     margin: 5px;
     width: 190px;
     font-weight: bold;
     font-size: 13px;
     transition: 0.2s ease-in-out;
     cursor: pointer;
}

.sandmod-sidebar-tool-btn svg {
     display: flex;
     margin-right: 10px;
     stroke: rgba(235, 235, 245, .6);
     transition: 0.2s ease-in-out;
}

.sandmod-sidebar-tool-btn-arrow-icon {
     position: absolute;
     right: 0px;
     top: 50%;
     width: 18px;
     height: 18px;
     transform: translateY(-50%);
     transition: 0.2s ease-in-out;
}

.sandmod-sidebar-tool-btn:hover,
.sandmod-sidebar-tool-btn:focus {
     color: var(--main-color_1);
}

.sandmod-sidebar-tool-btn:hover svg {
     stroke: var(--main-color_1);
}

.sandmod-sidebar-tool-btn:focus svg {
     stroke: var(--main-color_1);
}

.sandmod-sidebar-tools-list {
  list-style: none;
  margin-left: 20px;
  padding-left: 0px;

  max-height: 0;   
  opacity: 0;      
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease;
}

.sandmod-sidebar-tools-list.open {
  max-height: 500px;
  opacity: 1;
}


.sandmod-sidebar-tool {
     display: flex;
     align-items: center;
     background-color: none;
     color: rgba(235, 235, 245, .6);
     text-decoration: none;
     padding: 5px;
     font-weight: bold;
     font-size: 13px;
     transition: 0.2s ease-in-out;
}

.sandmod-sidebar-tool:hover,
.sandmod-sidebar-tool.active {
     color: var(--main-color_1);
}

.sandmod-sidebar-tool svg {
     display: flex;
     margin-right: 10px;
     stroke: rgba(235, 235, 245, .6);
     transition: 0.2s ease-in-out;
}

.sandmod-sidebar-tool:hover svg,
.sandmod-sidebar-tool.active svg {
     stroke: var(--main-color_1);
}

/* =========================
    Main Content
    ========================= */
.sandmod-maincontent {
     flex: 1;
     color: var(--text-color);
     margin-left: 241px;
     margin-top: 0;
     z-index: 0;
     position: absolute;
     width: calc(100% - 241px);
}

/* =========================
    Tutorials
    ========================= */
.sandmod-tutorials {
     display: flex;
     flex-direction: column;
     gap: 10px;
}

.sandmod-tutorials-content {
     padding: 20px;
     background-color: var(--black-color);
}

.sandmod-forum-tutorial {
     position: relative;
     border: 1px solid #2e2e32;
     padding: 5px;
     transition: 0.2s ease-in-out;
     cursor: pointer;
     width: 100%;
     height: 90px;
     margin: 0px;
     border: none;
     border-bottom: 1px solid #2e2e32;
     border-left: 1px solid #2e2e32;
     border-right: 1px solid #2e2e32;
}

.sandmod-forum-tutorial:first-child {
  border-top: 1px solid #2e2e32;
}

.sandmod-forum-tutorial:has(+ .sandmod-forum-tutorial:hover) {
  border-bottom-color: var(--main-color_1);
}

.sandmod-forum-tutorial:hover {
     border-color: var(--main-color_1);
     background-color: rgba(92, 115, 231, 0.1);
}

.sandmod-tutorial-header {
     display: flex;
     align-items: flex-start;
     width: 100%;
     height: 20px;
     border-radius: 5px 5px 0px 0px;
}

.tutorial-ico {
     width: 20px;
     height: 20px;
     margin-right: 5px;
}

.tutorial-ico svg {
     width: 20px;
     height: 20px;
     stroke: rgba(235, 235, 245, .6);
}

.tutorial-type {
     display: flex;
     align-items: center;
     justify-content: flex-start;
     margin-right: auto;
     position: absolute;
     top: 5px;
     right: 5px;
}

.type-1,
.type-2 {
     padding: 2px 5px;
     border-radius: 3px;
}

.type-1 svg,
.type-2 svg {
     width: 16px;
     height: 16px;
     stroke: rgba(235, 235, 245, .6);
}

.tutorial-maincontent {
     display: flex;
     flex-direction: column;
     align-items: center;
     gap: 10px;
     padding: 10px;
     color: var(--text-color);
}

.tutorial-title {
     display: flex;
     flex-direction: column;
     align-items: flex-start;
     font-size: 14px;
     font-weight: bold;
     color: rgba(199, 199, 255, 0.781);
     margin-bottom: 2px;
     width: 100%;
     white-space: nowrap;
     overflow: hidden;
     text-overflow: ellipsis;
}

.tutorial-credits {
     display: flex;
     align-items: center;
     position: relative;
     color: rgba(235, 235, 245, .6);
     font-size: 12px;
     width: 100%;
}

.tutorial-credit-pfp {
     display: flex;
     align-items: center;
     gap: 6px;
}

.tutorial-credit-pfp-img {
     width: 24px;
     height: 24px;
     border-radius: 50%;
     overflow: hidden;
     flex-shrink: 0;
}

.tutorial-credit-pfp-img img {
     width: 100%;
     height: 100%;
     object-fit: cover;
     display: block;
}

.tutorial-credit-pf-name {
     color: rgba(235, 235, 245, .6);
     text-decoration: none;
     transition: color 0.2s ease-in-out;
     display: inline-block;
     white-space: nowrap;
     width: 100%;
     overflow: hidden;
}

/* =========================
    Assets
    ========================= */
.sandmod-assets-list {
     display: flex;
     flex-direction: column;
     gap: 10px;
     padding: 10px;
}

.sandmod-asset-item {
     position: relative;
     padding: 10px;
     border: 1px solid var(--grey-color);
     transition: 0.2s ease-in-out;
     width: 240px;
     cursor: pointer;
}

.sandmod-asset-item:hover {
     border-color: var(--main-color_1);
}

.sandmod-asset-header {
     display: flex;
     align-items: center;
     gap: 10px;
     height: 32px;
}

.sandmod-asset-header svg {
     width: 20px;
     height: 20px;
     stroke: rgba(235, 235, 245, .6);
}

.sandmod-asset-preview-image {
     width: 100%;
     height: 200px;
     overflow: hidden;
     border-radius: 5px;
}

.sandmod-asset-type-2 {
     position: absolute;
     top: 10px;
     right: 10px;
}

.sandmod-asset-type-icon svg {
     position: absolute;
     top: 10px;
     left: 10px;
}

.sandmod-asset-info {
     display: flex;
     flex-direction: column;
     align-items: flex-start;
     gap: 5px;
     margin-top: 10px;
}

.sandmod-asset-title {
     font-size: 14px;
     font-weight: bold;
     color: rgba(199, 199, 255, 0.781);
     margin-bottom: 5px;
     width: 100%;
     white-space: nowrap;
     overflow: hidden;
     text-overflow: ellipsis;
}

.sandmod-asset-model-viewer {
     width: 100%;
     background-color: #272727;
}

.sandmod-assets-content {
     display: grid;
     grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
     gap: 16px 16px;
     padding: 20px;
     background-color: var(--black-color);
}

.sandmod-tool-asset {
     background-color: transparent;
     border: none;
     margin: 5px;
     padding: 0px;
}

.sandmod-tool-asset svg {
     width: 24px;
     height: 24px;
     stroke: rgba(235, 235, 245, .6);
     transition: 0.2s ease-in-out;
     cursor: pointer;
}

.sandmod-tool-asset:hover svg {
     stroke: var(--main-color_1);
}

.credits-assets,
.tools-assets {
     display: flex;
}

/* =========================
    Favorites Section
    ========================= */
.sandmod-favorites-section {
     display: flex;
     flex-direction: column;
     gap: 10px;
     padding: 10px;
}

.sandmod-favorites-section h2 {
     font-size: 16px;
     font-weight: bold;
     color: #acacac;
     margin: 0px;
}

/* =========================
    Filter & Search
    ========================= */
.filter {
     display: flex;
     align-items: center;
     justify-content: space-between;
     background-color: var(--black-color);
}

.sandmod-tutorial-filter-btn {
     display: flex;
     align-items: center;
     background-color: transparent;
     border: none;
     color: rgba(235, 235, 245, .6);
     text-decoration: none;
     padding: 5px;
     font-weight: bold;
     font-size: 13px;
     transition: 0.2s ease-in-out;
     cursor: pointer;
}

.sandmod-tutorial-filter-btn svg {
     display: flex;
     margin-left: 5px;
     margin-right: 5px;
     stroke: rgba(235, 235, 245, .6);
     transition: 0.2s ease-in-out;
}

.sandmod-tutorial-filter-btn:hover svg,
.sandmod-tutorial-filter-btn.active svg {
     stroke: var(--main-color_1);
}

.sandmod-tutorial-filter-btn.active {
     color: var(--main-color_1);
}

.filter-area {
     display: none;
     border-left: 1px solid var(--grey-color);
     align-items: center; 
     padding-left: 5px;
     transition: 0.2s ease-in-out;
}

.filter-btn {
     display: flex;
     align-items: center;
     background-color: transparent;
     border: none;
     color: rgba(235, 235, 245, .6);
     text-decoration: none;
     font-weight: bold;
     font-size: 13px;
     transition: 0.2s ease-in-out;
}

.filter-btn:hover svg {
     stroke: rgba(235, 235, 245, .6);
}

/* =========================
    Search
    ========================= */
.sandmod-search {
     display: flex;
     align-items: center;
     background-color: transparent;
     border: none;
     color: rgba(235, 235, 245, .6);
     text-decoration: none;
     font-weight: bold;
     font-size: 13px;
     transition: 0.2s ease-in-out;
}

.sandmod-search-form {
     display: flex;
     align-items: center;
}

.sandmod-search-input {
     background-color: transparent;
     border: none;
     color: rgba(235, 235, 245, .6);
     font-size: 13px;
     padding: 5px;
     width: 300px;
     height: 24px;
     outline: none;
     transition: border-color 0.2s ease-in-out;
     border: 1px solid var(--grey-color);
     border-radius: 0px 24px 24px 0px;
     border-left: none;
}

.sandmod-search-input:focus {
     border-color: var(--main-color_1);
}

.sandmod-search-button {
     display: flex;
     align-items: center;
     justify-content: center;
     background-color: transparent;
     border: none;
     color: rgba(235, 235, 245, .6);
     text-decoration: none;
     padding: 5px;
     font-weight: bold;
     font-size: 13px;
     width: 36px;
     height: 36px;
     transition: 0.2s ease-in-out;
     border-radius: 24px 0px 0px 24px;
     border: 1px solid var(--grey-color);
     border-right: none;
     cursor: pointer;
}

.sandmod-search-button svg {
     width: 16px;
     height: 16px;
     display: flex;
     stroke: rgba(235, 235, 245, .6);
     transition: 0.2s ease-in-out;
}

.sandmod-search-form:focus-within .sandmod-search-button {
     border-color: var(--main-color_1);
}

/* =========================
    Miscellaneous
    ========================= */
.sandmod-horizontal-separator {
     width: 100%;
     height: 1px;
     background-color: var(--grey-color);
     margin: 10px 0;
}

.path  {
     color: var(--main-color_1);
     font-weight: bold;
     font-size: 14px;
     margin-right: 10px;
}

.credits {
     position: absolute;
     bottom: 10px;
     left: 10px;
     color: rgba(235, 235, 245, .6);
     font-size: 12px;
}

.credits-text {
     color: rgba(235, 235, 245, .6);
     text-decoration: none;
     transition: color 0.2s ease-in-out;
}

.credits-text-highlight {
     color: var(--main-color_1);
     text-decoration: none;
     transition: color 0.2s ease-in-out;
}

.pfp {
     display: flex;
     align-items: center;
}

.pfp-image {
     display: flex;
     width: 24px;
     height: 24px;
     border-radius: 50%;
     overflow: hidden;
     flex-shrink: 0;
}

.pfp-name {
     display: flex;
     color: rgba(235, 235, 245, .6);
     text-decoration: none;
     transition: color 0.2s ease-in-out;
     display: inline-block;
     white-space: nowrap;
     width: 145px;
     font-size: 12px;
     overflow: hidden;
     margin-left: 5px;
}

.sandmod-tutorial-tools-btn {
     position: absolute;
     bottom: 0px;
     right: 22px;
     background-color: transparent;
     border: none;
     color: rgba(235, 235, 245, .6);
     text-decoration: none;
     font-weight: bold;
     font-size: 13px;
     transition: 0.2s ease-in-out;
     cursor: pointer;
}

.sandmod-tutorial-tools-btn:not(:first-child) {
     position: absolute;
     bottom: 0px;
     right: -10px;
}

.sandmod-tutorial-tools-btn svg {
     display: flex;
     stroke: rgba(235, 235, 245, .6);
     transition: 0.2s ease-in-out;
}

.sandmod-tutorial-tools-btn:hover svg {
     stroke: var(--main-color_1);
}

.tools-tutorial {
     display: flex;
     align-items: center;
}

/* =========================
    Scrollbar
    ========================= */
::-webkit-scrollbar {
     width: 4px;
}
::-webkit-scrollbar-thumb {
     background-color: var(--grey-color);
     border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
     background-color: var(--grey-color_2);
}
::-webkit-scrollbar-track {
     background-color: transparent;
}

/* =========================
    Other
    ========================= */

.no-results-message {
     display: flex;
     align-items: center;
     justify-content: center;
     height: 100%;
     width: 300px;
     color: rgba(235, 235, 245, .6);
     font-size: 16px;
     font-weight: bold;
}

.overlay-window-asset {
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background-color: rgba(0, 0, 0, 0.8);
     display: flex;
     align-items: center;
     justify-content: center;
     z-index: 20;
}

.overlay-window-asset-content {
    background-color: var(--black-color);
    padding: 20px;
    border-radius: 5px;
    width: 80%;
    max-width: 600px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--grey-color);
    position: relative;
}

.close-overlay-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: transparent;
    border: none;
    color: rgba(235, 235, 245, .6);
    cursor: pointer;
}

.asset-perview {
    width: 100%;
    height: 300px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #272727;
    margin-top: 20px;
}

.asset-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.asset-title {
    font-size: 18px;
    font-weight: bold;
    color: rgba(199, 199, 255, 0.781);
    margin: 0px;
    padding: 0px;
    margin-top: 5px;
}

.asset-description {
    font-size: 14px;
    color: rgba(235, 235, 245, .6);
    margin: 0px;
    padding: 0px;
}

.asset-actions {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.download-asset-btn {
    color: var(--text-color);
    border: 1px solid var(--grey-color);
    padding: 10px 20px;
    border-radius: 5px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    cursor: pointer;
    transition: 0.2s ease-in-out;
}

.download-asset-btn:hover {
    border-color: var(--main-color_2);
    color: #a3a3a3;
}

/* =========================
    404 Not Found Styling
    ========================= */
.container {
    text-align: center;
    padding: 2rem;
}
.flex-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
}
.heading-404 {
    font-size: 150px;
    font-weight: 900;
    color: #8A91FF;
    line-height: 1;
    margin: 0px;
}
.icon-container svg {
    width: 6rem;
    height: 6rem;
    color: #8A91FF;
}
.subheading {
    font-size: 2.25rem;
    font-weight: 700;
    color: #f3f4f6;
}
.description {
    margin-top: 1rem;
    font-size: 1.125rem;
    color: #9ca3af;
}
.button-container {
    margin-top: 2.5rem;
}
.home-button {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    border: 1px solid #8A91FF;
    border-radius: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: #8A91FF;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;
}
.home-button:hover {
    background-color: #8A91FF;
    color: #111827;
}
.home-button svg {
    height: 1.25rem;
    margin-right: 0.5rem;
}

.icon-main-container svg {
    width: 8rem;
    height: 8rem;
    color: #8A91FF;
    margin-bottom: 2rem;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@media (min-width: 768px) {
    .flex-container {
        flex-direction: row;
    }
    .heading-404 {
        font-size: 200px;
    }
    .icon-container svg {
        width: 7rem;
        height: 7rem;
    }
    .subheading {
        font-size: 3rem;
    }
}

`);

        zip.generateAsync({ type: 'blob' }).then(blob => {
            saveAs(blob, `${tutorialNameInput.value || 'tutorial'}.zip`);
        });
    }

    function getPageTemplate(title, content) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>${title}</title>
    <link rel="stylesheet" href="../style.css" />
    <link rel="stylesheet" href="tutorialpage.css" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
</head>
<body>
    <div class="sandmod-maincontent">
        <div class="sandmod-tutorials">
            <header class="sandmod-header-container ">
                <div class="path">
                    <span>SandMod/Tutorials/${title}</span>
                </div>
                <div class="tools-tutorial">
                    <button id="bookMarkPage_y" class="sandmod-tutorial-tools-btn other" data-id="tut001" title="Bookmark this Tutorial">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark-icon lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                    </button>

                    <button id="sharepage_y" class="sandmod-tutorial-tools-btn other" data-id="tut001" title="Share this Tutorial">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share2-icon lucide-share-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                    </button>
                </div>
            </header>
        </div>
        <div class="sandmod-tutorial-content">
            <div class="header-title">
                <span>
                    <h1 class="sandmod-tutorial-title">${title}</h1>
                </span>
            </div>
            <div class="tutorial-content-main">
                ${content}
            </div>
        </div>
    </div>
        <div class="sandmod-sidebar">
        <header class="sandmod-header">
            <div class="sandmod-logo">
                <img src="../assets//logo_sandmod.svg" alt="SandMod Logo" class="sandmod-logo-icon">
            </div>
        </header>
        <div class="sandmod-links">
            <ul class="sandmod-links-list">
                <li><a href="./" class="sandmod-link-sidebar active" target="_self" title="Tutorials">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap-icon lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
                    </span>
                    <span>
                        Tutorials
                    </span>
                </a></li>
                <li><a href="./assets.html" class="sandmod-link-sidebar" target="_self" title="Assets">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package-icon lucide-package"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/></svg>
                    </span>
                    <span>
                        Assets
                    </span>
                </a></li>
                    <li><a href="./" class="sandmod-link-sidebar" target="_self" title="BlockMan Creator Center">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-cog-icon lucide-user-cog"><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m14.305 16.53.923-.382"/><path d="m15.228 13.852-.923-.383"/><path d="m16.852 12.228-.383-.923"/><path d="m16.852 17.772-.383.924"/><path d="m19.148 12.228.383-.923"/><path d="m19.53 18.696-.382-.924"/><path d="m20.772 13.852.924-.383"/><path d="m20.772 16.148.924.383"/><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/></svg>
                    </span>
                    <span>
                        Creator Center
                    </span>
                </a></li>
                        <div class="sandmod-sidebar-tools">
                <div class="sandmod-sidebar-tool-btn-area">
                    <button class="sandmod-sidebar-tool-btn" title="Tools">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench-icon lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                        </span>
                        <span>
                            Tools
                        </span>
                        <span>
                            <svg class="sandmod-sidebar-tool-btn-arrow-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                        </span>
                    </button>
                    <ul class="sandmod-sidebar-tools-list">
                        <li><a href="./" class="sandmod-sidebar-tool" title="themes">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-swatch-book-icon lucide-swatch-book"><path d="M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z"/><path d="M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7"/><path d="M 7 17h.01"/><path d="m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8"/></svg>
                            </span>
                            <span>
                                Themes
                            </span>
                        </a></li>
                        <li><a href="./" class="sandmod-sidebar-tool" title="create tutorial">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                            </span>
                            <span>
                                Create Tutorial
                            </span>
                        </a></li>
                        <li><a href="./" class="sandmod-sidebar-tool" title="upload assets">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-up-icon lucide-folder-up"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M12 10v6"/><path d="m9 13 3-3 3 3"/></svg>
                            </span>
                            <span>
                                Upload Assets
                            </span>
                        </a></li>
                        <li><a href="./favorites.html" class="sandmod-sidebar-tool" title="favorites">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked-icon lucide-book-marked"><path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
                            </span>
                            <span>
                                Favorites
                            </span>
                        </a></li>
                    </ul>
                </div>
                <div class="sandmod-horizontal-separator"></div>
                <li><a href="./" class="sandmod-link-sidebar links" target="_self" title="SandMod Website">
                    <span>
                        <svg class="sandmod-svg"  fill="#e3e3e3" width="46" height="52" viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clip-path="url(#a)">
                            <path d="M34.802 9.357 19.087 24.76H0L25.259 0z"/>
                            <path d="m29.11 18.495-6.393 6.265h12.784z"/>
                            <path d="M11.009 33.505 17.4 27.24H4.618z"/>
                            <path d="M5.317 42.644 21.032 27.24h19.087L14.86 52z"/>
                          </g>
                          <defs>
                            <clipPath id="a">
                              <path d="M0 0h160v52H0z"/>
                            </clipPath>
                          </defs>
                        </svg>
                    </span>
                    <span>
                        SandMod Website
                    </span>
                </a></li>
                        <li><a href="./" class="sandmod-link-sidebar links" target="_self" title="SandMod Discord">
                    <span>
                        <svg class="dc-svg" fill="rgba(235, 235, 245, .6)" style="stroke: none;" width="24" height="24" viewBox="0 0 0.96 0.96" xmlns="http://www.w3.org/2000/svg"><path d="M.63.605A.087.087 0 0 1 .549.514.086.086 0 0 1 .63.423a.085.085 0 0 1 .081.091.086.086 0 0 1-.081.091m-.299 0A.087.087 0 0 1 .25.514.086.086 0 0 1 .331.423a.085.085 0 0 1 .081.091v.005a.086.086 0 0 1-.081.086M.792.194A.7.7 0 0 0 .613.138L.609.137H.608L.606.138.584.181.583.184a.7.7 0 0 0-.21 0L.377.183.353.134l.001.002L.352.135a.7.7 0 0 0-.188.059L.169.192.168.193A.75.75 0 0 0 .03.63q0 .041.004.081V.708L.035.71a.7.7 0 0 0 .219.112l.005.001H.26L.262.822.307.75.308.747.306.743.233.708l.002.001L.234.707.235.705.249.694h.003A.52.52 0 0 0 .707.692L.704.693h.003l.014.011.001.002-.001.002A.4.4 0 0 1 .654.74L.651.741.649.744v.001q.022.043.047.076L.695.819.698.82A.7.7 0 0 0 .925.705L.923.706.924.704A.75.75 0 0 0 .789.19l.002.002L.79.191z"/></svg>
                    </span>
                    <span>
                        SandMod Discord
                    </span>
                </a></li>
            </div>
        </div>
        <footer>
            <div class="credits">
                <span>
                    <p class="credits-text">
                        Made By <span class="credits-text-highlight">Chilaxe</span>
                    </p>
                </span>
            </div>
        </footer>
        <script src="../script.js"></script>
    </div>
    </body>
</html>`;
    }
});