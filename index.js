
function buildArgsHash(args) {
  let argsHash = {};
  args.forEach(arg => {
    const params = arg.split('=');
    argsHash[params[0]] = params[1];
  });

  return argsHash;
}

function generateWikipediaTagHtml(args, content){
  const argsHash = buildArgsHash(args);
  const title = argsHash['title'];
  const lang = argsHash['lang'] !== undefined ? argsHash['lang'] : 'en';
  const showReadMore = argsHash['readMore'] === 'true';

  const tagId = `wiki-${title}`;
  const baseUrl = `https://${lang}.wikipedia.org`;
  const url = `${baseUrl}/w/api.php?action=query&origin=*&prop=extracts&format=json&exintro=&titles=${title}`;

  const embeddedScript = `
    window.addEventListener('load', function() {
      $.getJSON('${url}', function(result) {
        const pages = result.query.pages;
        const firstPageIndex = Object.keys(pages)[0];
        const extract = pages[firstPageIndex].extract;
        $('#${tagId}').prepend(extract);
      });
    });
  `;
  let contentText = `<script>${embeddedScript}</script>`;
  if (showReadMore) {
    contentText += `<p><a href="${baseUrl}/wiki/${title}">More on Wikipedia</a></p>`;
  }

  return `<blockquote id='${tagId}'>${contentText}</blockquote>`;
}

hexo.extend.tag.register('wikipedia', generateWikipediaTagHtml);
