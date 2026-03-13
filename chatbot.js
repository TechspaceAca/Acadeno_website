
/**
 * Chatbot Widget Logic
 * Features: Toggle, Draggable, Resizable
 */

document.addEventListener('DOMContentLoaded', () => {
    const launcher = document.getElementById('chatbot-launcher');
    const windowEl = document.getElementById('chatbot-window');
    const header = document.querySelector('.chatbot-header');
    const closeBtn = document.getElementById('chatbot-close');
    const maximizeBtn = document.getElementById('chatbot-maximize');
    const resizer = document.querySelector('.chatbot-resizer');

    // --- Toggle Visibility ---
    launcher.addEventListener('click', () => {
        windowEl.classList.toggle('active');
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        windowEl.classList.remove('active');
    });

    // --- Maximize Logic ---
    maximizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        windowEl.classList.toggle('maximized');
        maximizeBtn.textContent = windowEl.classList.contains('maximized') ? '❐' : '□';
        
        if (windowEl.classList.contains('maximized')) {
            // Reset transforms when maximized to let CSS take over
            windowEl.style.transform = '';
            xOffset = 0;
            yOffset = 0;
            initialX = 0;
            initialY = 0;
        } else {
            // Re-apply scale for standard transition
            windowEl.style.transform = `translate3d(0, 0, 0) scale(1)`;
        }
    });

    // --- Draggable Logic ---
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Touch support
    header.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        if (e.target.closest('.chatbot-header-controls')) return;

        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        isDragging = true;
        windowEl.style.transition = 'none'; // Disable transition during drag
        document.querySelector('.chatbot-content').style.pointerEvents = 'none';
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, windowEl);
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        windowEl.style.transition = 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
        document.querySelector('.chatbot-content').style.pointerEvents = 'all';
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) scale(${el.classList.contains('active') ? 1 : 0.9})`;
    }

    // --- Resizable Logic ---
    let isResizing = false;

    resizer.addEventListener('mousedown', initResize);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);

    function initResize(e) {
        isResizing = true;
        e.preventDefault();
        windowEl.style.transition = 'none';
        document.querySelector('.chatbot-content').style.pointerEvents = 'none';
    }

    function resize(e) {
        if (!isResizing) return;
        
        const rect = windowEl.getBoundingClientRect();
        // Calculate new width/height based on mouse position relative to window top/left
        // Since the window might be translated, we use the rect
        const newWidth = e.clientX - rect.left;
        const newHeight = e.clientY - rect.top;

        if (newWidth > 300) windowEl.style.width = newWidth + 'px';
        if (newHeight > 400) windowEl.style.height = newHeight + 'px';
    }

    function stopResize() {
        isResizing = false;
        windowEl.style.transition = 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
        document.querySelector('.chatbot-content').style.pointerEvents = 'all';
    }

    // Optional: Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && windowEl.classList.contains('active')) {
            windowEl.classList.remove('active');
        }
    });
});
