const queries = require('./../query');

const getDestinations = async (req, res) => {
  try {
    const owner = req.user.sub;
    const destinations = await queries.getDestinations(owner);
    res.json({ result: destinations });
  } catch (err) {
    return err;
  }
};

const getDestination = async (req, res) => {
  try {
    const owner = req.user.sub;
    const id = req.params.id;
    const destination = await queries.getDestination(owner, id);
    res.json({ result: destination });
  } catch (err) {
    return err;
  }
};

const postDestination = async (req, res) => {
  try {
    const owner = req.user.sub;
    const destination = req.body.data;
    const newDestination = await queries.createDestination(owner, destination);
    res.json({ message: 'Destination created', result: newDestination });
  } catch (err) {
    console.log(err);
    return err;
  }
};

const deleteDestination = async (req, res) => {
  try {
    const owner = req.user.sub;
    const id = req.params.id;
    await queries.deleteDestination(owner, id);
    res.json({ message: 'Destination deleted' });
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports = {
  getDestinations,
  getDestination,
  postDestination,
  deleteDestination
};
