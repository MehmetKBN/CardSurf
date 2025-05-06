// Card content data
const cardData = [
    { emoji: '🌟', name: 'Star Card', text: 'Swipe to see what happens!' },
    { emoji: '🎮', name: 'Game Card', text: 'Having fun?' },
    { emoji: '🎨', name: 'Art Card', text: 'Express yourself!' },
    { emoji: '💋', name: 'Hot Card', text: 'Catch It!' },
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
        this.cardElement.querySelector('.emoji').textContent = data.emoji;
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