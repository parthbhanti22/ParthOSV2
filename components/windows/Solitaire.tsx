import React, { useState, useEffect, useMemo } from 'react';

type Suit = 'H' | 'D' | 'C' | 'S';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
interface Card {
  suit: Suit;
  rank: Rank;
  isFaceUp: boolean;
}

const SUITS: Suit[] = ['H', 'D', 'C', 'S'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const RANK_VALUES: { [key in Rank]: number } = { A: 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, J: 11, Q: 12, K: 13 };
const SUIT_COLORS: { [key in Suit]: string } = { H: 'text-red-500', D: 'text-red-500', C: 'text-black', S: 'text-black' };
const SUIT_SYMBOLS: { [key in Suit]: string } = { H: '♥', D: '♦', C: '♣', S: '♠' };

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({ suit, rank, isFaceUp: false });
    });
  });
  return deck;
};

const shuffleDeck = (deck: Card[]): Card[] => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const CardComponent: React.FC<{ card: Card | null; onClick?: () => void; isPilePlaceholder?: boolean }> = ({ card, onClick, isPilePlaceholder }) => {
  const baseClasses = "w-20 h-28 rounded-md shadow-md flex items-center justify-center text-lg font-bold";
  if (isPilePlaceholder) return <div className={`${baseClasses} bg-green-800/50 border-2 border-dashed border-white/50`}></div>;
  if (!card) return null;

  if (!card.isFaceUp) {
    return <div onClick={onClick} className={`${baseClasses} bg-blue-500 border-2 border-blue-700`}></div>;
  }

  const color = SUIT_COLORS[card.suit];
  const symbol = SUIT_SYMBOLS[card.suit];

  return (
    <div onClick={onClick} className={`${baseClasses} bg-white ${color} relative p-1`}>
      <span className="absolute top-1 left-2">{card.rank}</span>
      <span className="absolute text-3xl">{symbol}</span>
      <span className="absolute bottom-1 right-2 transform rotate-180">{card.rank}</span>
    </div>
  );
};

const Solitaire: React.FC = () => {
    const [stock, setStock] = useState<Card[]>([]);
    const [waste, setWaste] = useState<Card[]>([]);
    const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
    const [tableau, setTableau] = useState<Card[][]>([]);
    const [selected, setSelected] = useState<{ pile: string; cardIndex: number } | null>(null);
    const [isWin, setIsWin] = useState(false);

    const initGame = () => {
        let deck = shuffleDeck(createDeck());
        const newTableau: Card[][] = Array.from({ length: 7 }, (_, i) => deck.splice(0, i + 1));
        newTableau.forEach(pile => pile[pile.length - 1].isFaceUp = true);
        
        setTableau(newTableau);
        setStock(deck);
        setWaste([]);
        setFoundations([[], [], [], []]);
        setSelected(null);
        setIsWin(false);
    };

    useEffect(initGame, []);

    const handleStockClick = () => {
        if (stock.length > 0) {
            const newStock = [...stock];
            const card = newStock.pop()!;
            card.isFaceUp = true;
            setWaste(prev => [...prev, card]);
            setStock(newStock);
        } else if (waste.length > 0) {
            setStock([...waste].reverse().map(c => ({...c, isFaceUp: false})));
            setWaste([]);
        }
        setSelected(null);
    };

    const handleCardClick = (pile: string, cardIndex: number) => {
        if (selected && selected.pile === pile && selected.cardIndex === cardIndex) {
            setSelected(null);
            return;
        }

        const sourcePile = pile.split('-');
        const pileType = sourcePile[0];
        const pileIndex = parseInt(sourcePile[1], 10);
        
        let card: Card | undefined;
        if(pileType === 'waste' && waste.length > 0) card = waste[waste.length - 1];
        if(pileType === 'tableau') card = tableau[pileIndex][cardIndex];
        
        if (!card || !card.isFaceUp) return;

        if (selected) {
            // Move logic
            const fromPileName = selected.pile.split('-')[0];
            const fromPileIndex = parseInt(selected.pile.split('-')[1], 10);
            
            const sourceCard = fromPileName === 'tableau' ? tableau[fromPileIndex][selected.cardIndex] : waste[waste.length - 1];

            // to foundation
            if (pileType === 'foundation') {
                const foundation = foundations[pileIndex];
                if (foundation.length === 0) {
                    if (sourceCard.rank === 'A') {
                        moveCards(selected, {pile, cardIndex});
                    }
                } else {
                    const topCard = foundation[foundation.length - 1];
                    if (topCard.suit === sourceCard.suit && RANK_VALUES[sourceCard.rank] === RANK_VALUES[topCard.rank] + 1) {
                         moveCards(selected, {pile, cardIndex});
                    }
                }
            }
            // to tableau
            if (pileType === 'tableau') {
                const targetPile = tableau[pileIndex];
                 if (targetPile.length === 0) {
                    if (sourceCard.rank === 'K') {
                        moveCards(selected, {pile, cardIndex});
                    }
                } else {
                    const topCard = targetPile[targetPile.length-1];
                    if (SUIT_COLORS[sourceCard.suit] !== SUIT_COLORS[topCard.suit] && RANK_VALUES[sourceCard.rank] === RANK_VALUES[topCard.rank] - 1) {
                        moveCards(selected, {pile, cardIndex});
                    }
                }
            }
            setSelected(null);
        } else {
            setSelected({ pile, cardIndex });
        }
    };
    
    const moveCards = (from: {pile: string, cardIndex: number}, to: {pile: string, cardIndex: number}) => {
        const fromPileName = from.pile.split('-')[0];
        const fromPileIndex = parseInt(from.pile.split('-')[1], 10);
        const toPileName = to.pile.split('-')[0];
        const toPileIndex = parseInt(to.pile.split('-')[1], 10);

        let cardsToMove: Card[] = [];
        // From Waste
        if (fromPileName === 'waste') {
            const newWaste = [...waste];
            cardsToMove.push(newWaste.pop()!);
            setWaste(newWaste);
        }
        // From Tableau
        if (fromPileName === 'tableau') {
            const newTableau = [...tableau];
            cardsToMove = newTableau[fromPileIndex].splice(from.cardIndex);
            if(newTableau[fromPileIndex].length > 0) {
                newTableau[fromPileIndex][newTableau[fromPileIndex].length - 1].isFaceUp = true;
            }
            setTableau(newTableau);
        }
        
        // To Foundation
        if (toPileName === 'foundation') {
            const newFoundations = [...foundations];
            newFoundations[toPileIndex].push(...cardsToMove);
            setFoundations(newFoundations);
        }
        // To Tableau
        if (toPileName === 'tableau') {
            const newTableau = [...tableau];
            newTableau[toPileIndex].push(...cardsToMove);
            setTableau(newTableau);
        }
    };
    
    useEffect(() => {
        if(foundations.flat().length === 52) {
            setIsWin(true);
        }
    }, [foundations]);

    const isSelected = (pile: string, cardIndex: number) => selected?.pile === pile && selected?.cardIndex === cardIndex;

    return (
        <div className="w-full h-full bg-green-700 p-4 font-sans text-sm select-none">
            {isWin && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
                    <h2 className="text-4xl font-bold text-white mb-4">You Win!</h2>
                    <button onClick={initGame} className="px-6 py-2 bg-blue-500 text-white rounded">Play Again</button>
                </div>
            )}
            <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
                    <div onClick={handleStockClick}>
                        <CardComponent card={stock.length > 0 ? stock[stock.length - 1] : null} isPilePlaceholder={stock.length === 0} />
                    </div>
                    <div onClick={() => handleCardClick('waste-0', waste.length - 1)}>
                        <CardComponent card={waste.length > 0 ? waste[waste.length - 1] : null} />
                        {isSelected('waste-0', waste.length -1) && <div className="absolute inset-0 ring-2 ring-yellow-400 rounded-md"></div>}
                    </div>
                </div>
                <div className="flex space-x-4">
                    {foundations.map((pile, i) => (
                        <div key={i} className="relative" onClick={() => handleCardClick(`foundation-${i}`, pile.length - 1)}>
                            <CardComponent card={pile.length > 0 ? pile[pile.length - 1] : null} isPilePlaceholder={true} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-7 gap-4">
                {tableau.map((pile, i) => (
                    <div key={i} className="relative h-96">
                        {pile.map((card, j) => (
                            <div key={j} className="absolute" style={{ top: `${j * 6}px` }} onClick={() => handleCardClick(`tableau-${i}`, j)}>
                                <CardComponent card={card} />
                                {isSelected(`tableau-${i}`, j) && <div className="absolute inset-0 ring-2 ring-yellow-400 rounded-md"></div>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
             <button onClick={initGame} className="absolute bottom-2 right-2 text-xs bg-gray-800/50 text-white px-2 py-1 rounded">New Game</button>
        </div>
    );
};

export default Solitaire;
