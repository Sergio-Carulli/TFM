const rdf = require('rdf-ext')

function example () {
  return rdf.dataset([rdf.quad(
    rdf.namedNode('http://example.org/subject'),
    rdf.namedNode('http://example.org/predicate'),
    rdf.literal('object')
  )])
}

module.exports = example
