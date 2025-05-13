class CardGame {

    stats = {
        treasury: 5,
        welfare: 5,
        army: 5,
        faith: 5,
        diplomacy: 5
    };
    
    updateStatsDisplay() {
        document.getElementById("stat-treasury").textContent = this.stats.treasury;
        document.getElementById("stat-welfare").textContent = this.stats.welfare;
        document.getElementById("stat-army").textContent = this.stats.army;
        document.getElementById("stat-faith").textContent = this.stats.faith;
        document.getElementById("stat-diplomacy").textContent = this.stats.diplomacy;
    }

    
    
    applyEffects(effects) {
        for (let key in effects) {
            if (this.stats.hasOwnProperty(key)) {
                this.stats[key] += effects[key];
            }
        }
        this.updateStatsDisplay();
    }
    

    constructor() {
        this.currentCardIndex = 0;
        this.cardElement = document.getElementById('current-card');
        this.cardContainerElement = document.getElementById('card-container');
        this.reqsContainerElement = document.getElementById('requirements');
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.hasMoved = false;
        this.cardData = [];

        this.loadCardData();  // Veriyi yüklemek için yeni bir metod ekliyoruz
        this.setupEventListeners();
        this.updateStatsDisplay();
        console.log(this.stats);
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

    writeStatsToConsole(data) {
        console.log("Pozitif Gereklilikler:");
        for (let key in data.positive.requirements) {
            console.log(`${key}: ${data.positive.requirements[key]}`);
        }
        console.log("Pozitif Efektler:");
        for (let key in data.positive.effects) {
            console.log(`${key}: ${data.positive.effects[key]}`);
        }

        console.log("Negatif Gereklilikler:");
        for (let key in data.negative.requirements) {
            console.log(`${key}: ${data.negative.requirements[key]}`);
        }
        console.log("Negatif Efektler:");
        for (let key in data.negative.effects) {
            console.log(`${key}: ${data.negative.effects[key]}`);
        }
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
        this.writeStatsToConsole(data);
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

        if (this.currentX > 120) {
            this.cardContainerElement.style.backgroundColor = '#6FCF97';
            this.showVisualEffects("positive");
            this.writeRequirements("positive");
        }
        else if (this.currentX < -120) {
            this.cardContainerElement.style.backgroundColor = '#EB5757';
            this.showVisualEffects("negative");
            this.writeRequirements("negative");
        }
        else {
            this.cardContainerElement.style.backgroundColor = 'transparent';
            this.updateStatsDisplay();
            
            if (this.currentX > 0) {
                this.writeRequirements("positive");
            } else if (this.currentX < 0) {
                this.writeRequirements("negative");
            } else {
                this.writeRequirements("clear");
            }
        }

    }

    showVisualEffects(direction) {
        const currentCard = this.getCurrentCardData();
        const effects = direction === "positive" ? currentCard.positive.effects : currentCard.negative.effects;

        // Her stat için geçici efektleri göster
        for (const stat in effects) {
            const effectValue = effects[stat];
            const statElement = document.getElementById(`stat-${stat}`);

            if (statElement) {
                // Geçici etiketi zaten varsa önce temizle
                let preview = statElement.querySelector('.preview-effect');
                if (preview) {
                    preview.remove();
                }

                // Yeni geçici etkiyi oluştur
                preview = document.createElement('span');
                preview.classList.add('preview-effect');
                preview.textContent = (effectValue > 0 ? ` +${effectValue}` : ` ${effectValue}`);
                preview.style.color = effectValue > 0 ? '#6FCF97' : '#EB5757';
                preview.style.marginLeft = '5px';

                statElement.appendChild(preview);
            }
        }
    }

    writeRequirements(direction) {
        // Önce tüm eski requirement'ları temizle
        this.reqsContainerElement.querySelectorAll('.req-element').forEach(el => el.remove());
        const currentCard = this.getCurrentCardData();
        const requirements = direction === "positive" ? currentCard.positive.requirements : currentCard.negative.requirements;

        // Eğer hiç gereklilik yoksa direkt çık
        if (Object.keys(requirements).length === 0 || direction != "positive" && direction != "negative"  ) return;

        // Gereklilikleri yaz
        for (const req in requirements) {
            const reqValue = requirements[req];

            const preview = document.createElement('span');
            preview.classList.add('req-element');
            preview.textContent = `${req.charAt(0).toUpperCase() + req.slice(1)}: ${reqValue}`;
            preview.style.display = 'block'; 
            this.reqsContainerElement.appendChild(preview);
        }
    }
    
    


    checkRequirements(requirements) {
        for (let key in requirements) {
            if (this.stats[key] === undefined || this.stats[key] < requirements[key]) {
                return false;
            }
        }
        return true;
    }    

    handleDragEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.cardElement.style.transition = 'transform 0.3s ease';
    
        if (this.hasMoved && Math.abs(this.currentX) > 120) {
            const direction = this.currentX > 0 ? 'right' : 'left';
    
            const currentScene = this.getCurrentCardData();
            const action = currentScene[direction === 'right' ? "positive" : "negative"];
            
            if (this.checkRequirements(action.requirements)) {
                this.swipeCard(direction);
            } else {
                console.log("Yeterli kaynağın yok, bu yöne kaydıramazsın.");
                this.cardElement.style.transform = 'none';
                this.cardContainerElement.style.backgroundColor = 'transparent';
                this.writeRequirements("clear");
            }
        } else {
            this.cardElement.style.transform = 'none';

        }
    }
    
    
    handleDragCancel() {
        this.isDragging = false;
        this.cardElement.style.transform = 'none';
        this.cardElement.style.transition = 'transform 0.3s ease';
        this.cardContainerElement.style.backgroundColor = 'transparent';
        this.updateStatsDisplay();
        this.writeRequirements("clear");
    }

    swipeCard(direction) {
        const currentScene = this.getCurrentCardData();

        const effect = direction === 'right' ? currentScene.positive.effects : currentScene.negative.effects;
        this.applyEffects(effect);
        this.cardContainerElement.style.backgroundColor = 'transparent';

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
