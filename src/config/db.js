const connect = async () => {
  try {
    console.log('connect successfully!');
  } catch (error) {
    console.error('connect failure!');
  }
};

module.exports = { connect };
