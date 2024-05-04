import van from 'vanjs-core';
import { TagItem } from './tag-item';
import '../styles/components/tag-list.scss';

const { ul } = van.tags;

export const TagList = () => ul(
  { class: 'bmtweaks-tag-list'},
  // TODO テスト用 プルリク時に削除
  TagItem('test', '#42EB64'),
  TagItem('保存用', 'magenta'),
  TagItem('長いタグ名のテスト用タグ', '32b9da'),
  TagItem('uoooooooooooooooo', 'gold')
);
