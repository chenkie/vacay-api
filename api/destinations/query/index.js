const Destination = require('./../model');

const getDestinations = async () => {
  try {
    return await Destination.find({});
  } catch (err) {
    return err;
  }
};

const getDestination = async id => {
  try {
    return await Destination.findOne({ _id: id });
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

const deleteDestination = async id => {
  try {
    return await Destination.findOneAndRemove({ _id: id });
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
