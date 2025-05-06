// Card content data
const cardData = [
    { image: 'https://images.pexels.com/photos/127723/pexels-photo-127723.jpeg', name: 'Star Card', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent neque elit, dictum id malesuada nec, sagittis sit amet ligula. Aliquam non consectetur odio, non rutrum ipsum. Sed eu massa tincidunt, laoreet orci sed, dictum nulla. Nam erat eros, malesuada at justo ac, semper tristique sem. Vivamus eros dui, pretium ut nisi a, molestie vulputate tortor. Nullam dignissim mattis metus, quis egestas eros. Maecenas a consequat nisi. Phasellus risus lorem, luctus nec lacus ut, iaculis ultricies nam.' },
    { image: '🎮', name: 'Game Card', text: 'Having fun?' },
    { image: '🎨', name: 'Art Card', text: 'Express yourself!' },
    { image: '💋', name: 'Hot Card', text: 'Catch It!' },
    // Add more cards as needed
];

class CardGame {
    constructor() {
        this.currentCardIndex = 0;
        this.cardElement = document.getElementById('current-card');
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.hasMoved = false;


        this.initializeCard();
        this.setupEventListeners();
    }

    initializeCard() {
        const cardData = this.getCurrentCardData();
        this.updateCardContent(cardData);
    }

    getCurrentCardData() {
        return cardData[this.currentCardIndex % cardData.length];
    }

    updateCardContent(data) {
        this.cardElement.querySelector('.image').src = data.image;
        this.cardElement.querySelector('.name').textContent = data.name;
        this.cardElement.querySelector('.text').textContent = data.text;
    }

    setupEventListeners() {
        // Touch events
        this.cardElement.addEventListener('touchstart', (e) => this.handleDragStart(e));
        this.cardElement.addEventListener('touchmove', (e) => this.handleDragMove(e));
        this.cardElement.addEventListener('touchend', () => this.handleDragEnd());

        // Mouse events
        this.cardElement.addEventListener('mousedown', (e) => this.handleDragStart(e));
        this.cardElement.addEventListener('mousemove', (e) => this.handleDragMove(e));
        this.cardElement.addEventListener('mouseup', () => this.handleDragEnd());
        this.cardElement.addEventListener('mouseleave', () => this.handleDragCancel());
        this.cardElement.addEventListener('touchleave', () => this.handleDragCancel());

    }

    handleDragStart(e) {
        this.isDragging = true;
        this.hasMoved = false;
        this.startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        this.cardElement.style.transition = 'none';
    }

    handleDragMove(e) {
        if (!this.isDragging) return;
        this.hasMoved = true;
        e.preventDefault();
        const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const deltaX = currentX - this.startX;
        this.currentX = deltaX;

        this.cardElement.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
    }

    handleDragEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.cardElement.style.transition = 'transform 0.3s ease';
    
        // Check if the card was actually dragged before changing it
        if (this.hasMoved && Math.abs(this.currentX) > 120) {
            const direction = this.currentX > 0 ? 'right' : 'left';
            this.swipeCard(direction);
        } else {
            this.cardElement.style.transform = 'none';
        }        
    }
    
    handleDragCancel() {
        this.isDragging = false;
        this.cardElement.style.transform = 'none';
        this.cardElement.style.transition = 'transform 0.3s ease';
    }

    swipeCard(direction) {
        this.cardElement.classList.add(`swipe-${direction}`);
        
        setTimeout(() => {
            this.currentCardIndex++;
            this.cardElement.classList.remove(`swipe-${direction}`);
            this.cardElement.style.transform = 'none';
            this.updateCardContent(this.getCurrentCardData());
        }, 300);
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CardGame();
});