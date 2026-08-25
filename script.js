// =====================
// Toast Notification Utility
// =====================
function showSandModToast(message, type = 'info') {
    let container = document.querySelector('.sandmod-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'sandmod-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `sandmod-toast sandmod-toast-${type}`;
    
    const iconName = type === 'success' ? 'check' : (type === 'error' ? 'priority_high' : 'info');

    toast.innerHTML = `
        <span class="material-symbols-sharp sandmod-toast-icon">${iconName}</span>
        <span class="sandmod-toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 260);
    }, 3000);
}

// =====================
// Confirmation Modal Utility
// =====================
function showSandModConfirm(message, onConfirm, onCancel, title = 'Confirmation') {
    let modal = document.querySelector('.sandmod-confirm-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'sandmod-confirm-modal';
        modal.innerHTML = `
            <div class="sandmod-confirm-dialog">
                <h3 class="sandmod-confirm-title"></h3>
                <p class="sandmod-confirm-msg"></p>
                <div class="sandmod-confirm-actions">
                    <button class="sandmod-btn-cancel">Cancel</button>
                    <button class="sandmod-btn-confirm">Confirm</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const titleEl = modal.querySelector('.sandmod-confirm-title');
    const msgEl = modal.querySelector('.sandmod-confirm-msg');
    const cancelBtn = modal.querySelector('.sandmod-btn-cancel');
    const confirmBtn = modal.querySelector('.sandmod-btn-confirm');

    titleEl.textContent = title;
    msgEl.textContent = message;

    const closeModal = () => {
        modal.classList.remove('open');
        cancelBtn.onclick = null;
        confirmBtn.onclick = null;
        modal.onclick = null;
    };

    cancelBtn.onclick = () => {
        closeModal();
        if (typeof onCancel === 'function') onCancel();
    };

    confirmBtn.onclick = () => {
        closeModal();
        if (typeof onConfirm === 'function') onConfirm();
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
            if (typeof onCancel === 'function') onCancel();
        }
    };

    modal.classList.add('open');
}

// =====================
// Constants & Data
// =====================

const TUTORIAL_BOOKMARKS_KEY = 'sandmodBookmarkedTutorials';
const ASSET_BOOKMARKS_KEY = 'sandmodBookmarkedAssets';
const BOOKMARKS_STORAGE_KEY = 'sandmodBookmarkedItems';

const svgs = {
    bookIcon: `<span class="material-symbols-sharp">menu_book</span>`,
    packageIcon: `<span class="material-symbols-sharp">inventory_2</span>`,
    notebookIcon: `<span class="material-symbols-sharp">smart_display</span>`,
    fileTextIcon: `<span class="material-symbols-sharp">article</span>`,
    bookmarkDefault: `<span class="material-symbols-sharp">bookmark</span>`,
    bookmarkFilled: `<span class="material-symbols-sharp" style="font-variation-settings: 'FILL' 1;">bookmark</span>`,
    share: `<span class="material-symbols-sharp">share</span>`,
    asset3DIcon: `<span class="material-symbols-sharp">deployed_code</span>`,
    assetPackageIcon: `<span class="material-symbols-sharp">folder_zip</span>`
};

/* reminder :
    {
        id: "tut001",
        videoTitle: "How to create a SandMod Tutorial Lorem Ipsum, Lorem Ipsum",
        authorName: "Chilaxe",
        authorPfpSrc: "./assets/Untitled-1.png",
        type1: "Tutorial",
        type2: "Text",
        tutorialLink: "./tutorialpage.html",
        assetDownloadLink: null, assetType: null, asset3DModel: null, assetPackage: null
    },
    {
        id: "tut002",
        videoTitle: "How to create a SandMod Tutorial Lorem Ipsum, Lorem Ipsum",
        authorName: "Chilaxe",
        authorPfpSrc: "./assets/Untitled-1.png",
        type1: "Tutorial",
        type2: "Video",
        tutorialLink: "./#",
        assetDownloadLink: null, assetType: null, asset3DModel: null, assetPackage: null
    },
    {
        id: "ast001",
        videoTitle: "Sci-Fi Astronaut",
        authorName: "Chilaxe",
        authorPfpSrc: "./assets/creator_pfp.png",
        type1: "Asset",
        type2: null,
        assetPreviewImageSrc: "./assets/3d_asset_example.png",
        assetModelSrc: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
        assetDescription: "A highly detailed 3D model of an astronaut, rigged and ready for your SandMod adventures. Includes PBR textures.",
        tutorialLink: null,
        assetDownloadLink: "./path/to/astronaut.zip",
        assetType: "3D",
        asset3DModel: "Astronaut Character",
        assetPackage: null,
        tutorialVideoUrl: null,
        tutorialTextContent: null
    },
    {
        id: "ast002",
        videoTitle: "Useful Script Package",
        authorName: "AssetCreator2",
        authorPfpSrc: "./assets/creator_pfp_example.png",
        type1: "Asset",
        type2: null,
        assetPreviewImageSrc: "./assets/package_asset_example.png",
        assetModelSrc: null,
        assetDescription: "A collection of essential Lua scripts to enhance gameplay mechanics. Easy to integrate and customize.",
        tutorialLink: null,
        assetDownloadLink: "./path/to/download2.zip",
        assetType: "Package",
        asset3DModel: null,
        assetPackage: "Utility Scripts v1.0",
        tutorialVideoUrl: null,
        tutorialTextContent: null
    }
*/

const tutorialsData = [
    {
        id: "tut001",
        videoTitle: "Beginner’s Guide to Using Sandmod Engine",
        authorName: "Chilaxe",
        authorPfpSrc: "./assets/Untitled-1.png",
        type1: "Tutorial",
        type2: "Text",
        tutorialLink: "./tutorials/1001.html",
        assetDownloadLink: null, assetType: null, asset3DModel: null, assetPackage: null
    },
    {
        id: "tut002",
        videoTitle: "How to Build Level, Energy, and Health Systems for Your Game in SandMod Engine",
        authorName: "Chilaxe",
        authorPfpSrc: "./assets/Untitled-1.png",
        type1: "Tutorial",
        type2: "Text",
        tutorialLink: "./tutorials/1002.html",
        assetDownloadLink: null, assetType: null, asset3DModel: null, assetPackage: null
    },
    {
        id: "tut003",
        videoTitle: "How to Create Voxel Maps for Sandmod Engine",
        authorName: "Chilaxe",
        authorPfpSrc: "./assets/Untitled-1.png",
        type1: "Tutorial",
        type2: "Text",
        tutorialLink: "./tutorials/1003.html",
        assetDownloadLink: null, assetType: null, asset3DModel: null, assetPackage: null
    },
    {
        id: "ast001",
        videoTitle: "Boy Model",
        authorName: "Chilaxe",
        authorPfpSrc: "./assets/Untitled-1.png",
        type1: "Asset",
        type2: null,
        assetPreviewImageSrc: null,
        assetModelSrc: "./assets/boyglb.glb",
        assetDescription: "The Default Boy Model of Blockman Go.",
        tutorialLink: null,
        assetDownloadLink: "./assets/boy.FBX",
        assetType: "3D",
        asset3DModel: "Boy Character",
        assetPackage: null,
        tutorialVideoUrl: null,
        tutorialTextContent: null
    },
];

// note 
/*
    {
        id: "tut003",
        videoTitle: "How to Build Level, Energy, and Health Systems for Your Game in SandMod Engine",
        authorName: "BGTalk",
        authorPfpSrc: "./assets/da3c790b6b1c054791a551657cc84fff.png",
        type1: "Tutorial",
        type2: "Text",
        tutorialLink: "./tutorials/1002.html",
        assetDownloadLink: null, assetType: null, asset3DModel: null, assetPackage: null
    }
*/

// =====================
// Bookmark Utilities
// =====================

function getStorageKeyForItemType(itemType1) {
    return itemType1 === 'Tutorial' ? TUTORIAL_BOOKMARKS_KEY : ASSET_BOOKMARKS_KEY;
}

function getBookmarkedIds(itemType1) {
    const storageKey = getStorageKeyForItemType(itemType1);
    const bookmarks = localStorage.getItem(storageKey);
    return bookmarks ? JSON.parse(bookmarks) : [];
}

function saveBookmarkedIds(idsArray, itemType1) {
    const storageKey = getStorageKeyForItemType(itemType1);
    localStorage.setItem(storageKey, JSON.stringify(idsArray));
}

function isItemBookmarked(itemId, itemType1) {
    const bookmarkedIds = getBookmarkedIds(itemType1);
    return bookmarkedIds.includes(itemId);
}

function toggleBookmark(itemId, itemType1) {
    let bookmarkedIds = getBookmarkedIds(itemType1);
    const currentlyBookmarked = bookmarkedIds.includes(itemId);

    if (currentlyBookmarked) {
        bookmarkedIds = bookmarkedIds.filter(id => id !== itemId);
    } else {
        bookmarkedIds.push(itemId);
    }
    saveBookmarkedIds(bookmarkedIds, itemType1);

    const bookmarkChangedEvent = new CustomEvent('itemBookmarkChanged', {
        detail: {
            itemId: itemId,
            itemType: itemType1,
            isNowBookmarked: !currentlyBookmarked
        },
        bubbles: true,
        cancelable: true
    });
    document.body.dispatchEvent(bookmarkChangedEvent);

    return !currentlyBookmarked;
}

// =====================
// UI Creation Functions
// =====================

function createTutorialCard(itemData) {
    const cardElement = document.createElement('div');
    cardElement.className = 'sandmod-forum-tutorial';
    cardElement.dataset.itemId = itemData.id;

    cardElement.addEventListener('click', (e) => {
        if (e.target.closest('button, a')) {
            return;
        }
        const targetUrl = itemData.type1 === "Asset" ? (itemData.assetDownloadLink || '#asset-details') : (itemData.tutorialLink || '#');
        if (targetUrl && targetUrl !== '#' && targetUrl !== '#asset-details') {
            window.location.href = targetUrl;
        }
    });

    const cardHeader = document.createElement('div');
    cardHeader.className = 'sandmod-tutorial-card-header';

    const cardTitleGroup = document.createElement('div');
    cardTitleGroup.className = 'sandmod-tutorial-title-group';

    const tutorialIco = document.createElement('span');
    tutorialIco.className = 'tutorial-ico';
    tutorialIco.innerHTML = itemData.type1 === "Asset" ? svgs.packageIcon : svgs.bookIcon;
    cardTitleGroup.appendChild(tutorialIco);

    const tutorialTitle = document.createElement('h3');
    tutorialTitle.className = 'tutorial-title';
    tutorialTitle.textContent = itemData.videoTitle;
    cardTitleGroup.appendChild(tutorialTitle);

    cardHeader.appendChild(cardTitleGroup);

    if (itemData.type1 === "Tutorial" && itemData.type2) {
        const typeBadge = document.createElement('div');
        typeBadge.className = 'sandmod-tutorial-type-badge';
        const typeIcon = itemData.type2 === "Video" ? svgs.notebookIcon : svgs.fileTextIcon;
        typeBadge.innerHTML = `${typeIcon}<span>${itemData.type2}</span>`;
        cardHeader.appendChild(typeBadge);
    }
    cardElement.appendChild(cardHeader);

    const cardFooter = document.createElement('div');
    cardFooter.className = 'sandmod-tutorial-card-footer';

    const creditPfpDiv = document.createElement('div');
    creditPfpDiv.className = 'tutorial-credit-pfp';
    const pfpImg = document.createElement('img');
    pfpImg.src = itemData.authorPfpSrc || './assets/default_pfp.png';
    pfpImg.alt = `${itemData.authorName} profile picture`;
    pfpImg.className = 'tutorial-credit-pfp-img';
    const pfNameSpan = document.createElement('span');
    pfNameSpan.className = 'tutorial-credit-pf-name';
    pfNameSpan.textContent = itemData.authorName;
    creditPfpDiv.appendChild(pfpImg);
    creditPfpDiv.appendChild(pfNameSpan);

    const toolsTutorial = document.createElement('div');
    toolsTutorial.className = 'tools-tutorial';

    const bookmarkButton = document.createElement('button');
    bookmarkButton.className = 'sandmod-tutorial-tools-btn';
    const bookmarkIconSpan = document.createElement('span');
    function updateBookmarkButtonVisuals() {
        if (isItemBookmarked(itemData.id, 'Tutorial')) {
            bookmarkIconSpan.innerHTML = svgs.bookmarkFilled;
            bookmarkButton.classList.add('bookmarked');
            bookmarkButton.title = 'Remove Bookmark';
        } else {
            bookmarkIconSpan.innerHTML = svgs.bookmarkDefault;
            bookmarkButton.classList.remove('bookmarked');
            bookmarkButton.title = 'Bookmark';
        }
    }
    updateBookmarkButtonVisuals();
    bookmarkButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(itemData.id, 'Tutorial');
        updateBookmarkButtonVisuals();
    });
    bookmarkButton.appendChild(bookmarkIconSpan);

    const shareButton = document.createElement('button');
    shareButton.className = 'sandmod-tutorial-tools-btn';
    shareButton.title = 'Share';
    const shareIconSpan = document.createElement('span');
    shareIconSpan.innerHTML = svgs.share;
    shareButton.appendChild(shareIconSpan);
    shareButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const shareURL = itemData.tutorialLink || window.location.href;
        if (navigator.share) {
            navigator.share({
                title: itemData.videoTitle,
                text: `Check out: ${itemData.videoTitle} by ${itemData.authorName}`,
                url: shareURL,
            }).catch(error => console.log('Error sharing:', error));
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareURL).then(() => {
                showSandModToast('Link copied to clipboard!', 'success');
            }).catch(() => {
                showSandModToast(`Share link: ${shareURL}`, 'info');
            });
        } else {
            showSandModToast(`Share link: ${shareURL}`, 'info');
        }
    });

    toolsTutorial.appendChild(bookmarkButton);
    toolsTutorial.appendChild(shareButton);

    cardFooter.appendChild(creditPfpDiv);
    cardFooter.appendChild(toolsTutorial);
    cardElement.appendChild(cardFooter);

    return cardElement;
}

function createAssetCard(itemData) {
    const cardElement = document.createElement('div');
    cardElement.className = 'sandmod-asset-item';
    cardElement.dataset.itemId = itemData.id;
    cardElement.dataset.assetType = itemData.assetType;

    cardElement.addEventListener('click', (event) => {
        if (event.target.closest('button, a')) {
            return;
        }
        createAndShowAssetDetailOverlay(itemData);
    });

    const header = document.createElement('header');
    header.className = 'sandmod-asset-header';

    const typeIconSpan = document.createElement('span');
    typeIconSpan.className = 'sandmod-asset-type-icon';
    typeIconSpan.innerHTML = svgs.packageIcon;
    header.appendChild(typeIconSpan);

    if (itemData.assetType) {
        const type2IconSpan = document.createElement('span');
        type2IconSpan.className = 'sandmod-asset-type-2';
        if (itemData.assetType === '3D') {
            type2IconSpan.innerHTML = svgs.asset3DIcon;
        } else if (itemData.assetType === 'Package') {
            type2IconSpan.innerHTML = svgs.assetPackageIcon;
        }
        if (type2IconSpan.innerHTML) {
            header.appendChild(type2IconSpan);
        }
    }
    cardElement.appendChild(header);

    const previewContainer = document.createElement('div');
    if (itemData.assetType === "3D" && itemData.assetModelSrc) {
        previewContainer.className = 'sandmod-asset-preview-3d';
        const modelViewerElement = document.createElement('model-viewer');
        modelViewerElement.setAttribute('src', itemData.assetModelSrc);
        modelViewerElement.setAttribute('alt', itemData.videoTitle || '3D Model');
        modelViewerElement.setAttribute('camera-controls', '');
        modelViewerElement.setAttribute('ar', '');
        modelViewerElement.setAttribute('shadow-intensity', '1');
        modelViewerElement.classList.add('sandmod-asset-model-viewer');
        modelViewerElement.style.width = '100%';
        modelViewerElement.style.height = '200px';
        modelViewerElement.style.display = 'block';
        previewContainer.appendChild(modelViewerElement);
    } else if (itemData.assetPreviewImageSrc) {
        previewContainer.className = 'sandmod-asset-preview-image';
        const previewImg = document.createElement('img');
        previewImg.src = itemData.assetPreviewImageSrc;
        previewImg.alt = itemData.videoTitle || 'Asset Preview';
        previewContainer.appendChild(previewImg);
    } else {
        previewContainer.className = 'sandmod-asset-preview-placeholder';
        previewContainer.textContent = 'No Preview Available';
        previewContainer.style.height = '200px';
        previewContainer.style.display = 'flex';
        previewContainer.style.alignItems = 'center';
        previewContainer.style.justifyContent = 'center';
        previewContainer.style.backgroundColor = '#2a2a2a';
    }
    cardElement.appendChild(previewContainer);

    const assetInfoDiv = document.createElement('div');
    assetInfoDiv.className = 'sandmod-asset-info';
    const assetTitle = document.createElement('h3');
    assetTitle.className = 'sandmod-asset-title';
    if (itemData.tutorialLink) {
        const titleLink = document.createElement('a');
        titleLink.href = itemData.tutorialLink;
        titleLink.textContent = itemData.videoTitle;
        titleLink.target = "_blank";
        titleLink.className = 'sandmod-asset-title';
        titleLink.style = 'text-decoration: none; color: inherit;';
        titleLink.rel = "noopener noreferrer";
        assetTitle.appendChild(titleLink);
    } else {
        assetTitle.textContent = itemData.videoTitle;
    }
    assetInfoDiv.appendChild(assetTitle);
    cardElement.appendChild(assetInfoDiv);

    const creditsAssetsDiv = document.createElement('div');
    creditsAssetsDiv.className = 'credits-assets';

    const pfpDiv = document.createElement('div');
    pfpDiv.className = 'pfp';
    const pfpImgCreator = document.createElement('img');
    pfpImgCreator.src = itemData.authorPfpSrc || './assets/default_pfp.png';
    pfpImgCreator.alt = itemData.authorName;
    pfpImgCreator.className = 'pfp-image';
    const pfpNameSpanCreator = document.createElement('span');
    pfpNameSpanCreator.className = 'pfp-name';
    pfpNameSpanCreator.textContent = itemData.authorName;
    pfpDiv.appendChild(pfpImgCreator);
    pfpDiv.appendChild(pfpNameSpanCreator);

    const toolsAssetsDiv = document.createElement('div');
    toolsAssetsDiv.className = 'tools-assets';

    const bookmarkButtonAsset = document.createElement('button');
    bookmarkButtonAsset.className = 'sandmod-tool-asset';
    const bookmarkIconSpanAsset = document.createElement('span');
    function updateAssetBookmarkVisuals() {
        if (isItemBookmarked(itemData.id, 'Asset')) {
            bookmarkIconSpanAsset.innerHTML = svgs.bookmarkFilled;
            bookmarkButtonAsset.classList.add('bookmarked');
            bookmarkButtonAsset.title = 'Remove Bookmark';
        } else {
            bookmarkIconSpanAsset.innerHTML = svgs.bookmarkDefault;
            bookmarkButtonAsset.classList.remove('bookmarked');
            bookmarkButtonAsset.title = 'Bookmark Asset';
        }
    }
    updateAssetBookmarkVisuals();
    bookmarkButtonAsset.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(itemData.id, 'Asset');
        updateAssetBookmarkVisuals();
    });
    bookmarkButtonAsset.appendChild(bookmarkIconSpanAsset);

    const shareButtonAsset = document.createElement('button');
    shareButtonAsset.className = 'sandmod-tool-asset';
    shareButtonAsset.title = 'Share Asset';
    const shareIconSpanAsset = document.createElement('span');
    shareIconSpanAsset.innerHTML = svgs.share;
    shareButtonAsset.appendChild(shareIconSpanAsset);
    shareButtonAsset.addEventListener('click', (e) => {
        e.stopPropagation();
        const shareURL = itemData.assetDownloadLink || itemData.tutorialLink || window.location.href;
        if (navigator.share) {
            navigator.share({
                title: itemData.videoTitle,
                text: `Check out this asset: ${itemData.videoTitle} by ${itemData.authorName}`,
                url: shareURL,
            }).catch(error => console.log('Error sharing asset:', error));
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareURL).then(() => {
                showSandModToast('Asset link copied to clipboard!', 'success');
            }).catch(() => {
                showSandModToast(`Asset link: ${shareURL}`, 'info');
            });
        } else {
            showSandModToast(`Asset link: ${shareURL}`, 'info');
        }
    });

    toolsAssetsDiv.appendChild(bookmarkButtonAsset);
    toolsAssetsDiv.appendChild(shareButtonAsset);
    creditsAssetsDiv.appendChild(pfpDiv);
    creditsAssetsDiv.appendChild(toolsAssetsDiv);
    cardElement.appendChild(creditsAssetsDiv);

    return cardElement;
}

// =====================
// Rendering & Filtering
// =====================

/**
 * Filter items by author, title, or type
 * @param {string} query Search input
 * @param {Array} items List of items
 * @returns {Array} Filtered list
 */
function searchItems(query, items) {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return items;

    return items.filter(item => {
        const titleMatch = item.videoTitle && item.videoTitle.toLowerCase().includes(lowerQuery);
        const authorMatch = item.authorName && item.authorName.toLowerCase().includes(lowerQuery);
        const typeMatch = item.type2 && item.type2.toLowerCase().includes(lowerQuery);
        return titleMatch || authorMatch || typeMatch;
    });
}

function renderFilteredItems(items, query, itemTypeSingularForMessage, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID '${containerId}' not found for rendering.`);
        return;
    }
    container.innerHTML = '';

    if (!Array.isArray(items)) {
        console.error("renderFilteredItems received non-array:", items);
        items = [];
    }
    const itemTypeMsg = itemTypeSingularForMessage || 'items';

    if (items.length === 0 && query && query.trim() !== '') {
        container.innerHTML = `<p class="no-results-message">No ${itemTypeMsg} found matching '${query}'.</p>`;
    } else if (items.length === 0) {
        container.innerHTML = `<p class="no-results-message">No ${itemTypeMsg} currently available.</p>`;
    } else {
        items.forEach(itemData => {
            let card;
            if (itemData.type1 === 'Tutorial') {
                card = createTutorialCard(itemData);
            } else if (itemData.type1 === 'Asset') {
                card = createAssetCard(itemData);
            } else {
                console.warn("Unknown item type1:", itemData.type1, itemData);
                return;
            }
            if (card) container.appendChild(card);
        });
    }
}

function setActiveButton(buttons, activeValue) {
    buttons.forEach(btn => {
        if (btn.dataset.value === activeValue) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// =====================
// Mobile Sidebar Navigation
// =====================
function initMobileNavigation() {
    const sidebar = document.querySelector('.sandmod-sidebar');
    const header = document.querySelector('.sandmod-header-container');

    if (!sidebar || !header) return;

    // Create mobile menu toggle button in header if not already present
    let toggleBtn = header.querySelector('.mobile-sidebar-toggle');
    if (!toggleBtn) {
        toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-sidebar-toggle';
        toggleBtn.type = 'button';
        toggleBtn.setAttribute('aria-label', 'Toggle Navigation Menu');
        toggleBtn.innerHTML = `<span class="material-symbols-sharp">menu</span>`;
        header.prepend(toggleBtn);
    }

    // Create backdrop overlay if not present
    let backdrop = document.querySelector('.sidebar-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        document.body.appendChild(backdrop);
    }

    function toggleSidebar(open) {
        const isOpen = typeof open === 'boolean' ? open : !sidebar.classList.contains('open');
        if (isOpen) {
            sidebar.classList.add('open');
            backdrop.classList.add('active');
            toggleBtn.innerHTML = `<span class="material-symbols-sharp">close</span>`;
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('open');
            backdrop.classList.remove('active');
            toggleBtn.innerHTML = `<span class="material-symbols-sharp">menu</span>`;
            document.body.style.overflow = '';
        }
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
    });

    backdrop.addEventListener('click', () => {
        toggleSidebar(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            toggleSidebar(false);
        }
    });

    // Close on navigation link click when on mobile screen
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleSidebar(false);
            }
        });
    });
}

// =====================
// Main DOMContentLoaded Logic
// =====================

document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    const originalData = tutorialsData;

    const isTutorialsPage = !!document.getElementById('tutorials-container');
    const isAssetsPage = !!document.getElementById('assets-container');

    if (isTutorialsPage) {
        const tutorialsContainer = document.getElementById('tutorials-container');
        const tutorialSearchInput = document.getElementById('tutorial-search-input');
        const tutorialFilterButtonsContainer = document.getElementById('tutorial-filters');

        if (!tutorialsContainer) {
            console.error('CRITICAL: Tutorials container (#tutorials-container) not found on tutorials page!');
            return;
        }
        if (!tutorialSearchInput) console.warn('Warning: Tutorial search input missing on tutorials page.');
        if (!tutorialFilterButtonsContainer) console.warn('Warning: Tutorial filter buttons container missing on tutorials page.');

        let activeTutorialType2Filter = 'all';

        function updateTutorialDisplay() {
            const query = tutorialSearchInput ? tutorialSearchInput.value.toLowerCase().trim() : '';
            let filtered = originalData.filter(item => item.type1 === 'Tutorial');
            if (activeTutorialType2Filter !== 'all') {
                filtered = filtered.filter(item => item.type2 === activeTutorialType2Filter);
            }
            if (query) {
                filtered = filtered.filter(item =>
                    (item.videoTitle && item.videoTitle.toLowerCase().includes(query)) ||
                    (item.authorName && item.authorName.toLowerCase().includes(query))
                );
            }

            filtered.reverse();
            renderFilteredItems(filtered, query, 'tutorials', 'tutorials-container');
        }

        updateTutorialDisplay();

        if (tutorialSearchInput) {
            tutorialSearchInput.addEventListener('input', updateTutorialDisplay);
            const form = tutorialSearchInput.closest('form');
            if (form) form.addEventListener('submit', (e) => { e.preventDefault(); updateTutorialDisplay(); });
        }

        if (tutorialFilterButtonsContainer) {
            const tutorialTypeButtons = tutorialFilterButtonsContainer.querySelectorAll('.sandmod-tutorial-filter-btn');
            tutorialFilterButtonsContainer.addEventListener('click', function(event) {
                const targetButton = event.target.closest('.sandmod-tutorial-filter-btn');
                if (!targetButton || !targetButton.dataset.value) return;
                activeTutorialType2Filter = targetButton.dataset.value;
                setActiveButton(tutorialTypeButtons, activeTutorialType2Filter);
                updateTutorialDisplay();
            });
            setActiveButton(tutorialTypeButtons, activeTutorialType2Filter);
        }

    } else if (isAssetsPage) {
        const assetsContainer = document.getElementById('assets-container');
        const assetSearchInput = document.getElementById('asset-search-input');
        const assetFilterButtonsContainer = document.getElementById('asset-filters');

        if (!assetsContainer) {
            console.error('CRITICAL: Assets container (#assets-container) not found on assets page!');
            return;
        }
        if (!assetSearchInput) console.warn('Warning: Asset search input missing on assets page.');
        if (!assetFilterButtonsContainer) console.warn('Warning: Asset filter buttons container missing on assets page.');

        let activeAssetTypeFilter = 'all';

        function updateAssetDisplay() {
            const query = assetSearchInput ? assetSearchInput.value.toLowerCase().trim() : '';
            let filtered = originalData.filter(item => item.type1 === 'Asset');

            if (activeAssetTypeFilter !== 'all') {
                filtered = filtered.filter(item => item.assetType === activeAssetTypeFilter);
            }
            if (query) {
                filtered = filtered.filter(item =>
                    (item.videoTitle && item.videoTitle.toLowerCase().includes(query)) ||
                    (item.authorName && item.authorName.toLowerCase().includes(query)) ||
                    (item.assetPackage && item.assetPackage.toLowerCase().includes(query)) ||
                    (item.asset3DModel && item.asset3DModel.toLowerCase().includes(query))
                );
            }
            renderFilteredItems(filtered, query, 'assets', 'assets-container');
        }

        updateAssetDisplay();

        if (assetSearchInput) {
            assetSearchInput.addEventListener('input', updateAssetDisplay);
            const form = assetSearchInput.closest('form');
            if (form) form.addEventListener('submit', (e) => { e.preventDefault(); updateAssetDisplay(); });
        }

        if (assetFilterButtonsContainer) {
            const assetTypeButtons = assetFilterButtonsContainer.querySelectorAll('.sandmod-tutorial-filter-btn[data-filter-type="asset"]');
            assetFilterButtonsContainer.addEventListener('click', function(event) {
                const targetButton = event.target.closest('.sandmod-tutorial-filter-btn[data-filter-type="asset"]');
                if (!targetButton || !targetButton.dataset.value) return;
                activeAssetTypeFilter = targetButton.dataset.value;
                setActiveButton(assetTypeButtons, activeAssetTypeFilter);
                updateAssetDisplay();
            });
            setActiveButton(assetTypeButtons, activeAssetTypeFilter);
        }
    }
});

// =====================
// UI: Filter Area Toggle (Context Aware)
// =====================

document.addEventListener("DOMContentLoaded", function() {
    const filterBtn = document.querySelector('.sandmod-tutorial-filter-btn.filter-btn');
    let filterAreaElement = null;

    if (document.getElementById('tutorial-filters')) {
        filterAreaElement = document.getElementById('tutorial-filters');
    } else if (document.getElementById('asset-filters')) {
        filterAreaElement = document.getElementById('asset-filters');
    }

    if (filterBtn && filterAreaElement) {
        filterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            filterAreaElement.classList.toggle('open');
        });
    }
});

// =====================
// UI: Sidebar Tools Toggle
// =====================

document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.querySelector('.sandmod-sidebar-tool-btn');
    const toolsContainer = document.querySelector('.sandmod-sidebar-tools-list');

    if (toggleBtn && toolsContainer) {
        const arrowIcon = toggleBtn.querySelector('.sandmod-sidebar-tool-btn-arrow-icon');
        
        toggleBtn.addEventListener('click', () => {
            const isOpen = toolsContainer.classList.toggle('open');
            toggleBtn.classList.toggle('open', isOpen);
            if (arrowIcon && !arrowIcon.querySelector('svg')) {
                arrowIcon.textContent = isOpen ? 'expand_less' : 'expand_more';
            }
        });
    }
});

// =====================
// Favorites Page Logic
// =====================

document.addEventListener('DOMContentLoaded', () => {
    const favTutorialsContainer = document.getElementById('favorite-tutorials-container');
    const favAssetsContainer = document.getElementById('favorite-assets-container');

    if (!favTutorialsContainer && !favAssetsContainer) {
        return;
    }

    if (typeof tutorialsData === 'undefined' ||
        typeof getBookmarkedIds !== 'function' ||
        typeof createTutorialCard !== 'function' ||
        typeof createAssetCard !== 'function') {
        console.error("CRITICAL: Required data or functions (tutorialsData, getBookmarkedIds, createTutorialCard, createAssetCard) are missing for Favorites page.");
        if(favTutorialsContainer) favTutorialsContainer.innerHTML = "<p class='no-results-message'>Error loading favorites data.</p>";
        if(favAssetsContainer) favAssetsContainer.innerHTML = "<p class='no-results-message'>Error loading favorites data.</p>";
        return;
    }

    function renderFavorites(itemType1, container) {
        if (!container) return;
        container.innerHTML = '';

        const bookmarkedIds = getBookmarkedIds(itemType1);
        const favoriteItems = tutorialsData.filter(item =>
            item.type1 === itemType1 && bookmarkedIds.includes(item.id)
        );

        if (favoriteItems.length === 0) {
            container.innerHTML = `<p class="no-results-message">You have no bookmarked ${itemType1.toLowerCase()}s yet.</p>`;
        } else {
            favoriteItems.forEach(itemData => {
                let card;
                if (itemType1 === 'Tutorial') {
                    card = createTutorialCard(itemData);
                } else {
                    card = createAssetCard(itemData);
                }
                if (card) container.appendChild(card);
            });
        }
    }

    function refreshFavoritesDisplay() {
        if (favTutorialsContainer) {
            renderFavorites('Tutorial', favTutorialsContainer);
        }
        if (favAssetsContainer) {
            renderFavorites('Asset', favAssetsContainer);
        }
    }

    document.body.addEventListener('itemBookmarkChanged', function(event) {
        if (event.detail.itemType === 'Tutorial' && favTutorialsContainer) {
            renderFavorites('Tutorial', favTutorialsContainer);
        } else if (event.detail.itemType === 'Asset' && favAssetsContainer) {
            renderFavorites('Asset', favAssetsContainer);
        }
    });

    refreshFavoritesDisplay();
});

// =====================
// Other Stuff
// =====================

// Global reference to the currently open overlay to manage it
let currentAssetOverlay = null;

function hideAndRemoveAssetDetailOverlay() {
    if (currentAssetOverlay) {
        currentAssetOverlay.classList.remove('show');
        
        setTimeout(() => {
            if (currentAssetOverlay && currentAssetOverlay.parentNode) {
                currentAssetOverlay.parentNode.removeChild(currentAssetOverlay);
            }
            currentAssetOverlay = null;
            document.body.style.overflow = '';
        }, 240);
    }
    document.removeEventListener('keydown', handleEscapeKeyForOverlay);
}

function handleEscapeKeyForOverlay(event) {
    if (event.key === 'Escape') {
        hideAndRemoveAssetDetailOverlay();
    }
}

/**
 * Creates and displays a detailed overlay window for a given asset.
 * @param {object} assetData The data object for the asset to display.
 */
function createAndShowAssetDetailOverlay(assetData) {
    if (!assetData) {
        console.error("No asset data provided to create overlay.");
        return;
    }
    if (currentAssetOverlay) {
        hideAndRemoveAssetDetailOverlay();
    }

    const overlayDiv = document.createElement('div');
    overlayDiv.className = 'overlay-window-asset';
    overlayDiv.addEventListener('click', (e) => {
        if (e.target === overlayDiv) {
            hideAndRemoveAssetDetailOverlay();
        }
    });

    const contentDiv = document.createElement('div');
    contentDiv.className = 'overlay-window-asset-content';

    // 1. Drawer Header
    const drawerHeader = document.createElement('div');
    drawerHeader.className = 'asset-drawer-header';

    const headerLeft = document.createElement('div');
    headerLeft.className = 'asset-drawer-header-left';
    const badgeSpan = document.createElement('span');
    badgeSpan.className = 'asset-badge';
    badgeSpan.innerHTML = `<span class="material-symbols-sharp" style="font-size: 14px;">${assetData.assetType === '3D' ? 'deployed_code' : 'inventory_2'}</span> ${assetData.assetType === '3D' ? '3D Model' : 'Asset Pack'}`;
    headerLeft.appendChild(badgeSpan);
    drawerHeader.appendChild(headerLeft);

    const closeButton = document.createElement('button');
    closeButton.className = 'close-overlay-btn';
    closeButton.title = 'Close (Esc)';
    closeButton.innerHTML = `<span class="material-symbols-sharp">close</span>`;
    closeButton.addEventListener('click', hideAndRemoveAssetDetailOverlay);
    drawerHeader.appendChild(closeButton);

    contentDiv.appendChild(drawerHeader);

    // 2. Scrollable Body
    const drawerBody = document.createElement('div');
    drawerBody.className = 'asset-drawer-body';

    // Preview
    const previewArea = document.createElement('div');
    previewArea.className = 'asset-perview';

    if (assetData.assetType === "3D" && assetData.assetModelSrc) {
        const modelViewer = document.createElement('model-viewer');
        modelViewer.className = 'asset-model-viewer';
        modelViewer.src = assetData.assetModelSrc;
        modelViewer.alt = assetData.videoTitle || "3D Model Preview";
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('shadow-intensity', '1');
        previewArea.appendChild(modelViewer);
    } else if (assetData.assetPreviewImageSrc) {
        const img = document.createElement('img');
        img.src = assetData.assetPreviewImageSrc;
        img.alt = assetData.videoTitle || "Asset Thumbnail";
        img.className = 'asset-thumbnail-img';
        previewArea.appendChild(img);
    } else {
        previewArea.innerHTML = '<div class="loading-indicator">No preview available.</div>';
    }
    drawerBody.appendChild(previewArea);

    // Details info
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'asset-details';

    const titleH2 = document.createElement('h2');
    titleH2.className = 'asset-title';
    titleH2.textContent = assetData.videoTitle || 'Asset Details';
    detailsDiv.appendChild(titleH2);

    // Author line (simple inline)
    const authorMeta = document.createElement('div');
    authorMeta.className = 'asset-drawer-author';
    const authorImg = document.createElement('img');
    authorImg.src = assetData.authorPfpSrc || './assets/default_pfp.png';
    authorImg.alt = assetData.authorName || 'Author';
    authorImg.className = 'asset-drawer-author-img';
    const authorText = document.createElement('span');
    authorText.className = 'asset-drawer-author-text';
    authorText.innerHTML = `by <strong class="asset-drawer-author-name">${assetData.authorName || 'Anonymous'}</strong>`;
    authorMeta.appendChild(authorImg);
    authorMeta.appendChild(authorText);
    detailsDiv.appendChild(authorMeta);

    // Description (simple text paragraph)
    if (assetData.assetDescription) {
        const descriptionP = document.createElement('p');
        descriptionP.className = 'asset-description';
        descriptionP.textContent = assetData.assetDescription;
        detailsDiv.appendChild(descriptionP);
    }

    drawerBody.appendChild(detailsDiv);
    contentDiv.appendChild(drawerBody);

    // 3. Footer (Sticky Action)
    if (assetData.assetDownloadLink) {
        const drawerFooter = document.createElement('div');
        drawerFooter.className = 'asset-drawer-footer';

        const downloadLink = document.createElement('a');
        downloadLink.className = 'download-asset-btn';
        downloadLink.href = assetData.assetDownloadLink;
        downloadLink.innerHTML = `<span class="material-symbols-sharp">download</span> Download Asset`;
        const filename = assetData.assetDownloadLink.substring(assetData.assetDownloadLink.lastIndexOf('/') + 1);
        downloadLink.setAttribute('download', filename || 'asset');
        drawerFooter.appendChild(downloadLink);

        contentDiv.appendChild(drawerFooter);
    }

    overlayDiv.appendChild(contentDiv);
    document.body.appendChild(overlayDiv);
    currentAssetOverlay = overlayDiv;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        overlayDiv.classList.add('show');
    });

    document.addEventListener('keydown', handleEscapeKeyForOverlay);
}


/**
 * Toggle the bookmark status for a tutorial and update the button UI.
 * @param {HTMLElement} buttonElement - The bookmark button element.
 * @param {string} tutorialId - The tutorial's unique identifier.
 */
function bookmarkById(buttonElement, tutorialId) {
    if (!buttonElement || !tutorialId) return;

    const isNowBookmarked = toggleBookmark(tutorialId, 'Tutorial');

    if (isNowBookmarked) {
        buttonElement.innerHTML = svgs.bookmarkFilled;
        buttonElement.classList.add('bookmarked');
        buttonElement.title = 'Remove Bookmark';
    } else {
        buttonElement.innerHTML = svgs.bookmarkDefault;
        buttonElement.classList.remove('bookmarked');
        buttonElement.title = 'Bookmark this Tutorial';
    }
}

/**
 * Share a tutorial using the Web Share API or copy to clipboard with toast.
 * @param {string} tutorialId - The tutorial's unique identifier.
 */
function shareById(tutorialId) {
    if (!tutorialId) return;

    const tutorialData = tutorialsData.find(item => item.id === tutorialId);

    if (!tutorialData) {
        console.error(`Share failed: Tutorial with ID "${tutorialId}" not found.`);
        showSandModToast("Could not find tutorial data to share.", "error");
        return;
    }

    const shareURL = tutorialData.tutorialLink || window.location.href;
    const shareTitle = tutorialData.videoTitle;
    const shareText = `Check out this tutorial: ${shareTitle} by ${tutorialData.authorName}`;

    if (navigator.share) {
        navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareURL,
        }).catch(error => console.log('Error sharing:', error));
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareURL).then(() => {
            showSandModToast('Tutorial link copied to clipboard!', 'success');
        }).catch(() => {
            showSandModToast(`Share link: ${shareURL}`, 'info');
        });
    } else {
        showSandModToast(`Share link: ${shareURL}`, 'info');
    }
}

// Attach event listeners for tutorial page bookmark/share buttons
document.addEventListener('DOMContentLoaded', () => {
    const bookmarkButton = document.getElementById('bookMarkPage_y');
    const shareButton = document.getElementById('sharepage_y');

    if (bookmarkButton) {
        const tutorialId = bookmarkButton.getAttribute('data-id');
        if (tutorialId) {
            // Set initial bookmark button state
            if (isItemBookmarked(tutorialId, 'Tutorial')) {
                bookmarkButton.innerHTML = svgs.bookmarkFilled;
                bookmarkButton.classList.add('bookmarked');
                bookmarkButton.title = 'Remove Bookmark';
            } else {
                bookmarkButton.innerHTML = svgs.bookmarkDefault;
                bookmarkButton.title = 'Bookmark this Tutorial';
            }
            bookmarkButton.addEventListener('click', () => {
                bookmarkById(bookmarkButton, tutorialId);
            });
        }
    }

    if (shareButton) {
        const tutorialId = shareButton.getAttribute('data-id');
        if (tutorialId) {
            shareButton.addEventListener('click', () => {
                shareById(tutorialId);
            });
        }
    }
});



