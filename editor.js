window.addEventListener('beforeunload', function (e) {
    if (hasUnsavedContent()) {
        e.returnValue = 'Are you sure you want to leave? You have unsaved changes.';
    }
});

let isCanvasDirty = false;

function hasUnsavedContent() {
    const canvas = document.getElementById('content-area');
    const nameInput = document.getElementById('tutorialName');
    return (canvas && canvas.children.length > 0) || (nameInput && nameInput.value.trim() !== '');
}

document.addEventListener('DOMContentLoaded', () => {
    const tutorialNameInput = document.getElementById('tutorialName');
    const canvasTitle = document.getElementById('canvas-title');
    const contentArea = document.getElementById('content-area');

    // Controls Buttons
    const btnNewTutorial = document.getElementById('newTutorialBtn');
    const btnSaveTutorial = document.getElementById('saveTutorialBtn');
    const btnSaves = document.getElementById('savesBtn');
    const savesBadge = document.getElementById('savesBadge');
    const btnAddSubHeader = document.getElementById('addSubHeader');
    const btnAddParagraph = document.getElementById('addParagraph');
    const btnAddLink = document.getElementById('addLink');
    const btnAddImage = document.getElementById('addImage');
    const btnAddYoutube = document.getElementById('addYoutube');
    const btnExportZip = document.getElementById('exportZip');

    // Saves Dropdown Elements
    const savesDropdownMenu = document.getElementById('savesDropdownMenu');
    const closeSavesDropdownBtn = document.getElementById('closeSavesDropdownBtn');
    const backupContainer = document.getElementById('backupContainer');
    const savesList = document.getElementById('savesList');

    // Link Dropdown Elements
    const linkDropdownMenu = document.getElementById('linkDropdownMenu');
    const linkUrlInput = document.getElementById('linkUrlInput');
    const closeLinkDropdownBtn = document.getElementById('closeLinkDropdownBtn');
    const cancelLinkBtn = document.getElementById('cancelLinkBtn');
    const applyLinkBtn = document.getElementById('applyLinkBtn');
    let activeLinkRange = null;
    let activeLinkSelectedText = '';

    // YouTube Dropdown Elements
    const youtubeDropdownMenu = document.getElementById('youtubeDropdownMenu');
    const youtubeUrlInput = document.getElementById('youtubeUrlInput');
    const closeYoutubeDropdownBtn = document.getElementById('closeYoutubeDropdownBtn');
    const cancelYoutubeBtn = document.getElementById('cancelYoutubeBtn');
    const applyYoutubeBtn = document.getElementById('applyYoutubeBtn');

    // Storage Keys
    const AUTOSAVE_STORAGE_KEY = 'sandmod_editor_autosave';
    const SAVES_STORAGE_KEY = 'sandmod_editor_saves';

    // Store for image files to be zipped (fileName -> Blob/File)
    let imageFiles = new Map();
    let currentEditingSaveId = null;

    // --- INITIALIZATION ---

    tutorialNameInput.addEventListener('input', () => {
        canvasTitle.textContent = tutorialNameInput.value.trim() || 'Tutorial Title';
        isCanvasDirty = true;
    });

    new Sortable(contentArea, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'sortable-ghost',
        onEnd: () => {
            isCanvasDirty = true;
        }
    });

    // Element Selection & Insertion Targeting
    let selectedElement = null;

    function setSelectedElement(el) {
        if (selectedElement && selectedElement !== el) {
            selectedElement.classList.remove('selected-element');
        }
        selectedElement = el;
        if (selectedElement) {
            selectedElement.classList.add('selected-element');
        }
    }

    contentArea.addEventListener('click', (e) => {
        const el = e.target.closest('.editable-element');
        if (el && contentArea.contains(el)) {
            setSelectedElement(el);
        }
    });

    contentArea.addEventListener('focusin', (e) => {
        const el = e.target.closest('.editable-element');
        if (el && contentArea.contains(el)) {
            setSelectedElement(el);
        }
    });

    const canvasContainer = document.getElementById('canvas');
    if (canvasContainer) {
        canvasContainer.addEventListener('click', (e) => {
            if (e.target === canvasContainer || e.target === contentArea) {
                setSelectedElement(null);
            }
        });
    }

    function insertElementToCanvas(wrapper) {
        if (selectedElement && selectedElement.parentElement === contentArea) {
            selectedElement.insertAdjacentElement('afterend', wrapper);
        } else {
            contentArea.appendChild(wrapper);
        }

        setSelectedElement(wrapper);
        isCanvasDirty = true;

        const editableChild = wrapper.querySelector('[contenteditable="true"]');
        if (editableChild) {
            editableChild.focus();
        }

        wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Update saves badge on load
    updateSavesBadge();

    // Setup 5-second Auto-save Interval (silent background backup)
    setInterval(performAutoSave, 5000);


    // --- DROPDOWN CONTROLLERS ---

    function closeAllToolbarDropdowns() {
        closeSavesDropdown();
        closeLinkDropdown();
        closeYoutubeDropdown();
    }

    function toggleSavesDropdown() {
        if (savesDropdownMenu && savesDropdownMenu.classList.contains('open')) {
            closeSavesDropdown();
        } else {
            openSavesDropdown();
        }
    }

    function openSavesDropdown() {
        closeAllToolbarDropdowns();
        renderSavesDropdownContent();
        if (savesDropdownMenu) {
            savesDropdownMenu.classList.add('open');
        }
    }

    function closeSavesDropdown() {
        if (savesDropdownMenu) {
            savesDropdownMenu.classList.remove('open');
        }
    }

    function openLinkDropdown() {
        closeAllToolbarDropdowns();
        if (linkDropdownMenu) {
            linkDropdownMenu.classList.add('open');
            if (linkUrlInput) {
                linkUrlInput.value = 'https://';
                setTimeout(() => {
                    linkUrlInput.focus();
                    linkUrlInput.select();
                }, 50);
            }
        }
    }

    function closeLinkDropdown() {
        if (linkDropdownMenu) {
            linkDropdownMenu.classList.remove('open');
        }
        activeLinkRange = null;
        activeLinkSelectedText = '';
    }

    function applyLink() {
        const url = linkUrlInput ? linkUrlInput.value.trim() : '';
        if (!url || url === 'https://' || url === 'http://') {
            showSandModToast('Please enter a valid URL.', 'info');
            return;
        }

        if (!activeLinkRange || !activeLinkSelectedText) {
            showSandModToast('No text selected for link. Please select text in a paragraph first.', 'info');
            closeLinkDropdown();
            return;
        }

        const a = document.createElement('a');
        a.href = url;
        a.className = 'sandmod-tutorial-link';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = activeLinkSelectedText;

        activeLinkRange.deleteContents();
        activeLinkRange.insertNode(a);

        isCanvasDirty = true;
        showSandModToast('Link added successfully!', 'success');
        closeLinkDropdown();
    }

    function openYoutubeDropdown() {
        closeAllToolbarDropdowns();
        if (youtubeDropdownMenu) {
            youtubeDropdownMenu.classList.add('open');
            if (youtubeUrlInput) {
                youtubeUrlInput.value = '';
                setTimeout(() => {
                    youtubeUrlInput.focus();
                }, 50);
            }
        }
    }

    function closeYoutubeDropdown() {
        if (youtubeDropdownMenu) {
            youtubeDropdownMenu.classList.remove('open');
        }
    }

    function applyYoutube() {
        const url = youtubeUrlInput ? youtubeUrlInput.value.trim() : '';
        if (!url) {
            showSandModToast('Please enter a YouTube video URL.', 'info');
            return;
        }

        const videoId = getYouTubeVideoId(url);
        if (!videoId) {
            showSandModToast('Invalid YouTube URL. Please use a valid video link.', 'error');
            return;
        }

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
        insertElementToCanvas(wrapper);

        showSandModToast('YouTube video added!', 'success');
        closeYoutubeDropdown();
    }


    // --- EVENT LISTENERS FOR BUTTONS & DROPDOWNS ---

    btnNewTutorial?.addEventListener('click', handleNewTutorial);
    btnSaveTutorial?.addEventListener('click', handleSaveTutorial);
    
    btnSaves?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSavesDropdown();
    });

    closeSavesDropdownBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSavesDropdown();
    });

    // Link button & dropdown handlers
    btnAddLink?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (linkDropdownMenu && linkDropdownMenu.classList.contains('open')) {
            closeLinkDropdown();
            return;
        }

        const selection = window.getSelection();
        if (selection.rangeCount === 0 || selection.isCollapsed) {
            showSandModToast('Please select text within a paragraph to create a link.', 'info');
            return;
        }

        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();

        let parent = range.commonAncestorContainer;
        if (parent.nodeType !== 1) {
            parent = parent.parentNode;
        }
        if (!parent.closest('.paragraph-title [contenteditable="true"]')) {
            showSandModToast('Links can only be added inside a paragraph element.', 'info');
            return;
        }

        activeLinkRange = range.cloneRange();
        activeLinkSelectedText = selectedText;
        openLinkDropdown();
    });

    applyLinkBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        applyLink();
    });

    cancelLinkBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLinkDropdown();
    });

    closeLinkDropdownBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLinkDropdown();
    });

    linkUrlInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyLink();
        }
    });

    // YouTube button & dropdown handlers
    btnAddYoutube?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (youtubeDropdownMenu && youtubeDropdownMenu.classList.contains('open')) {
            closeYoutubeDropdown();
        } else {
            openYoutubeDropdown();
        }
    });

    applyYoutubeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        applyYoutube();
    });

    cancelYoutubeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeYoutubeDropdown();
    });

    closeYoutubeDropdownBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeYoutubeDropdown();
    });

    youtubeUrlInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyYoutube();
        }
    });

    // Global Click / Escape Handlers for all dropdowns
    document.addEventListener('click', (e) => {
        if (savesDropdownMenu && savesDropdownMenu.classList.contains('open')) {
            if (!e.target.closest('.saves-dropdown-wrapper')) {
                closeSavesDropdown();
            }
        }
        if (linkDropdownMenu && linkDropdownMenu.classList.contains('open')) {
            if (!e.target.closest('.dropdown-wrapper')) {
                closeLinkDropdown();
            }
        }
        if (youtubeDropdownMenu && youtubeDropdownMenu.classList.contains('open')) {
            if (!e.target.closest('.dropdown-wrapper')) {
                closeYoutubeDropdown();
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            handleSaveTutorial();
            return;
        }

        if (e.key === 'Escape') {
            closeAllToolbarDropdowns();
        }
    });

    btnAddSubHeader?.addEventListener('click', () => {
        const element = createEditableElement('h2', 'Subheader Text', 'sandmod-tutorial-subtitle');
        const wrapper = wrapElement(element, 'subheader-title', 'hash');
        insertElementToCanvas(wrapper);
    });

    btnAddParagraph?.addEventListener('click', () => {
        const element = createEditableElement('p', 'This is a sample paragraph. Select text and click "Add Link" to insert a hyperlink.', 'sandmod-tutorial-paragraph');
        const wrapper = wrapElement(element, 'paragraph-title', 'asterisk');
        insertElementToCanvas(wrapper);
    });

    btnAddImage?.addEventListener('click', addImageElement);
    btnExportZip?.addEventListener('click', exportToZip);


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

        element.addEventListener('input', () => {
            isCanvasDirty = true;
        });

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

        // Delete button with Material Symbol
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'control-icon delete-btn';
        deleteBtn.title = 'Delete';
        deleteBtn.onclick = () => {
            element.remove();
            isCanvasDirty = true;
        };
        deleteBtn.innerHTML = `<span class="material-symbols-sharp">delete</span>`;

        // Drag handle with Material Symbol
        const dragHandle = document.createElement('button');
        dragHandle.className = 'control-icon drag-handle';
        dragHandle.title = 'Drag to reorder';
        dragHandle.innerHTML = `<span class="material-symbols-sharp">drag_indicator</span>`;

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
        
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                processImageFile(file, wrapper);
            }
        };

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
        insertElementToCanvas(wrapper);
    }

    function processImageFile(file, wrapperElement) {
        let baseName = file.name.split('.').slice(0, -1).join('.') || 'image';
        let ext = file.name.split('.').pop() || 'png';
        let randomNum = Math.floor(Math.random() * 100000);
        const fileName = `${baseName}_${randomNum}.${ext}`;

        imageFiles.set(fileName, file);

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Tutorial Image';
            img.className = 'sandmod-tutorial-image';
            img.dataset.fileName = fileName;

            const contentSpan = document.createElement('span');
            contentSpan.appendChild(img);

            wrapperElement.innerHTML = '';
            wrapperElement.appendChild(contentSpan);
            addControls(wrapperElement);
            isCanvasDirty = true;
        };
        reader.readAsDataURL(file);
    }

    // Helper: Convert base64 dataURL to Blob
    function dataURLtoBlob(dataurl) {
        const arr = dataurl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/png';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    // --- UTILITY FUNCTIONS ---
    function getIcon(type) {
        const icons = {
            hash: '<span class="material-symbols-sharp">tag</span>',
            asterisk: '<span class="material-symbols-sharp">notes</span>'
        };
        return icons[type] || '';
    }

    function getYouTubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }


    // ==========================================
    // --- SERIALIZATION & DESERIALIZATION ---
    // ==========================================

    function serializeCanvas() {
        const items = [];
        contentArea.querySelectorAll('.editable-element').forEach(el => {
            if (el.classList.contains('subheader-title')) {
                const h2 = el.querySelector('.sandmod-tutorial-subtitle');
                if (h2) {
                    items.push({ type: 'subheader', text: h2.textContent });
                }
            } else if (el.classList.contains('paragraph-title')) {
                const p = el.querySelector('.sandmod-tutorial-paragraph');
                if (p) {
                    items.push({ type: 'paragraph', html: p.innerHTML });
                }
            } else if (el.classList.contains('image-title')) {
                const img = el.querySelector('.sandmod-tutorial-image');
                if (img) {
                    items.push({
                        type: 'image',
                        src: img.src,
                        fileName: img.dataset.fileName || 'image.png'
                    });
                }
            } else if (el.classList.contains('youtube-title')) {
                const iframe = el.querySelector('iframe');
                if (iframe) {
                    items.push({ type: 'youtube', src: iframe.src });
                }
            }
        });
        return items;
    }

    function loadTutorialData(data) {
        if (!data) return;

        // Set name & title
        const titleText = data.title || 'Tutorial Title';
        tutorialNameInput.value = data.title || '';
        canvasTitle.textContent = titleText;

        // Clear canvas
        contentArea.innerHTML = '';
        imageFiles.clear();

        // Restore elements
        if (Array.isArray(data.elements)) {
            data.elements.forEach(item => {
                if (item.type === 'subheader') {
                    const element = createEditableElement('h2', item.text || 'Subheader Text', 'sandmod-tutorial-subtitle');
                    const wrapper = wrapElement(element, 'subheader-title', 'hash');
                    contentArea.appendChild(wrapper);
                } else if (item.type === 'paragraph') {
                    const element = createEditableElement('p', '', 'sandmod-tutorial-paragraph');
                    element.innerHTML = item.html || 'Sample paragraph';
                    const wrapper = wrapElement(element, 'paragraph-title', 'asterisk');
                    contentArea.appendChild(wrapper);
                } else if (item.type === 'image') {
                    if (item.src) {
                        const wrapper = document.createElement('div');
                        wrapper.className = 'image-title editable-element';

                        const img = document.createElement('img');
                        img.src = item.src;
                        img.alt = 'Tutorial Image';
                        img.className = 'sandmod-tutorial-image';
                        img.dataset.fileName = item.fileName || 'image.png';

                        // If src is a dataURL, re-add to imageFiles map as Blob
                        if (item.src.startsWith('data:')) {
                            try {
                                const blob = dataURLtoBlob(item.src);
                                imageFiles.set(img.dataset.fileName, blob);
                            } catch (err) {
                                console.error('Error recovering blob from dataURL:', err);
                            }
                        }

                        const contentSpan = document.createElement('span');
                        contentSpan.appendChild(img);
                        wrapper.appendChild(contentSpan);
                        addControls(wrapper);
                        contentArea.appendChild(wrapper);
                    }
                } else if (item.type === 'youtube') {
                    if (item.src) {
                        const iframe = document.createElement('iframe');
                        iframe.width = '560';
                        iframe.height = '315';
                        iframe.className = 'yt-title';
                        iframe.src = item.src;
                        iframe.title = 'YouTube video player';
                        iframe.frameborder = '0';
                        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                        iframe.allowFullscreen = true;

                        const wrapper = document.createElement('div');
                        wrapper.className = 'youtube-title editable-element';
                        wrapper.appendChild(iframe);
                        addControls(wrapper);
                        contentArea.appendChild(wrapper);
                    }
                }
            });
        }

        isCanvasDirty = false;
    }


    // ==========================================
    // --- AUTO-SAVE BACKUP SYSTEM (5 SECONDS) ---
    // ==========================================

    function performAutoSave() {
        const title = tutorialNameInput.value.trim();
        const elements = serializeCanvas();

        if (elements.length === 0 && !title) {
            return;
        }

        try {
            const backupData = {
                title: title,
                elements: elements,
                updatedAt: Date.now()
            };
            localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(backupData));
        } catch (e) {
            console.error('Silent auto-save error:', e);
        }
    }


    // ==========================================
    // --- MANUAL SAVES & SAVES DROPDOWN POPOVER ---
    // ==========================================

    function getStoredSaves() {
        const raw = localStorage.getItem(SAVES_STORAGE_KEY);
        if (!raw) return [];
        try {
            return JSON.parse(raw) || [];
        } catch (e) {
            return [];
        }
    }

    function updateSavesBadge() {
        const saves = getStoredSaves();
        if (savesBadge) {
            savesBadge.textContent = saves.length;
        }
    }

    function handleSaveTutorial() {
        let title = tutorialNameInput.value.trim();
        const elements = serializeCanvas();

        if (elements.length === 0 && !title) {
            showSandModToast('Your tutorial is empty. Add some content before saving.', 'info');
            return;
        }

        if (!title) {
            showSandModToast('Please enter a name for your tutorial.', 'info');
            tutorialNameInput.focus();
            return;
        }

        saveCurrentTutorial(title, elements);
    }

    function saveCurrentTutorial(title, elements) {
        let saves = getStoredSaves();
        const now = Date.now();

        if (currentEditingSaveId) {
            const existingIndex = saves.findIndex(s => s.id === currentEditingSaveId);
            if (existingIndex !== -1) {
                saves[existingIndex].title = title;
                saves[existingIndex].elements = elements;
                saves[existingIndex].savedAt = now;
            } else {
                currentEditingSaveId = 'save_' + now;
                saves.unshift({
                    id: currentEditingSaveId,
                    title: title,
                    elements: elements,
                    savedAt: now
                });
            }
        } else {
            currentEditingSaveId = 'save_' + now;
            saves.unshift({
                id: currentEditingSaveId,
                title: title,
                elements: elements,
                savedAt: now
            });
        }

        try {
            localStorage.setItem(SAVES_STORAGE_KEY, JSON.stringify(saves));
            updateSavesBadge();
            isCanvasDirty = false;
            
            showSandModToast(`Tutorial "${title}" saved successfully!`, 'success');
        } catch (e) {
            console.error('Error saving tutorial:', e);
            showSandModToast('Could not save tutorial: LocalStorage may be full.', 'error');
        }
    }

    function handleNewTutorial() {
        const startFresh = () => {
            tutorialNameInput.value = '';
            canvasTitle.textContent = 'Tutorial Title';
            contentArea.innerHTML = '';
            imageFiles.clear();
            currentEditingSaveId = null;
            isCanvasDirty = false;
            showSandModToast('Started new tutorial.', 'info');
        };

        if (hasUnsavedContent() && isCanvasDirty) {
            showSandModConfirm('Start a new tutorial? Make sure to save your current work if you want to keep it.', startFresh, null, 'New Tutorial');
        } else {
            startFresh();
        }
    }

    function toggleSavesDropdown() {
        if (savesDropdownMenu && savesDropdownMenu.classList.contains('open')) {
            closeSavesDropdown();
        } else {
            openSavesDropdown();
        }
    }

    function openSavesDropdown() {
        renderSavesDropdownContent();
        if (savesDropdownMenu) {
            savesDropdownMenu.classList.add('open');
        }
    }

    function closeSavesDropdown() {
        if (savesDropdownMenu) {
            savesDropdownMenu.classList.remove('open');
        }
    }

    function renderSavesDropdownContent() {
        const saves = getStoredSaves();
        const backupRaw = localStorage.getItem(AUTOSAVE_STORAGE_KEY);

        // 1. Render Auto-saved backup if available
        if (backupContainer) {
            backupContainer.innerHTML = '';
            if (backupRaw) {
                try {
                    const backup = JSON.parse(backupRaw);
                    if (backup && ((backup.elements && backup.elements.length > 0) || backup.title)) {
                        const dateStr = new Date(backup.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const elCount = (backup.elements || []).length;
                        
                        const backupCard = document.createElement('div');
                        backupCard.className = 'backup-section';
                        backupCard.innerHTML = `
                            <div class="backup-info">
                                <div class="backup-label"><span class="material-symbols-sharp" style="font-size:13px;">history</span> Backups:</div>
                                <h4 class="backup-title">${backup.title || 'Untitled Draft'}</h4>
                                <span class="backup-meta">Last updated: ${dateStr} • ${elCount} element${elCount !== 1 ? 's' : ''}</span>
                            </div>
                            <div class="save-item-actions">
                                <button class="btn-load" id="btnRestoreBackup">Restore</button>
                            </div>
                        `;
                        backupContainer.appendChild(backupCard);

                        backupCard.querySelector('#btnRestoreBackup').addEventListener('click', (e) => {
                            e.stopPropagation();
                            const restoreDraft = () => {
                                loadTutorialData(backup);
                                currentEditingSaveId = null;
                                closeSavesDropdown();
                                showSandModToast('Auto-saved draft restored!', 'success');
                            };
                            if (hasUnsavedContent() && isCanvasDirty) {
                                showSandModConfirm('Replace current editor content with auto-saved draft?', restoreDraft, null, 'Restore Backup');
                            } else {
                                restoreDraft();
                            }
                        });
                    }
                } catch (err) {
                    console.error('Error rendering backup in dropdown:', err);
                }
            }
        }

        // 2. Render Saved Tutorials List
        if (savesList) {
            savesList.innerHTML = '';
            if (saves.length === 0) {
                savesList.innerHTML = `
                    <div class="empty-saves">
                        <span class="material-symbols-sharp" style="font-size:36px;opacity:0.6;">folder_open</span>
                        <span>No saved tutorials yet. Click "Save Tutorial" to save your work!</span>
                    </div>
                `;
                return;
            }

            saves.forEach((save) => {
                const dateStr = new Date(save.savedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
                const elCount = (save.elements || []).length;
                const isCurrentlyActive = save.id === currentEditingSaveId;

                const card = document.createElement('div');
                card.className = 'save-item-card';
                card.innerHTML = `
                    <div class="save-item-info">
                        <h4 class="save-item-title">${save.title || 'Untitled Tutorial'} ${isCurrentlyActive ? '<span style="color:var(--main-color_1);font-size:11px;">(Open)</span>' : ''}</h4>
                        <div class="save-item-meta">
                            <span>${dateStr}</span>
                            <span>•</span>
                            <span>${elCount} element${elCount !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <div class="save-item-actions">
                        <button class="btn-load" data-id="${save.id}">Load</button>
                        <button class="btn-delete-save" data-id="${save.id}" title="Delete Save">
                            <span class="material-symbols-sharp" style="font-size:16px;">delete</span>
                        </button>
                    </div>
                `;

                // Load handler
                card.querySelector('.btn-load').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const loadSave = () => {
                        loadTutorialData(save);
                        currentEditingSaveId = save.id;
                        closeSavesDropdown();
                        showSandModToast(`Loaded "${save.title}"`, 'success');
                    };
                    if (hasUnsavedContent() && isCanvasDirty && currentEditingSaveId !== save.id) {
                        showSandModConfirm('Load this tutorial? Make sure your current changes are saved.', loadSave, null, 'Load Tutorial');
                    } else {
                        loadSave();
                    }
                });

                // Delete handler
                card.querySelector('.btn-delete-save').addEventListener('click', (e) => {
                    e.stopPropagation();
                    showSandModConfirm(`Are you sure you want to delete "${save.title}"?`, () => {
                        deleteSaveById(save.id);
                    }, null, 'Delete Saved Tutorial');
                });

                savesList.appendChild(card);
            });
        }
    }

    function deleteSaveById(id) {
        let saves = getStoredSaves();
        saves = saves.filter(s => s.id !== id);
        localStorage.setItem(SAVES_STORAGE_KEY, JSON.stringify(saves));
        if (currentEditingSaveId === id) {
            currentEditingSaveId = null;
        }
        updateSavesBadge();
        renderSavesDropdownContent();
        showSandModToast('Save deleted.', 'info');
    }



    // ==========================================
    // --- EXPORT FUNCTIONALITY ---
    // ==========================================

    async function exportToZip() {
        const rawTutorialName = tutorialNameInput.value.trim() || canvasTitle.textContent.trim() || 'tutorial';
        const sanitizedTutorialFolder = rawTutorialName.toLowerCase().replace(/[^a-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'tutorial';

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
        
        // 3. Update image paths in the clone & collect missing files from img src
        const imgElements = cleanCanvas.querySelectorAll('.sandmod-tutorial-image');
        for (let i = 0; i < imgElements.length; i++) {
            const img = imgElements[i];
            const fileName = img.dataset.fileName || `image_${i + 1}.png`;
            
            // If imageFiles doesn't have it but src is dataURL, store it
            if (!imageFiles.has(fileName) && img.src.startsWith('data:')) {
                try {
                    const blob = dataURLtoBlob(img.src);
                    imageFiles.set(fileName, blob);
                } catch (e) {
                    console.error('Export blob conversion error:', e);
                }
            }

            img.src = `../assets/${sanitizedTutorialFolder}/${fileName}`;
            img.removeAttribute('data-file-name');
        }

        // 4. Generate final HTML content
        const finalContentHtml = cleanCanvas.innerHTML;
        const finalPageHtml = getPageTemplate(canvasTitle.textContent, finalContentHtml);
        
        zip.file('tutorialpage.html', finalPageHtml);

        // 5. Add images to the zip organized in assets/nameofthetutorial
        const tutorialAssetsFolder = zip.folder(`assets/${sanitizedTutorialFolder}`);
        for (const [name, file] of imageFiles.entries()) {
            tutorialAssetsFolder.file(name, file);
        }

        // Add tutorial styles
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

.subheader-title > span:first-child svg {
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

.subheader-title:hover > span:first-child svg {
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

.paragraph-title > span:first-child svg {
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
    width: 100%;
    max-width: 800px;
    height: 400px;
    margin-left: 20px;
    background: var(--black-color);
    overflow: hidden;
    margin-top: 10px;
}

.yt-title {
    width: 100%;
    height: 100%;
    border: none;
}`);

        // 6. Trigger Download
        try {
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${sanitizedTutorialFolder}.zip`);
            showSandModToast('Tutorial exported as .zip successfully!', 'success');
        } catch (error) {
            console.error('Export zip failed:', error);
            showSandModToast('Failed to generate .zip file.', 'error');
        }
    }

    function getPageTemplate(title, content) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    
    <title>${title} - SandMod Tutorials</title>
    
    <meta name="description" content="${title} - SandMod Engine game development tutorial." />
    <meta name="keywords" content="sandmod, snadmod, sandmod tutorials, sandmod engine, ${title}" />
    <meta name="author" content="SandMod Creator" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="theme-color" content="#17171b" />
    
    <link rel="icon" type="image/svg+xml" sizes="any" href="../assets/logo_sandmod_original.svg" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="SandMod Tutorials" />
    <meta property="og:title" content="${title} - SandMod Tutorials" />
    <meta property="og:description" content="${title} - SandMod Engine game development tutorial." />
    <meta property="og:image" content="../assets/logo_sandmod_original.svg" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title} - SandMod Tutorials" />
    <meta name="twitter:description" content="${title} - SandMod Engine game development tutorial." />
    <meta name="twitter:image" content="../assets/logo_sandmod_original.svg" />

    <!-- Schema.org TechArticle Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "${title}",
      "description": "${title} - SandMod Engine game development tutorial.",
      "publisher": {
        "@type": "Organization",
        "name": "SandMod Tutorials"
      },
      "inLanguage": "en-US"
    }
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,400,0..1,-50..200" />
    <link rel="stylesheet" href="../style.css" />
    <link rel="stylesheet" href="tutorialpage.css" />
    <script src="../script.js" defer></script>
    <script src="tutorialpage.js" defer></script>
</head>
<body>
    <div class="sandmod-maincontent">
        <header class="sandmod-header-container">
            <div class="path">
                <span>SandMod/Tutorials/${title}</span>
            </div>
            <div class="tools-tutorial">
                <button id="bookMarkPage_y" class="sandmod-tutorial-tools-btn other" data-id="tut_custom" title="Bookmark this Tutorial">
                  <span class="material-symbols-sharp">bookmark</span>
                </button>
                <button id="sharepage_y" class="sandmod-tutorial-tools-btn other" data-id="tut_custom" title="Share this Tutorial">
                  <span class="material-symbols-sharp">share</span>
                </button>
            </div>
        </header>
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
                <img src="../assets/logo_sandmod.svg" alt="SandMod Logo" class="sandmod-logo-icon">
            </div>
        </header>
        <div class="sandmod-links">
            <ul class="sandmod-links-list">
                <li><a href="../index.html" class="sandmod-link-sidebar active" target="_self" title="Tutorials">
                    <span>
                        <span class="material-symbols-sharp">school</span>
                    </span>
                    <span>Tutorials</span>
                </a></li>
                <li><a href="../assets.html" class="sandmod-link-sidebar" target="_self" title="Assets">
                    <span>
                        <span class="material-symbols-sharp">deployed_code</span>
                    </span>
                    <span>Assets</span>
                </a></li>
                <li><a href="../index.html" class="sandmod-link-sidebar last" target="_self" title="BlockMan Creator Center">
                    <span>
                        <span class="material-symbols-sharp">manage_accounts</span>
                    </span>
                    <span>Creator Center</span>
                </a></li>
                <div class="sandmod-sidebar-tools">
                <div class="sandmod-sidebar-tool-btn-area">
                    <button class="sandmod-sidebar-tool-btn" title="Tools">
                        <span>
                            <span class="material-symbols-sharp">build</span>
                        </span>
                        <span>Tools</span>
                        <span>
                            <span class="material-symbols-sharp sandmod-sidebar-tool-btn-arrow-icon">expand_more</span>
                        </span>
                    </button>
                    <ul class="sandmod-sidebar-tools-list open">
                        <li><a href="../create.html" class="sandmod-sidebar-tool" title="create tutorial">
                            <span>
                                <span class="material-symbols-sharp">add</span>
                            </span>
                            <span>Create Tutorial</span>
                        </a></li>
                        <li><a href="../upload.html" class="sandmod-sidebar-tool" title="upload assets">
                            <span>
                                <span class="material-symbols-sharp">drive_folder_upload</span>
                            </span>
                            <span>Upload Assets</span>
                        </a></li>
                        <li><a href="../favorites.html" class="sandmod-sidebar-tool" title="favorites">
                            <span>
                                <span class="material-symbols-sharp">bookmarks</span>
                            </span>
                            <span>Favorites</span>
                        </a></li>
                    </ul>
                </div>
                <div class="sandmod-horizontal-separator"></div>
                <li><a href="https://www.blockmango.com/#/editor?from=platform" class="sandmod-link-sidebar links" target="_self" title="SandMod Website">
                    <span>
                        <svg class="sandmod-svg" fill="#e3e3e3" width="46" height="52" viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <span>SandMod Website</span>
                </a></li>
                <li><a href="https://discord.gg/vrj3FZWggK" class="sandmod-link-sidebar links" target="_self" title="SandMod Discord">
                    <span>
                        <svg class="dc-svg" fill="rgba(235, 235, 245, .6)" style="stroke: none;" width="24" height="24" viewBox="0 0 0.96 0.96" xmlns="http://www.w3.org/2000/svg"><path d="M.63.605A.087.087 0 0 1 .549.514.086.086 0 0 1 .63.423a.085.085 0 0 1 .081.091.086.086 0 0 1-.081.091m-.299 0A.087.087 0 0 1 .25.514.086.086 0 0 1 .331.423a.085.085 0 0 1 .081.091v.005a.086.086 0 0 1-.081.086M.792.194A.7.7 0 0 0 .613.138L.609.137H.608L.606.138.584.181.583.184a.7.7 0 0 0-.21 0L.377.183.353.134l.001.002L.352.135a.7.7 0 0 0-.188.059L.169.192.168.193A.75.75 0 0 0 .03.63q0 .041.004.081V.708L.035.71a.7.7 0 0 0 .219.112l.005.001H.26L.262.822.307.75.308.747.306.743.233.708l.002.001L.234.707.235.705.249.694h.003A.52.52 0 0 0 .707.692L.704.693h.003l.014.011.001.002-.001.002A.4.4 0 0 1 .654.74L.651.741.649.744v.001q.022.043.047.076L.695.819.698.82A.7.7 0 0 0 .925.705L.923.706.924.704A.75.75 0 0 0 .789.19l.002.002L.79.191z"/></svg>
                    </span>
                    <span>SandMod Discord</span>
                </a></li>
            </ul>
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
    </div>
</body>
</html>`;
    }
});