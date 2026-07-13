
function getCards() {
    try {
        return JSON.parse(localStorage.getItem('flashcards')) || [];
    } catch (e) {
        console.error("Error reading flashcards from storage", e);
        return [];
    }
}

function saveAllCards(cardsArr) {
    localStorage.setItem('flashcards', JSON.stringify(cardsArr));
    window.dispatchEvent(new Event('flashcardsUpdated'));
}

function saveCard(cardData) {
    const cards = getCards();
    if (!cardData.id) {
        cardData.id = 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }
        if (!cardData.deck) cardData.deck = 'all';
    if (cardData.ease === undefined) cardData.ease = 250;
    if (cardData.interval === undefined) cardData.interval = 0;
    if (cardData.rerepetitions === undefined) cardData.rerepetitions = 0;
    if (!cardData.dueDate) cardData.dueDate = Date.now();
    if (!cardData.state) cardData.state = 'new'; 

    const existingIndex = cards.findIndex(c => c.id === cardData.id);

    if (existingIndex !== -1) {
        cards[existingIndex] = { ...cards[existingIndex], ...cardData };
    } else {
        cards.push(cardData);
    }
    saveAllCards(cards);
    return cardData;
}

function deleteCardById(cardId) {
    let cards = getCards();
    cards = cards.filter(c => c.id !== cardId);
    saveAllCards(cards);
}

function getDecksList() {
    const cards = getCards();
    const decks = new Set(['all']);
    cards.forEach(card => {
        if (card.deck && card.deck.trim() !== "") {
            decks.add(card.deck.toLowerCase().trim());
        }
    });
    return Array.from(decks);
}

function logReviewEvent() {
    try {
        const history = JSON.parse(localStorage.getItem('reviewHistory')) || [];
        history.push(Date.now()); 
        localStorage.setItem('reviewHistory', JSON.stringify(history));
    } catch (e) {
        console.error("Error saving review history", e);
    }
}

function getReviewHistory() {
    try {
        return JSON.parse(localStorage.getItem('reviewHistory')) || [];
    } catch (e) {
        return [];
    }
}
  