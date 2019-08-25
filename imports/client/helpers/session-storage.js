export default function sessionHelper(form) {
  const data = sessionStorage.getItem(form) !== 'undefined' ? sessionStorage.getItem(form) : '';
  return data || '';
}
