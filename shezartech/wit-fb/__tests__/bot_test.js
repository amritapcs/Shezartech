jest
  .dontMock('../bot.js');

process.env.WIT_TOKEN = 'wit_token';
const bot = require('../bot.js');

describe('Bot tests', function () {

  it('Bot creation', function () {
    const client = bot.getWit(); // Just testing the creation  
    expect(client).not.toBeNull();
  });
});