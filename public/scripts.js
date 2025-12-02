import { Backend } from './server.js';

// DOM Elements
const folderTreeContainer = document.getElementById('folder-tree');
const fileListContainer = document.getElementById('file-list');
const viewerContainer = document.getElementById('viewer-container');
const contentFrame = document.getElementById('content-frame');
const contentImage = document.getElementById('content-image');
const emptyState = document.querySelector('.empty-state');
const activeFileName = document.getElementById('active-file-name');
const headerTitle = document.getElementById('header-title');
const themeToggleBtn = document.getElementById('theme-toggle');

// Search Elements
const folderSearchInput = document.getElementById('folder-search');
const folderSearchResults = document.getElementById('folder-search-results');
const fileSearchInput = document.getElementById('file-search');
const fileSearchResults = document.getElementById('file-search-results');

// Mobile Sidebar Elements
const leftSidebar = document.getElementById('sidebar-left');
const rightSidebar = document.getElementById('sidebar-right');
const openLeftSidebarBtn = document.getElementById('open-left-sidebar');
const closeLeftSidebarBtn = document.getElementById('close-left-sidebar');
const openRightSidebarBtn = document.getElementById('open-right-sidebar');

const closeRightSidebarBtn = document.getElementById('close-right-sidebar');

// Mobile Sidebar Event Listeners
if (openLeftSidebarBtn) openLeftSidebarBtn.addEventListener('click', () => leftSidebar.classList.add('open'));
if (closeLeftSidebarBtn) closeLeftSidebarBtn.addEventListener('click', () => leftSidebar.classList.remove('open'));
if (openRightSidebarBtn) openRightSidebarBtn.addEventListener('click', () => rightSidebar.classList.add('open'));
if (closeRightSidebarBtn) closeRightSidebarBtn.addEventListener('click', () => rightSidebar.classList.remove('open'));

// Share Modal Elements
const shareModal = document.getElementById('share-modal');
const closeShareModalBtn = document.getElementById('close-share-modal');
const shareLinkInput = document.getElementById('share-link-input');
const copyLinkBtn = document.getElementById('copy-link-btn');
const shareWhatsapp = document.getElementById('share-whatsapp');
const shareTelegram = document.getElementById('share-telegram');
const shareEmail = document.getElementById('share-email');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');

// State
let currentTheme = 'dark';

let activeFolderId = null;
let activeFile = null;

// Initialization
async function init() {
    // Theme Init
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    // Load Root Folder
    folderTreeContainer.innerHTML = '<div class="loading-msg">Loading Drive...</div>';

    const rootFolder = await Backend.getRootFolder();
    folderTreeContainer.innerHTML = ''; // Clear loading

    if (rootFolder.error) {
        folderTreeContainer.innerHTML = '<div class="error-msg">Failed to load. Check API Key/CORS.</div>';
        return;
    }

    // Render Root
    renderFolderNode(rootFolder, folderTreeContainer, 0);

    // Auto-expand root
    toggleFolder(rootFolder.id, rootFolder);
}

// Theme Handling
function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

themeToggleBtn.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Render a Single Folder Node
function renderFolderNode(node, container, level) {
    const folderItem = document.createElement('div');
    folderItem.className = 'tree-item';
    folderItem.dataset.id = node.id;
    folderItem.dataset.level = level;
    folderItem.style.paddingLeft = `${20 + (level * 15)}px`;

    // Dropdown arrow + Folder Icon + Name
    folderItem.innerHTML = `
        <i class="fa-solid fa-chevron-right dropdown-arrow"></i>
        <i class="fa-solid fa-folder"></i>
        <span>${node.name}</span>
    `;

    folderItem.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFolder(node.id, node);
    });

    container.appendChild(folderItem);

    // Container for children
    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'tree-group';
    childrenContainer.id = `group-${node.id}`;
    container.appendChild(childrenContainer);

    node.domChildrenContainer = childrenContainer;
}

// Toggle Folder & Load Children
async function toggleFolder(folderId, folderNode) {
    const activeEl = document.querySelector(`.tree-item[data-id="${folderId}"]`);
    const group = document.getElementById(`group-${folderId}`);
    const arrow = activeEl ? activeEl.querySelector('.dropdown-arrow') : null;

    // Update Active State (Selection)
    document.querySelectorAll('.tree-item').forEach(el => el.classList.remove('active'));
    if (activeEl) activeEl.classList.add('active');
    activeFolderId = folderId;

    // Toggle Expansion
    if (folderNode.loaded) {
        // Already loaded, just toggle visibility
        if (group) group.classList.toggle('expanded');
        if (arrow) arrow.classList.toggle('rotated');
    } else {
        // Not loaded, fetch data
        // Show loading state (maybe spin the arrow?)
        if (arrow) {
            arrow.classList.remove('fa-chevron-right');
            arrow.classList.add('fa-circle-notch', 'fa-spin');
        }

        const contents = await Backend.getFolderContents(folderId);

        // Restore arrow
        if (arrow) {
            arrow.classList.remove('fa-circle-notch', 'fa-spin');
            arrow.classList.add('fa-chevron-right', 'rotated'); // Expanded state
        }

        folderNode.children = contents.folders;
        folderNode.files = contents.files;
        folderNode.loaded = true;

        // Render Children
        if (group) {
            group.innerHTML = '';
            group.classList.add('expanded');

            const parentLevel = parseInt(activeEl.dataset.level || 0);
            folderNode.children.forEach(child => {
                renderFolderNode(child, group, parentLevel + 1);
                collectAllFolders(child, allFolders, folderNode);
            });
        }
    }

    // Always render files for the selected folder
    currentFiles = folderNode.files || [];
    renderFileList(folderNode.files);
    fileSearchInput.value = '';
    fileSearchResults.classList.remove('active');
    fileSearchResults.innerHTML = '';
    fileListContainer.querySelectorAll('.file-item').forEach(item => item.classList.remove('hidden'));

    // Mobile Logic - Open right sidebar if folder has files
    if (window.innerWidth <= 768 && folderNode.files && folderNode.files.length > 0) {
        leftSidebar.classList.remove('open');
        rightSidebar.classList.add('open');
    }
}

// Redefine init to be safe
async function safeInit() {
    console.log('safeInit started');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    folderTreeContainer.innerHTML = '<div class="loading-msg" style="padding:20px; text-align:center;">Loading Drive...</div>';

    console.log('Fetching root folder...');
    const rootFolder = await Backend.getRootFolder();
    console.log('Root folder fetched:', rootFolder);

    folderTreeContainer.innerHTML = '';

    if (rootFolder.error) {
        console.error('Root folder error:', rootFolder);
        folderTreeContainer.innerHTML = '<div class="error-msg" style="padding:20px; color:red;">Failed to load. <br>Check Console for API errors.</div>';
        return;
    }

    console.log('Rendering root folder...');
    renderFolderNode(rootFolder, folderTreeContainer, 0);
    
    allFolders = collectAllFolders(rootFolder);
    console.log('Collected folders:', allFolders);

    // Auto-expand root? Maybe just select it.
    // toggleFolder(rootFolder.id, rootFolder); 
    // If we auto-expand, it might trigger the fetch immediately. 
    // Let's just select it and expand it.
    console.log('Root folder rendered. Toggling...');
    toggleFolder(rootFolder.id, rootFolder);
}

// Render File List in Right Sidebar
function renderFileList(files) {
    fileListContainer.innerHTML = '';

    if (!files || files.length === 0) {
        fileListContainer.innerHTML = '<li class="empty-list-msg">No files in this folder</li>';
        return;
    }

    files.forEach(file => {
        const li = document.createElement('li');
        li.className = 'file-item';
        li.innerHTML = `
            <i class="fa-regular ${getFileIcon(file.type)}"></i>
            <span class="file-name">${file.name}</span>
        `;
        li.addEventListener('click', () => {
            fileListContainer.querySelectorAll('.file-item').forEach(item => item.classList.remove('active'));
            li.classList.add('active');
            previewFile(file);
        });
        fileListContainer.appendChild(li);
    });
}

// Store all folders for search functionality
let allFolders = [];
let folderHierarchy = {};

function collectAllFolders(node, folders = [], parent = null) {
    if (node) {
        folders.push(node);
        if (parent) {
            folderHierarchy[node.id] = parent;
        }
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => collectAllFolders(child, folders, node));
        }
    }
    return folders;
}

// Expand parent folders to show folder in hierarchy
function expandParentFolders(folderId) {
    let currentId = folderId;
    const toExpand = [];
    
    while (folderHierarchy[currentId]) {
        const parentId = folderHierarchy[currentId].id;
        toExpand.push(parentId);
        currentId = parentId;
    }
    
    toExpand.forEach(parentId => {
        const parentEl = document.querySelector(`.tree-item[data-id="${parentId}"]`);
        const group = document.getElementById(`group-${parentId}`);
        const arrow = parentEl ? parentEl.querySelector('.dropdown-arrow') : null;
        
        if (group && !group.classList.contains('expanded')) {
            group.classList.add('expanded');
            if (arrow) {
                arrow.classList.add('rotated');
            }
        }
    });
}

// Search Folders
folderSearchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        folderSearchResults.classList.remove('active');
        folderSearchResults.innerHTML = '';
        return;
    }

    const results = allFolders.filter(folder => 
        folder.name.toLowerCase().includes(searchTerm)
    );

    displayFolderSearchResults(results, searchTerm);
});

function displayFolderSearchResults(results, searchTerm) {
    folderSearchResults.innerHTML = '';
    
    if (results.length === 0) {
        folderSearchResults.innerHTML = '<div class="empty-msg">No folders found</div>';
        folderSearchResults.classList.add('active');
        return;
    }

    folderSearchResults.classList.add('active');
    results.forEach(folder => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item folder-result';
        resultItem.innerHTML = `
            <i class="fa-solid fa-folder"></i>
            <span>${folder.name}</span>
        `;
        resultItem.addEventListener('click', () => {
            folderSearchInput.value = '';
            folderSearchResults.classList.remove('active');
            folderSearchResults.innerHTML = '';
            expandParentFolders(folder.id);
            toggleFolder(folder.id, folder);
        });
        folderSearchResults.appendChild(resultItem);
    });
}

// Store current files for search
let currentFiles = [];

// Search Files - Filter existing list
fileSearchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const fileItems = fileListContainer.querySelectorAll('.file-item');
    
    if (!searchTerm) {
        fileItems.forEach(item => item.classList.remove('hidden'));
        fileSearchResults.classList.remove('active');
        fileSearchResults.innerHTML = '';
        return;
    }

    let visibleCount = 0;
    fileItems.forEach(item => {
        const fileName = item.querySelector('.file-name').textContent.toLowerCase();
        if (fileName.includes(searchTerm)) {
            item.classList.remove('hidden');
            visibleCount++;
        } else {
            item.classList.add('hidden');
        }
    });

    if (visibleCount === 0) {
        fileSearchResults.classList.add('active');
        fileSearchResults.innerHTML = '<div class="empty-msg">No files found</div>';
    } else {
        fileSearchResults.classList.remove('active');
        fileSearchResults.innerHTML = '';
    }
});

// Get Icon based on file type
function getFileIcon(type) {
    switch (type) {
        case 'image': return 'fa-image';
        case 'pdf': return 'fa-file-pdf';
        case 'video': return 'fa-file-video';
        default: return 'fa-file';
    }
}

// Preview File
function previewFile(file) {
    activeFile = file;
    activeFileName.textContent = file.name;

    // Reset views
    contentFrame.classList.add('hidden');
    contentImage.classList.add('hidden');
    emptyState.classList.add('hidden');

    if (file.type === 'image') {
        contentImage.src = file.preview || file.url; // Use thumbnail or direct link
        contentImage.classList.remove('hidden');
    } else if (file.type === 'pdf' || file.type === 'video') {
        contentFrame.src = file.url;
        contentFrame.classList.remove('hidden');
    } else {
        // Fallback for other types (try iframe)
        contentFrame.src = file.url;
        contentFrame.classList.remove('hidden');
    }

    // Mobile: Close right sidebar to show content
    if (window.innerWidth <= 768) {
        rightSidebar.classList.remove('open');
        leftSidebar.classList.remove('open');
    }
}

// Download Button Logic
downloadBtn.addEventListener('click', () => {
    if (!activeFile) {
        alert('Please select a file first.');
        return;
    }
    if (activeFile.downloadUrl) {
        window.open(activeFile.downloadUrl, '_blank');
    } else {
        alert('Download link not available for this file.');
    }
});

// Share Button Logic
shareBtn.addEventListener('click', () => {
    if (!activeFile) {
        alert('Please select a file first.');
        return;
    }
    openShareModal();
});

// Share Modal Functions
function openShareModal() {
    const link = activeFile.shareUrl || activeFile.url;
    shareLinkInput.value = link;

    // Setup Social Links
    const text = `Check out this file: ${activeFile.name}`;
    const encodedText = encodeURIComponent(text);
    const encodedLink = encodeURIComponent(link);

    shareWhatsapp.href = `https://wa.me/?text=${encodedText}%20${encodedLink}`;
    shareTelegram.href = `https://t.me/share/url?url=${encodedLink}&text=${encodedText}`;
    shareEmail.href = `mailto:?subject=${encodedText}&body=${encodedLink}`;

    shareModal.classList.remove('hidden');
}

closeShareModalBtn.addEventListener('click', () => {
    shareModal.classList.add('hidden');
});

shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
        shareModal.classList.add('hidden');
    }
});

copyLinkBtn.addEventListener('click', () => {
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(shareLinkInput.value).then(() => {
        const originalText = copyLinkBtn.innerHTML;
        copyLinkBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
            copyLinkBtn.innerHTML = originalText;
        }, 2000);
    });
});

document.addEventListener('DOMContentLoaded', safeInit);
