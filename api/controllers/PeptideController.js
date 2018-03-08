/**
 * PeptideController
 *
 * @description :: Server-side logic for managing Peptides
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



  /**
   * `PeptideController.create()`
   */
  create: function (req, res) {
    var gene = req.body.gene;
    var geneCard = req.body.geneCard;
    var type = req.body.type;
    var tumor = req.body.tumor;
    var hla = req.body.hla;
    var freq = req.body.freq;
    var leftSequence = req.body.leftSequence;
    var redPart = req.body.redPart;
    var rightSequence = req.body.rightSequence;
    var pos = req.body.pos;
    var stimulation = req.body.stimulation;
    var reference = req.body.reference;
    var fullReference = req.body.fullReference;
    var url = req.body.url;
    var comment = req.body.comment;



    Peptide.create({
      gene: gene,
      geneCard: geneCard,
      type: type,
      tumor: tumor,
      hla: hla,
      freq: freq,
      leftSequence: leftSequence,
      redPart: redPart,
      rightSequence: rightSequence,
      pos: pos,
      stimulation: stimulation,
      reference: reference,
      fullReference: fullReference,
      url: url,
      comment: comment
    }).exec(function(err){
      if(err){
        res.send(500, {error: 'Database Error'});
      }

      res.redirect('Peptide/list');
    });

  },



  /**
   * `PeptideController.list()`
   */
  list: function (req, res) {
      Peptide.find().where({type:"mutation"}).exec(function (err, mutations){
        if (err) {
          res.send(500, {error: 'Database Error'});
        }

        Peptide.find().where({type:"tumor"}).exec(function (err,tumors){
          if (err) {
            res.send(500, {error: 'Database Error'});
          }

          Peptide.find().where({type:"differentiation"}).exec(function(err,differentiations){
            if (err) {
              res.send(500, {error: 'Database Error'});
            }

            Peptide.find().where({type:"overexpressed"}).exec(function(err,overs){
              if (err) {
                res.send(500, {error: 'Database Error'});
              }

              Peptide.find().where({type:"potential"}).exec(function(err,potentials){
                if (err) {
                  res.send(500, {error: 'Database Error'});
                }
                res.view('list', {mutations:mutations, tumors:tumors, differentiations: differentiations, overs:overs, potentials:potentials});
              });
            });
          });
        });
      });
  },

  reglist: function(req,res){

    Peptide.find().where({type:"mutation"}).exec(function (err, mutations){
      if (err) {
        res.send(500, {error: 'Database Error'});
      }

      Peptide.find().where({type:"tumor"}).exec(function (err,tumors){
        if (err) {
          res.send(500, {error: 'Database Error'});
        }

        Peptide.find().where({type:"differentiation"}).exec(function(err,differentiations){
          if (err) {
            res.send(500, {error: 'Database Error'});
          }

          Peptide.find().where({type:"overexpressed"}).exec(function(err,overs){
            if (err) {
              res.send(500, {error: 'Database Error'});
            }

            Peptide.find().where({type:"potential"}).exec(function(err,potentials){
              if (err) {
                res.send(500, {error: 'Database Error'});
              }
              res.view('reglist', {mutations:mutations, tumors:tumors, differentiations: differentiations, overs:overs, potentials:potentials});
            });
          });
        });
      });
    });
  },


  add: function(req, res) {
    res.view('add');
  },


  /**
   * `PeptideController.edit()`
   */
  edit: function (req, res) {
    Peptide.findOne({id:req.params.id}).exec(function(err, peptide){
        if(err){
          res.send(500, {error: 'Database Error'});
        }

        res.view('edit',{peptide: peptide});
    })
  },

  update: function(req, res){
    var gene = req.body.gene;
    var geneCard = req.body.geneCard;
    var type = req.body.type;
    var tumor = req.body.tumor;
    var hla = req.body.hla;
    var freq = req.body.freq;
    var leftSequence = req.body.leftSequence;
    var redPart = req.body.redPart;
    var rightSequence = req.body.rightSequence;
    var pos = req.body.pos;
    var stimulation = req.body.stimulation;
    var reference = req.body.reference;
    var fullReference = req.body.fullReference;
    var url = req.body.url;
    var comment = req.body.comment;

    console.log("leftseq in update: " + leftSequence);

    Peptide.update({id: req.params.id},{
      gene: gene,
      geneCard: geneCard,
      type: type,
      tumor: tumor,
      hla: hla,
      freq: freq,
      leftSequence: leftSequence,
      redPart: redPart,
      rightSequence: rightSequence,
      pos: pos,
      stimulation: stimulation,
      reference: reference,
      fullReference: fullReference,
      url: url,
      comment: comment
    }).exec(function(err){
      if(err){
        res.send(500, {error: 'Database Error'});
      }

      res.redirect('Peptide/list');
      });

    },


  /**
   * `PeptideController.delete()`
   */
  delete: function (req, res) {
    Peptide.destroy({id: req.params.id}).exec(function(err){
      if(err){
        res.send(500, {error: 'Database Error'});
      }

      res.redirect('Peptide/list');
    });

    return false;
  }
};

