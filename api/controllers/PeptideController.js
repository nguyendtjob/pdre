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
    var freq;
    if (isNaN(req.body.freq) || req.body.freq == null) {
      freq = 0;
    } else {
      freq = req.body.freq;
    }
    var leftSequence = req.body.leftSequence;
    var redPart = req.body.redPart;
    var rightSequence = req.body.rightSequence;
    var pos = req.body.pos;
    var stimulation = req.body.stimulation;
    var reference = req.body.reference;
    var fullReference = req.body.fullReference;
    var url = req.body.url;
    var newTag = !!req.body.newTag;
    var comment = req.body.comment;
    var image = "";

    req.file('file').upload(function whenDone(err,uploadedFiles){
      if (err) {
        sails.log.error(new Error("Create: Error when uploading image file"));
      }

      if (uploadedFiles.length === 0) {
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
          newTag: newTag,
          image: image,
          comment: comment
        }).exec(function (err) {
          if (err) {
            sails.log.error(new Error("500: Database Error (create)"));
            res.send(500, {error: 'Database Error'});
          }
          res.redirect('Peptide/adminlist');
        });
      }else {
        var fs = require('fs');
        var bitmap = fs.readFileSync(uploadedFiles[0].fd);
        image = "data:image/jpeg;base64,"+ bitmap.toString('base64');
        fs.unlink(uploadedFiles[0].fd, function(err) {
          if (err) {
            sails.log.error(new Error("Send: Error when deleting pdf in the server"));
            return;
          }

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
            newTag: newTag,
            image: image,
            comment: comment
          }).exec(function (err) {
            if (err) {
              sails.log.error(new Error("500: Database Error (create)"));
              res.send(500, {error: 'Database Error'});
            }
            res.redirect('Peptide/adminlist');
          });
        });
      }

    });
  },


  /**
   * `PeptideController.list()`
   */
  list: function (req, res) {
    Peptide.find().where({type: "mutation"}).exec(function (err, mutations) {
      if (err) {
        sails.log.error(new Error("500: Database Error (list: fetch mutation)"));
        res.send(500, {error: 'Database Error'});
      }

      Peptide.find().where({type: "tumor"}).exec(function (err, tumors) {
        if (err) {
          sails.log.error(new Error("500: Database Error (list: fetch tumor)"));
          res.send(500, {error: 'Database Error'});
        }

        Peptide.find().where({type: "differentiation"}).exec(function (err, differentiations) {
          if (err) {
            sails.log.error(new Error("500: Database Error (list: fetch differentiation)"));
            res.send(500, {error: 'Database Error'});
          }

          Peptide.find().where({type: "overexpressed"}).exec(function (err, overs) {
            if (err) {
              sails.log.error(new Error("500: Database Error (list: fetch overexpressed)"));
              res.send(500, {error: 'Database Error'});
            }

            Peptide.find().where({type: "potential"}).exec(function (err, potentials) {
              if (err) {
                sails.log.error(new Error("500: Database Error (list: fetch potential)"));
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
        sails.log.error(new Error("500: Database Error (search: fetch non-potential)"));
        res.send(500, {error: 'Database Error'});
      }
      Peptide.find().where({type: "potential"}).exec(function (err, potentials) {
        if (err) {
          sails.log.error(new Error("500: Database Error (search: fetch potential)"));
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
    Peptide.find().where({type: {'!' : ["potential"]}}).exec(function (err, peptides){
      if (err) {
        sails.log.error(new Error("500: Database Error (adminlist: fetch non-potential)"));
        res.send(500, {error: 'Database Error'});
      }
      Peptide.find().where({type: "potential"}).exec(function (err, potentials) {
        if (err) {
          sails.log.error(new Error("500: Database Error (adminlist: fetch potential)"));
          res.send(500, {error: 'Database Error'});
        }
        res.view('adminlist', {
          peptides: peptides,
          potentials: potentials
        });
      });
    });
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
        sails.log.error(new Error("Send: Error when uploading pdf"));
        return res.view('submit', {message:"error"});
      }


      //Nodemailer module used to send the mail
      var nodemailer = require('nodemailer');
      var config = require("../../config/secrets");

      //Credentials of host
      var transporter = nodemailer.createTransport({
        host: config.emailsmtp,
        port: config.emailport,
      });

      var mailOptions;

      //Mail body
      mailOptions = {
        from: config.emailsender,
        to: config.emailreceiver,
        subject: 'CAPeD: A new file has been submitted to you',
        html: '<html><p>Greetings</p><p>Here is a new article suggestion from ' + req.body.email + '.</p><p>Here is their comment: </p><p><i>' + req.body.comment + '</i></p></html>',
        attachments: [{
          filename: uploadedFiles[0].filename,
          path: uploadedFiles[0].fd
        }]
      };

      //Sending the mail
      transporter.sendMail(mailOptions, function(error, info){
        if (err) {
          sails.log.error(new Error("Send: Error when sending mail"));
          return res.view('submit', {message:"error"});
        }
        console.log('Email sent: ' + info.response);

        //Deleting the temporary file after the mail has been sent.
        var fs = require('fs');
        fs.unlink(uploadedFiles[0].fd, function(err) {
          if (err) {
            sails.log.error(new Error("Send: Error when deleting pdf in the server"));
            return;
          }
          return res.view('submit', {message:"success"});
        });

      });
    });
  },

  /**
   * `PeptideController.add()`
   */
  add: function(req, res) {
    res.view('add');
  },

  /**
   * `PeptideController.edit()`
   */
  edit: function (req, res) {
    Peptide.findOne({id: req.params.id}).exec(function (err, peptide) {
      if (err) {
        sails.log.error(new Error("500: Database Error (edit)"));
        res.send(500, {error: 'Database Error'});
      }
      res.view('edit', {peptide: peptide});
    })
  },


  details: function (req, res) {
    Peptide.findOne({id: req.params.id}).exec(function (err, peptide) {
      if (err) {
        sails.log.error(new Error("500: Database Error (details)"));
        res.send(500, {error: 'Database Error'});
      }

      if(!peptide){
        res.redirect('404');
      }else{
        res.view('details', {peptide: peptide});
      }
    })
  },

  /**
   * `PeptideController.update()`
   */
  update: function(req, res){
    var gene = req.body.gene;
    var geneCard = req.body.geneCard;
    var type = req.body.type;
    var tumor = req.body.tumor;
    var hla = req.body.hla;
    var freq;
    if (isNaN(req.body.freq) || req.body.freq == null) {
      freq = 0;
    } else {
      freq = req.body.freq;
    }
    var leftSequence = req.body.leftSequence;
    var redPart = req.body.redPart;
    var rightSequence = req.body.rightSequence;
    var pos = req.body.pos;
    var stimulation = req.body.stimulation;
    var reference = req.body.reference;
    var fullReference = req.body.fullReference;
    var url = req.body.url;
    var newTag = !!req.body.newTag;
    var comment = req.body.comment;
    var image;
    if (req.body.deleteImage){
      image = "";
    } else {
      image = req.body.image;
    }

    req.file('file').upload(function whenDone(err,uploadedFiles) {
      if (err) {
        sails.log.error(new Error("Create: Error when uploading image file"));
      }
      if (uploadedFiles.length === 0) {
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
          newTag: newTag,
          image: image,
          comment: comment
        }).exec(function (err) {
          if (err) {
            sails.log.error(new Error("500: Database Error (update)"));
            res.send(500, {error: 'Database Error'});
          }
          res.redirect('Peptide/adminlist');
        });
      } else {
        var fs = require('fs');
        var bitmap = fs.readFileSync(uploadedFiles[0].fd);
        image = "data:image/jpeg;base64," + bitmap.toString('base64');
        fs.unlink(uploadedFiles[0].fd, function (err) {
          if (err) {
            sails.log.error(new Error("Send: Error when deleting pdf in the server"));
            return;
          }
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
            newTag: newTag,
            image: image,
            comment: comment
          }).exec(function (err) {
            if (err) {
              sails.log.error(new Error("500: Database Error (update)"));
              res.send(500, {error: 'Database Error'});
            }
            res.redirect('Peptide/adminlist');
          });
        });
      }
    });
  },

  /**
   * `PeptideController.delete()`
   */
  delete: function (req, res) {
    Peptide.destroy({id: req.params.id}).exec(function (err) {
      if (err) {
        sails.log.error(new Error("500: Database Error (delete)"));
        res.send(500, {error: 'Database Error'});
      }
      res.redirect('Peptide/adminlist');
    });
  }
};

