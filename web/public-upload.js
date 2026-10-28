// Filter cached fragments before mounting them. The server removes the same
// entries from initial HTML, so a closed upload entry never flashes on screen.
export function publicUploadLinks(html,enabled){
 return enabled?html:html.replace(/<a\b(?=[^>]*\shref\s*=\s*(["'])\/upload(?:[?#][^"']*)?\1)[^>]*>[\s\S]*?<\/a\s*>/gi,'');
}
