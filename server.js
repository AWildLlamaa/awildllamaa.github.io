const express = require('express');
const Twit = require('twit');

const app = express();
const port = 3000;

const apiKey = 'i4wpQCijxC2f8pl2tY0O0ERAK';
const apiSecret = 'IBkYzXlRgKyOrVp0php1NhwR8GHCMpMtOs3TZtXdE3zpuXveE6';
const accessToken = '1586804888289296389-VWw6t438vq3QjzQgtAbbgaIS1MHBnO';
const accessTokenSecret = '4gfe29e8hSf1r2PjqKeWwL2dTaDU7xwQrUFIPEFVUZ6Zv';

const twitClient = new Twit({
  consumer_key: apiKey,
  consumer_secret: apiSecret,
  access_token: accessToken,
  access_token_secret: accessTokenSecret,
});

// Endpoint to handle the Twitter API request
app.get('/likes/:username', async (req, res) => {
  const username = req.params.username;

  try {
    // Make a request to fetch the likes using the Twitter API
    const response = await twitClient.get('favorites/list', {
      screen_name: username,
    });

    const data = response.data;

    // Extract tweet ID and media URL from each liked tweet
    const likes = data.map(tweet => {
      const tweetId = tweet.id_str;
      const mediaEntities = tweet.entities.media;
      const mediaUrl = mediaEntities && mediaEntities.length > 0 ? mediaEntities[0].media_url_https : '';

      return { tweetId, mediaUrl };
    });

    res.json(likes);
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ error: 'An error occurred while fetching likes' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
