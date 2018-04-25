/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    qpon: {
      collection: 'Person',
      via: 'isFor'
    },

    username: {
      type: 'string',
      unique: true
    },

    role: {
      type: 'string',
      enum: ["admin", "visitor"],
      defaultsTo: "visitor"
    },

    coin: {
      type: 'integer',
      defaultsTo: 1000
    },


    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  }
};

