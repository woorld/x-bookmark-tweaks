import van from 'vanjs-core';
import '../styles/components/tag-item.scss';

const { li } = van.tags;

export const TagItem = (tagName: string, color: string) => li({
  class: 'bmtweaks-tag-item',
  style: () => `
    color: ${color};
    border-color: ${color};
  `,
}, tagName);
