/* Medal: Lucide, ISC. See /assets/icons/LUCIDE-LICENSE. */
const medal="<svg class=\"rank-medal\" aria-hidden=\"true\"\n  xmlns=\"http://www.w3.org/2000/svg\"\n  width=\"24\"\n  height=\"24\"\n  viewBox=\"0 0 24 24\"\n  fill=\"none\"\n  stroke=\"currentColor\"\n  stroke-width=\"2\"\n  stroke-linecap=\"round\"\n  stroke-linejoin=\"round\"\n>\n  <path d=\"M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15\" />\n  <path d=\"M11 12 5.12 2.2\" />\n  <path d=\"m13 12 5.88-9.8\" />\n  <path d=\"M8 7h8\" />\n  <circle cx=\"12\" cy=\"17\" r=\"5\" />\n</svg>\n";
export function rankBadge(rank,sort="score"){
 const tone=(sort==="score"||sort==="speed")?["gold","silver","bronze"][rank-1]:null;
 return `<span class="rank-cell${tone?" rank-"+tone:""}"><span class="rank-value">${String(rank).padStart(2,"0")}</span>${tone?medal:""}</span>`;
}
