export function parseMarkdown(text) {
  if (typeof text !== 'string') return text;

  const regex = /(~~.*?~~|~~.*$|\*\*.*?\*\*|\*\*.*$|__.*?__|__.*$|\*.*?\*|\*.*$|_.*?_|_.*$)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    if (part.startsWith('~~')) {
      const content = part.endsWith('~~') && part.length >= 4 ? part.slice(2, -2) : part.slice(2);
      return <s key={i} style={{ opacity: 0.5, textDecorationThickness: '2px' }}>{content}</s>;
    }
    if (part.startsWith('**')) {
      const content = part.endsWith('**') && part.length >= 4 ? part.slice(2, -2) : part.slice(2);
      return <strong key={i} style={{ color: '#fff' }}>{content}</strong>;
    }
    if (part.startsWith('__')) {
      const content = part.endsWith('__') && part.length >= 4 ? part.slice(2, -2) : part.slice(2);
      return <strong key={i} style={{ color: '#fff' }}>{content}</strong>;
    }
    if (part.startsWith('*') && part[1] !== ' ') {
      const content = part.endsWith('*') && part.length >= 2 ? part.slice(1, -1) : part.slice(1);
      return <em key={i}>{content}</em>;
    }
    if (part.startsWith('_')) {
      const content = part.endsWith('_') && part.length >= 2 ? part.slice(1, -1) : part.slice(1);
      return <em key={i}>{content}</em>;
    }

    return part;
  });
}
