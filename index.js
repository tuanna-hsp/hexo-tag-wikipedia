
function buildArgsHash(args) {
  let argsHash = {};
  args.forEach(arg => {
    const params = arg.split(':');
    argsHash[params[0]] = params[1];
  });

  return argsHash;
}

function generateWikipediaTagHtml(args, content){
  const argsHash = buildArgsHash(args);
  const title = argsHash['title'];

  const lang = argsHash['lang'] !== undefined ? argsHash['lang'] : 'en';
  const baseUrl = `https://${lang}.wikipedia.org`;

  const sentenceParam = argsHash['sentences'] !== undefined ? `&exsentences=${argsHash['sentences']}` : ''
  const url = `${baseUrl}/w/api.php?action=query&origin=*&prop=extracts${sentenceParam}&format=json&exintro=&titles=${title}`;

  const tagId = Math.round(Math.random() * 100000);
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
  if (argsHash['wikiButton'] === 'true') {
    contentText += `<p><a href="${baseUrl}/wiki/${title}">Wikipedia</a></p>`;
  }

  return `<blockquote id='${tagId}'>${contentText}</blockquote>`;
}

hexo.extend.tag.register('wikipedia', generateWikipediaTagHtml);
