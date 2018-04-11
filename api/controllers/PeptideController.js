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
    Peptide.find().where({type: "mutation"}).exec(function (err, mutations) {
      if (err) {
        res.send(500, {error: 'Database Error'});
      }

      Peptide.find().where({type: "tumor"}).exec(function (err, tumors) {
        if (err) {
          res.send(500, {error: 'Database Error'});
        }

        Peptide.find().where({type: "differentiation"}).exec(function (err, differentiations) {
          if (err) {
            res.send(500, {error: 'Database Error'});
          }

          Peptide.find().where({type: "overexpressed"}).exec(function (err, overs) {
            if (err) {
              res.send(500, {error: 'Database Error'});
            }

            Peptide.find().where({type: "potential"}).exec(function (err, potentials) {
              if (err) {
                res.send(500, {error: 'Database Error'});
              }
              res.view('list', {
                mutations: mutations,
                tumors: tumors,
                differentiations: differentiations,
                overs: overs,
                potentials: potentials
              });
            });
          });
        });
      });
    });
  },

  /**
   * `PeptideController.search()`
   */
  search: function (req, res) {
    Peptide.find().where({type: {'!' : ["potential"]}}).exec(function (err, peptides){
      if (err) {
        res.send(500, {error: 'Database Error'});
      }
        Peptide.find().where({type: "potential"}).exec(function (err, potentials) {
          if (err) {
            res.send(500, {error: 'Database Error'});
          }
          res.view('search', {
            peptides: peptides,
            potentials: potentials
          });
        });
    });
  },

  /**
   * `PeptideController.adminlist()`
   */
  adminlist: function (req, res) {
    if (req.session.me == null){
      res.view('403');
    }else {
      Peptide.find().where({type: {'!' : ["potential"]}}).exec(function (err, peptides){
        if (err) {
          res.send(500, {error: 'Database Error'});
        }
        Peptide.find().where({type: "potential"}).exec(function (err, potentials) {
          if (err) {
            res.send(500, {error: 'Database Error'});
          }

          res.view('adminlist', {
            peptides: peptides,
            potentials: potentials
          });
        });
      });
    }
  },

  /**
   * `PeptideController.submit()`
   */
  submit: function(req, res) {
      res.view('submit');
  },

  /**
   * `PeptideController.send()`
   */
  send: function(req,res) {
    //Use the build-in skipper
    req.file('pdf').upload(function whenDone(err,uploadedFiles){
      if (err) {
        return res.view('submit', {message:"error"});
      }

      //Nodemailer module used to send the mail
      var nodemailer = require('nodemailer');

      //Credentials of the gmail account
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'caped.pdre@gmail.com',
          pass: 'seacats86'
        }
      });

      var mailOptions;

      //Different mailoptions if they left a comment or not in the submit form
      if (req.body.comment !== ""){
        mailOptions = {
          from: 'caped.pdre@gmail.com',
          to: 'caped.pdre@gmail.com',
          subject: 'CAPeD: A new file has been submitted to you',
          html: '<html><p>Greetings</p><p>Here is new article suggestion from ' + req.body.email + '.</p><p>Here is their comment: </p><p><i>' + req.body.comment + '</i></p></html>',
          attachments: [{
            filename: uploadedFiles[0].filename,
            path: uploadedFiles[0].fd
          }]
        };
      } else {
        mailOptions = {
          from: 'caped.pdre@gmail.com',
          to: 'caped.pdre@gmail.com',
          subject: 'CAPeD: A new file has been submitted to you',
          html: '<html><p>Greetings</p><p>Here is new article suggestion from ' + req.body.email + '.</p><p>They did not leave any comment.</p></html>',
          attachments: [{
            filename: uploadedFiles[0].filename,
            path: uploadedFiles[0].fd
          }]
        };
      }

      //Sending the mail
      transporter.sendMail(mailOptions, function(error, info){
        if (err) {
          return res.view('submit', {message:"error"});
        }
          console.log('Email sent: ' + info.response);

          //Deleting the temporary file after the mail has been sent.
          var fs = require('fs');
          fs.unlink(uploadedFiles[0].fd, function(err) {
            if (err) return console.log(err);
            return res.view('submit', {message:"success"});
          });

      });
    });
  },

  /**
   * `PeptideController.add()`
   */
  add: function(req, res) {
    if (req.session.me == null){
      res.view('403');
    }else{
      res.view('add');
    }
  },

  /**
   * `PeptideController.edit()`
   */
  edit: function (req, res) {
    if (req.session.me == null){
      res.view('403');
    }else {
      Peptide.findOne({id: req.params.id}).exec(function (err, peptide) {
        if (err) {
          res.send(500, {error: 'Database Error'});
        }
        res.view('edit', {peptide: peptide});
      })
    }
  },

  /**
   * `PeptideController.update()`
   */
  update: function(req, res){
    if (req.session.me == null){
      res.view('403');
    }else {
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

      Peptide.update({id: req.params.id}, {
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
      }).exec(function (err) {
        if (err) {
          res.send(500, {error: 'Database Error'});
        }
        res.redirect('Peptide/adminlist');
      });
    }

    },

  /**
   * `PeptideController.delete()`
   */
  delete: function (req, res) {
    if (req.session.me == null){
      res.view('403');
    }else {
      Peptide.destroy({id: req.params.id}).exec(function (err) {
        if (err) {
          res.send(500, {error: 'Database Error'});
        }
        res.redirect('Peptide/adminlist');
      });
      return false;
    }
  }
};

