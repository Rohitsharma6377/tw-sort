// src/core/sorter.js

// Tailwind class order (official recommended order)
const CLASS_ORDER = [
  // 1. Layout
  'container', 'box-border', 'box-content', 'block', 'inline-block', 
  'inline', 'flex', 'inline-flex', 'grid', 'inline-grid', 'hidden',
  
  // 2. Flexbox & Grid
  'flex-row', 'flex-col', 'flex-wrap', 'items-start', 'items-center', 
  'items-end', 'justify-start', 'justify-center', 'justify-between', 
  'justify-around', 'gap-', 'space-x-', 'space-y-',
  
  // 3. Positioning
  'static', 'fixed', 'absolute', 'relative', 'sticky', 'inset-', 'top-', 
  'right-', 'bottom-', 'left-', 'z-',
  
  // 4. Sizing
  'w-', 'h-', 'min-w-', 'min-h-', 'max-w-', 'max-h-',
  
  // 5. Spacing
  'm-', 'mx-', 'my-', 'mt-', 'mr-', 'mb-', 'ml-',
  'p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-',
  
  // 6. Typography
  // 6. Backgrounds
  'bg-', 'from-', 'via-', 'to-',

  // 7. Typography
  'text-', 'font-', 'leading-', 'tracking-', 'uppercase', 'lowercase',
  
  // 8. Borders
  'border-', 'rounded-', 'ring-',
  
  // 9. Effects
  'shadow-', 'opacity-', 'blur-',
  
  // 10. Transitions
  'transition-', 'duration-', 'ease-',
  
  // 11. Transforms
  'transform', 'scale-', 'rotate-', 'translate-',
  
  // 12. Interactions
  'cursor-', 'pointer-events-',
  
  // 13. States (hover, focus, etc)
  'hover:', 'focus:', 'active:', 'disabled:'
];

/**
 * Get the order priority of a Tailwind class
 */
function getClassPriority(className) {
  // Handle state modifiers (hover:, focus:, etc)
  if (className.includes(':')) {
    const [modifier, baseClass] = className.split(':');
    const modifierIndex = CLASS_ORDER.findIndex(c => c === modifier + ':');
    const baseIndex = getClassPriority(baseClass);
    return modifierIndex * 1000 + baseIndex;
  }
  
  // Find matching pattern
  for (let i = 0; i < CLASS_ORDER.length; i++) {
    const pattern = CLASS_ORDER[i];
    if (pattern.endsWith('-')) {
      if (className.startsWith(pattern)) {
        return i;
      }
    } else {
      if (className === pattern) {
        return i;
      }
    }
  }
  
  return CLASS_ORDER.length;
}

/**
 * Sort Tailwind classes according to official order
 */
function sortClasses(classString, options = {}) {
  const { removeDuplicates = true } = options;

  if (!classString || typeof classString !== 'string') {
    return '';
  }
  
  const classes = classString.trim().split(/\s+/).filter(Boolean);
  const uniqueClasses = removeDuplicates ? [...new Set(classes)] : classes;
  
  const sorted = uniqueClasses.sort((a, b) => {
    return getClassPriority(a) - getClassPriority(b);
  });
  
  return sorted.join(' ');
}

/**
 * Check if a string contains Tailwind classes
 */
function hasTailwindClasses(str) {
  const tailwindPatterns = [
    /\b(flex|grid|block|hidden|container)\b/,
    /\b(w-|h-|m-|p-|text-|bg-|border-)/,
    /\bhover:|focus:|active:/
  ];
  
  return tailwindPatterns.some(pattern => pattern.test(str));
}

module.exports = {
  sortClasses,
  hasTailwindClasses,
  getClassPriority
};