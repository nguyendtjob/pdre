/**
 * Peptide.js
 *
 * @description :: Peptide model with its metadata as attributes
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    _id : { type: 'string'},

    gene : { type: 'string' },

    geneCard : { type: 'string' },

    type : { type: 'string' },

    tumor : { type: 'string' },

    hla : { type: 'string' },

    freq : { type: 'integer' },

    leftSequence : { type: 'string' },

    redPart : { type: 'string' },

    rightSequence : { type: 'string' },

    pos : { type: 'string' },

    stimulation : { type: 'string' },

    reference : { type: 'string' },

    fullReference : { type: 'string' },

    url : { type: 'string' },

    newTag : { type: 'boolean'},

    comment : { type: 'string' },

    image : { type : 'string'}
  },

  connection: 'sailsMongoDBServer'
};

