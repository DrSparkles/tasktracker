import chai from 'chai';
import { clearAllAndLoad } from '../../fixtures';
const should = chai.should();

import TaskList from '../../../modules/tasklist.js';

describe('TaskList', function() {

  before(function(done){
    clearAllAndLoad(function(err){
      if (err){
        console.log(err);
        return done(err);
      }

      return done(null);
    })
  });

  it('getUsersLists should return all lists with tasks for the given user', function(done){

    const userId = '5ab0d2d4528adc08f0412183';
    TaskList.getUsersLists(userId, function(err, docs){
      if (err) { return done(err); }

      docs.error.should.be.false;
      docs.result.should.be.instanceof(Array);
      docs.result[0].listname.should.equal('Great List');
      docs.result[0].tasks.should.be.instanceof(Array);
      docs.result[0].tasks[0].taskname.should.equal('Great Task');

      return done(null);
    });
  });

  it('getUsersLists should return nothing if user id is not recognized', function(done){

    const userId = '5ab0d2d4528adc08f0123456';
    TaskList.getUsersLists(userId, function(err, docs){
      if (err) { return done(err); }

      docs.error.should.be.false;
      docs.result.should.be.instanceof(Array);
      docs.result.should.have.length(0);

      return done(null);
    });
  });

  it('getList should return a specific list given an id', function(done){

    const listId = '5ab0d2f5528adc08f0412184';
    TaskList.getList(listId, function(err, docs){
      if (err) { return done(err); }

      docs.error.should.be.false;

      docs.result[0].listname.should.equal('Great List');
      docs.result[0].tasks.should.be.instanceof(Array);
      docs.result[0].tasks[0].taskname.should.equal('Great Task');

      return done(null);
    });
  });

  it('getList should return nothing given an unrecognized list id', function(done){

    const listId = '5ab0d2f5528adc08f0123456';
    TaskList.getList(listId, function(err, docs){
      if (err) { return done(err); }

      docs.error.should.be.false;

      docs.result.should.be.instanceof(Array);
      docs.result.should.have.length(0);

      return done(null);
    });
  });

  it('createNew should create a new entry', function(done){
    const userId = '5ab0d2d4528adc08f0123456';
    const listValues = { listname: "Fancy New List" };
    TaskList.createNew(userId, listValues, function(err, docs){
      if (err) { return done(err); }
      docs.error.should.be.false;
      docs.result.listname.should.equal(listValues.listname);
      docs.result.tasks.should.be.instanceof(Array);
      docs.result.tasks.should.have.length(0);

      TaskList.getList(docs.result._id, function(err, docs){
        if (err) { return done(err); }

        docs.error.should.be.false;
        docs.result.should.be.instanceof(Array);
        docs.result.should.have.length(1);
        docs.result[0].listname.should.equal(listValues.listname);
        docs.result[0].tasks.should.be.instanceof(Array);
        docs.result[0].tasks.should.have.length(0);

        return done(null);
      });
    });
  });

  it('updateList should change list name', function(done){
    const userId = '5ab0d2d4528adc08f0123456';
    const listValues = { listname: "List to name change" };

    // create a list to updated...
    TaskList.createNew(userId, listValues, function(err, docs){
      if (err) { return done(err); }

      docs.error.should.be.false;
      docs.result.listname.should.equal(listValues.listname);

      const listUpdateValues = { listname: "Updated list name" };

      // update that list...
      TaskList.updateList(docs.result._id, userId, listUpdateValues, function(err, updateDocs){
        if (err) { return done(err); }

        // result should return number edited, which should be 1...
        updateDocs.error.should.be.false;
        updateDocs.result.n.should.equal(1);


        // and check that the name actually changed...
        TaskList.getList(docs.result._id, function(err, dataCheckDocs){
          if (err) { return done(err); }

          dataCheckDocs.error.should.be.false;
          dataCheckDocs.result.should.be.instanceof(Array);
          dataCheckDocs.result.should.have.length(1);
          dataCheckDocs.result[0].listname.should.equal(listUpdateValues.listname);
          dataCheckDocs.result[0].tasks.should.be.instanceof(Array);
          dataCheckDocs.result[0].tasks.should.have.length(0);

          return done(null);
        });
      });
    });
  });

  it('deleteList should change list name', function(done){
    const userId = '5ab0d2d4528adc08f0123456';
    const listValues = { listname: "List to delete" };

    // create a list to updated...
    TaskList.createNew(userId, listValues, function(err, docs){
      if (err) { return done(err); }

      docs.error.should.be.false;
      docs.result.listname.should.equal(listValues.listname);

      // delete that list...
      TaskList.deleteList(docs.result._id, function(err, deleteDocs){
        if (err) { return done(err); }

        // result should return number edited, which should be 1...
        deleteDocs.error.should.be.false;

        // and check that the name actually changed...
        TaskList.getList(docs.result._id, function(err, dataCheckDocs){
          if (err) { return done(err); }

          dataCheckDocs.error.should.be.false;
          dataCheckDocs.result.should.be.instanceof(Array);
          dataCheckDocs.result.should.have.length(0);

          return done(null);
        });
      });
    });
  });

});