// =====================
// Constants & Data
// =====================

const TUTORIAL_BOOKMARKS_KEY = 'sandmodBookmarkedTutorials';
const ASSET_BOOKMARKS_KEY = 'sandmodBookmarkedAssets';
const BOOKMARKS_STORAGE_KEY = 'sandmodBookmarkedItems';

const svgs = {
    bookIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-icon lucide-book"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>`,
    packageIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package-icon lucide-package"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/></svg>`,
    notebookIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clapperboard-icon lucide-clapperboard"><path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>`,
    fileTextIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-notebook-icon lucide-notebook"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M16 2v20"/></svg>`,
    bookmarkDefault: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark-icon lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
    bookmarkFilled: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark-check-icon lucide-bookmark-check"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/><path d="m9 10 2 2 4-4"/></svg>`,
    share: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share2-icon lucide-share-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`,
    asset3DIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-box-icon lucide-box"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
    assetPackageIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-archive-icon lucide-folder-archive"><circle cx="15" cy="19" r="2"/><path d="M20.9 19.8A2 2 0 0 0 22 18V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5.1"/><path d="M15 11v-1"/><path d="M15 17v-2"/></svg>`
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
        videoTitle: "Step-by-Step Guide to Creating a Multiplayer Chat System",
        authorName: "Chilaxe",
        authorPfpSrc: "./assets/Untitled-1.png",
        type1: "Tutorial",
        type2: "Text",
        tutorialLink: "./tutorials/10288.html",
        assetDownloadLink: null, assetType: null, asset3DModel: null, assetPackage: null
    }
];

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

    // Header
    const header = document.createElement('header');
    header.className = 'sandmod-tutorial-header';

    // Main Icon
    const tutorialIco = document.createElement('div');
    tutorialIco.className = 'tutorial-ico';
    const mainIconSpan = document.createElement('span');
    if (itemData.type1 === "Tutorial") {
        mainIconSpan.innerHTML = svgs.bookIcon;
    } else if (itemData.type1 === "Asset") {
        mainIconSpan.innerHTML = svgs.packageIcon;
    } else {
        mainIconSpan.innerHTML = svgs.bookIcon;
    }
    tutorialIco.appendChild(mainIconSpan);

    // Type Icon (Only for Tutorials with type2)
    const tutorialTypeContainer = document.createElement('div');
    tutorialTypeContainer.className = 'tutorial-type';
    if (itemData.type1 === "Tutorial" && itemData.type2) {
        const type1Div = document.createElement('div');
        type1Div.className = 'type-1';
        const type1IconSpan = document.createElement('span');
        if (itemData.type2 === "Video") {
            type1IconSpan.innerHTML = svgs.notebookIcon;
        } else if (itemData.type2 === "Text") {
            type1IconSpan.innerHTML = svgs.fileTextIcon;
        }
        if (type1IconSpan.innerHTML) {
            type1Div.appendChild(type1IconSpan);
            tutorialTypeContainer.appendChild(type1Div);
        }
    }

    header.appendChild(tutorialIco);
    header.appendChild(tutorialTypeContainer);

    // Main Content
    const mainContent = document.createElement('div');
    mainContent.className = 'tutorial-maincontent';

    // Credits
    const tutorialCredits = document.createElement('div');
    tutorialCredits.className = 'tutorial-credits';
    const creditPfpDiv = document.createElement('div');
    creditPfpDiv.className = 'tutorial-credit-pfp';
    const pfpImg = document.createElement('img');
    pfpImg.src = itemData.authorPfpSrc;
    pfpImg.alt = `${itemData.authorName} profile picture`;
    pfpImg.className = 'tutorial-credit-pfp-img';
    const pfNameSpan = document.createElement('span');
    pfNameSpan.className = 'tutorial-credit-pf-name';
    pfNameSpan.textContent = itemData.authorName;
    creditPfpDiv.appendChild(pfpImg);
    creditPfpDiv.appendChild(pfNameSpan);

    // Tools (Bookmark & Share)
    const toolsTutorial = document.createElement('div');
    toolsTutorial.className = 'tools-tutorial';

    // Bookmark Button
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

    // Share Button
    const shareButton = document.createElement('button');
    shareButton.className = 'sandmod-tutorial-tools-btn';
    shareButton.title = 'Share';
    const shareIconSpan = document.createElement('span');
    shareIconSpan.innerHTML = svgs.share;
    shareButton.appendChild(shareIconSpan);
    shareButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const shareURL = itemData.type1 === "Asset" ? (itemData.assetDownloadLink || window.location.href) : (itemData.tutorialLink || window.location.href);
        if (navigator.share) {
            navigator.share({
                title: itemData.videoTitle,
                text: `Check out: ${itemData.videoTitle} by ${itemData.authorName}`,
                url: shareURL,
            }).catch(error => console.log('Error sharing:', error));
        } else {
            prompt("Copy link:", shareURL);
        }
    });

    toolsTutorial.appendChild(bookmarkButton);
    toolsTutorial.appendChild(shareButton);
    tutorialCredits.appendChild(creditPfpDiv);
    tutorialCredits.appendChild(toolsTutorial);

    // Title
    const tutorialTitleDiv = document.createElement('div');
    tutorialTitleDiv.className = 'tutorial-title';
    const titleLink = document.createElement('a');
    titleLink.href = itemData.type1 === "Asset" ? (itemData.assetDownloadLink || '#asset-details') : (itemData.tutorialLink || '#');
    titleLink.textContent = itemData.videoTitle;
    titleLink.className = 'tutorial-title';
    titleLink.rel = "noopener noreferrer";
    titleLink.style.textDecoration = 'none';
    tutorialTitleDiv.appendChild(titleLink);

    mainContent.appendChild(tutorialTitleDiv);
    mainContent.appendChild(tutorialCredits);

    cardElement.appendChild(header);
    cardElement.appendChild(mainContent);

    return cardElement;
}

function createAssetCard(itemData) {
    const cardElement = document.createElement('div');
    cardElement.className = 'sandmod-asset-item';
    cardElement.dataset.itemId = itemData.id;
    cardElement.dataset.assetType = itemData.assetType;

    cardElement.addEventListener('click', (event) => {
        // This check prevents the overlay from opening if a button or link inside the card was the click target
        if (event.target.closest('button, a')) {
            return;
        }
        // If the click was on the card itself, show the details
        createAndShowAssetDetailOverlay(itemData);
    });

    // Header
    const header = document.createElement('header');
    header.className = 'sandmod-asset-header';
    const assetTypeDiv = document.createElement('div');
    assetTypeDiv.className = 'sandmod-asset-type';

    const typeIconSpan = document.createElement('span');
    typeIconSpan.className = 'sandmod-asset-type-icon';
    typeIconSpan.innerHTML = svgs.packageIcon;
    assetTypeDiv.appendChild(typeIconSpan);

    const type2IconSpan = document.createElement('span');
    type2IconSpan.className = 'sandmod-asset-type-2';
    if (itemData.assetType === '3D') {
        type2IconSpan.innerHTML = svgs.asset3DIcon;
    } else if (itemData.assetType === 'Package') {
        type2IconSpan.innerHTML = svgs.assetPackageIcon;
    }
    if (type2IconSpan.innerHTML) {
        assetTypeDiv.appendChild(type2IconSpan);
    }
    header.appendChild(assetTypeDiv);
    cardElement.appendChild(header);

    // Preview Area
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

    // Asset Info (Title)
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

    // Credits & Tools
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

    // Bookmark Button for Asset
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

    // Share Button for Asset
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
        } else {
            prompt("Copy link to asset:", shareURL);
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
// Main DOMContentLoaded Logic
// =====================

document.addEventListener('DOMContentLoaded', () => {
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
            const currentDisplay = getComputedStyle(filterAreaElement).display;
            filterAreaElement.style.display = (currentDisplay === "flex" || currentDisplay === "block") ? "none" : "flex";
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
        const arrowSvg = toggleBtn.querySelector('.sandmod-sidebar-tool-btn-arrow-icon svg');
        const isInitiallyOpen = getComputedStyle(toolsContainer).display === 'block';
        if (arrowSvg) {
            arrowSvg.innerHTML = isInitiallyOpen ? '<path d="m18 15-6-6-6 6"/>' : '<path d="m6 9 6 6 6-6"/>';
        }

        toggleBtn.addEventListener('click', () => {
            const isOpen = getComputedStyle(toolsContainer).display === 'block';
            toolsContainer.style.display = isOpen ? 'none' : 'block';
            if (arrowSvg) {
                arrowSvg.innerHTML = isOpen
                    ? '<path d="m6 9 6 6 6-6"/>' // Arrow down
                    : '<path d="m18 15-6-6-6 6"/>'; // Arrow up
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
        // Start the fade-out animation
        currentAssetOverlay.classList.remove('visible');
        
        // Remove the element from the DOM after the transition ends
        setTimeout(() => {
            if (currentAssetOverlay && currentAssetOverlay.parentNode) {
                currentAssetOverlay.parentNode.removeChild(currentAssetOverlay);
            }
            currentAssetOverlay = null;
            document.body.style.overflow = ''; // Restore background scrolling
        }, 300); // This duration MUST match your CSS transition duration
    }
    // Clean up the keydown listener when the overlay is closed
    document.removeEventListener('keydown', handleEscapeKeyForOverlay);
}

/**
 * Handles the 'Escape' key press to close the overlay.
 * @param {KeyboardEvent} event The keyboard event.
 */
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
    // If for some reason this is called with no data, do nothing.
    if (!assetData) {
        console.error("No asset data provided to create overlay.");
        return;
    }
    // If an overlay is already open, close it first
    if (currentAssetOverlay) {
        hideAndRemoveAssetDetailOverlay();
    }

    // --- Start Building the Overlay ---

    // 1. Create the main overlay wrapper (the dark background)
    const overlayDiv = document.createElement('div');
    overlayDiv.className = 'overlay-window-asset';
    // Add event listener to close when the dark background is clicked
    overlayDiv.addEventListener('click', (e) => {
        if (e.target === overlayDiv) { // Ensure the click is on the backdrop itself
            hideAndRemoveAssetDetailOverlay();
        }
    });

    // 2. Create the content box
    const contentDiv = document.createElement('div');
    contentDiv.className = 'overlay-window-asset-content';

    // 3. Create the close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-overlay-btn';
    closeButton.title = 'Close';
    closeButton.innerHTML = `<span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span>`;
    closeButton.addEventListener('click', hideAndRemoveAssetDetailOverlay);
    contentDiv.appendChild(closeButton);

    // 4. Create the preview area (for model-viewer or image)
    const previewArea = document.createElement('div');
    previewArea.className = 'asset-perview';

    // Conditionally create <model-viewer> or <img>
    if (assetData.assetType === "3D" && assetData.assetModelSrc) {
        const modelViewer = document.createElement('model-viewer');
        modelViewer.className = 'asset-model-viewer';
        modelViewer.src = assetData.assetModelSrc;
        modelViewer.alt = assetData.videoTitle || "3D Model Preview";
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('shadow-intensity', '1');
        modelViewer.className = 'asset-perview';
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
    contentDiv.appendChild(previewArea);

    // 5. Create the details section
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'asset-details';

    const titleH2 = document.createElement('h2');
    titleH2.className = 'asset-title';
    titleH2.textContent = assetData.videoTitle || 'Asset Details';
    detailsDiv.appendChild(titleH2);

    const descriptionP = document.createElement('p');
    descriptionP.className = 'asset-description';
    descriptionP.textContent = assetData.assetDescription || 'No description provided.';
    detailsDiv.appendChild(descriptionP);

    // 6. Create the actions section (download button)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'asset-actions';
    if (assetData.assetDownloadLink) {
        const downloadLink = document.createElement('a');
        downloadLink.className = 'download-asset-btn';
        downloadLink.href = assetData.assetDownloadLink;
        downloadLink.textContent = `Download`;
        const filename = assetData.assetDownloadLink.substring(assetData.assetDownloadLink.lastIndexOf('/') + 1);
        downloadLink.setAttribute('download', filename || 'asset');
        actionsDiv.appendChild(downloadLink);
    }
    detailsDiv.appendChild(actionsDiv);
    contentDiv.appendChild(detailsDiv);

    // --- Final Assembly and Display ---

    // Put the content box inside the overlay wrapper
    overlayDiv.appendChild(contentDiv);

    // Add the completed overlay to the page
    document.body.appendChild(overlayDiv);
    
    // Store a reference to it so we can remove it later
    currentAssetOverlay = overlayDiv;

    // Prevent the main page from scrolling while the overlay is open
    document.body.style.overflow = 'hidden';

    // Use requestAnimationFrame to ensure the element is in the DOM before adding the 'visible' class,
    // which triggers the CSS fade-in transition.
    requestAnimationFrame(() => {
        overlayDiv.classList.add('visible');
    });

    // Add listener for the Escape key
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
 * Share a tutorial using the Web Share API or fallback prompt.
 * @param {string} tutorialId - The tutorial's unique identifier.
 */
function shareById(tutorialId) {
    if (!tutorialId) return;

    const tutorialData = tutorialsData.find(item => item.id === tutorialId);

    if (!tutorialData) {
        console.error(`Share failed: Tutorial with ID "${tutorialId}" not found.`);
        alert("Could not find tutorial data to share.");
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
    } else {
        prompt("Copy this link to share the tutorial:", shareURL);
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
