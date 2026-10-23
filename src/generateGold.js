const gold = (sentence) => sentence.split(' ').reduce((l, c, i, a) => (l.push(c), i + 1 < a.length && l.push(' '), l), []).map((word, index) => <span key={index}>{word}</span>)

export default gold