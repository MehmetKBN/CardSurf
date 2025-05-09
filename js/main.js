class CardGame {
    constructor() {
        this.currentCardIndex = 0;
        this.cardElement = document.getElementById('current-card');
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.hasMoved = false;
        this.cardData = [];

        this.loadCardData();  // Veriyi yüklemek için yeni bir metod ekliyoruz
        this.setupEventListeners();
    }

    // JSON verisini yükle
    loadCardData() {
        fetch('data/cardData.json')  // Veriyi JSON dosyasından al
            .then(response => response.json())
            .then(data => {
                this.cardData = data;  // Kart verisini yükle
                this.initializeCard();  // Kartı başlat
            })
            .catch(error => {
                console.error('Veri yüklenirken hata oluştu:', error);
            });
    }

    initializeCard() {
        if (this.cardData.length > 0) {
            const cardData = this.getCurrentCardData();
            this.updateCardContent(cardData);
        }
    }

    getCurrentCardData() {
        return this.cardData[this.currentCardIndex % this.cardData.length];
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
    
        // Kartın hareket edip etmediğini kontrol et
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

// DOM tamamen yüklendiğinde oyunu başlat
document.addEventListener('DOMContentLoaded', () => {
    new CardGame();
});
