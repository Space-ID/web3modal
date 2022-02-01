const path = require('path')
const { extractColors } = require('extract-colors')

module.exports = async function generateColorFromProvider(options, loaderContext, content) {
  const replaceAsync = (await import('string-replace-async')).default
  const replacement = await replaceAsync(content, /(export const [^=]+).+{([^}]+)}/g, async(match, g1, g2) => {
    const logoName = g2.match(/(?<=logo:\s).[\w]+/g)[0]
    const logoDirectory = content.match(new RegExp(`(?<=${logoName} from '../logos/).+(?='\n)`, 'g'))[0]

    const [color] = await extractColors(path.join(__dirname, 'providers/logos', logoDirectory))
    const g2changed = g2.replace(/(?<=logo:.+),\n/g, `,\n  color: '${color.hex}',\n`)
    return match.replace(g2, g2changed)
  })
  return { code: replacement }
}
