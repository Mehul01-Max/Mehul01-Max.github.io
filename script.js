function makeDraggable(element) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const startDrag = (e) => {
        isDragging = true;
        // For touch events, use the first touch point
        if (e.type === 'touchstart') {
            offsetX = e.touches[0].clientX - element.getBoundingClientRect().left;
            offsetY = e.touches[0].clientY - element.getBoundingClientRect().top;
        } else { // For mouse events
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
        }
        e.preventDefault(); // Prevent default behavior (important for mobile)
    };

    const drag = (e) => {
        if (isDragging) {
            let mouseX, mouseY;

            // For touch events
            if (e.type === 'touchmove') {
                mouseX = e.touches[0].clientX - offsetX;
                mouseY = e.touches[0].clientY - offsetY;
            } else { // For mouse events
                mouseX = e.clientX - offsetX;
                mouseY = e.clientY - offsetY;
            }

            const canvasWrapper = document.querySelector('#canvasWrapper');
            const wrapperRect = canvasWrapper.getBoundingClientRect();

            // Ensure dragging stays within canvas bounds
            const maxX = canvasWrapper.clientWidth - element.offsetWidth;
            const maxY = canvasWrapper.clientHeight - element.offsetHeight;

            const newX = Math.max(0, Math.min(mouseX, maxX));
            const newY = Math.max(0, Math.min(mouseY, maxY));

            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
        }
    };

    const endDrag = () => {
        isDragging = false;
    };

    // Add mouse event listeners for desktop
    element.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Add touch event listeners for mobile
    element.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);
}
