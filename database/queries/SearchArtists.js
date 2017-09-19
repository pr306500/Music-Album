const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 10) => {
/*
  criteria = {'name':'pranjal',age:{'min':12,'max':23},'yearsActive':{'max':12,'min';5}}

*/
  const query = Artist.find(buildQuery(criteria))
                 .sort({[sortProperty]: 1})
                 .skip(offset)
                 .limit(limit);
 
  return Promise.all([query,Artist.find(buildQuery(criteria)).count()])
                .then((results)=>{
                	return{
                		all:results[0],
                		count:results[1],
                		offset:offset,
                		limit:limit
                	}
                })

};


const buildQuery = (criteria)=>{
/*An index is a system that mongo uses to make very efficient queries whenever we are looking for data
  Automatic index gets created on _id by default.
  The collection of indexes enables to make very fast lookup 
  In case of text indexing, Mongo currently only supports indexing on a single field
*/
 const query = {};

 if(criteria.name){
    query.$text = { // for text query we require text indexing
      $search:criteria.name
    }
    
  }

  if(criteria.age){
    query.age = {
      $gte:criteria.age.min,
      $lte:criteria.age.max
    }
    
  }

  if(criteria.yearsActive){
    query.yearsActive = {
      $gte:criteria.yearsActive.min,
      $lte:criteria.yearsActive.max
    }
  }

  return query;  

}