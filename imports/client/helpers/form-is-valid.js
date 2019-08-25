export default function formHelper(form) {
  const data = sessionStorage.getItem(form);
  return data > 0;
}
