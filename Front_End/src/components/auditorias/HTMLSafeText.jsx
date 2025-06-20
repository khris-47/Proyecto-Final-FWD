// components/HTMLSafeText.js
import DOMPurify from 'dompurify';

export default function HTMLSafeText({ html }) {
  
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['br', 'b'],
    ALLOWED_ATTR: [],
  });

  return <span dangerouslySetInnerHTML={{ __html: clean }} />;
}
