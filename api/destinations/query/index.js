const Destination = require('./../model');

const getDestinations = async owner => {
  try {
    return await Destination.find({ owner });
  } catch (err) {
    return err;
  }
};

const getDestination = async (owner, id) => {
  try {
    return await Destination.findOne({ owner, _id: id });
  } catch (err) {
    return err;
  }
};

const createDestination = async (owner, destinationData) => {
  try {
    const newDestination = new Destination(destinationData);
    newDestination.owner = owner;
    return await newDestination.save();
  } catch (err) {
    console.log(err);
    return err;
  }
};

const deleteDestination = async (owner, id) => {
  try {
    return await Destination.findOneAndRemove({ owner, _id: id });
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports = {
  getDestinations,
  getDestination,
  createDestination,
  deleteDestination
};
