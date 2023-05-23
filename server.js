const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

// Endpoint to handle the Twitter API request
app.get('/likes/:username', async (req, res) => {
  const username = req.params.username;
  const apiKey = 'i4wpQCijxC2f8pl2tY0O0ERAK';
  const apiSecret = 'IBkYzXlRgKyOrVp0php1NhwR8GHCMpMtOs3TZtXdE3zpuXveE6';
  const accessToken = '1586804888289296389-VWw6t438vq3QjzQgtAbbgaIS1MHBnO';
  const accessTokenSecret = '4gfe29e8hSf1r2PjqKeWwL2dTaDU7xwQrUFIPEFVUZ6Zv';

  // Set up OAuth1.0a authentication
  const oauth = {
    consumer_key: apiKey,
    consumer_secret: apiSecret,
    token: accessToken,
    token_secret: accessTokenSecret,
  };

  // Encode OAuth1.0a parameters
  const encodedParams = encodeURIComponent(JSON.stringify(oauth));

  try {
    // Make a request to fetch the likes using the Twitter API
    const response = await fetch(`https://api.twitter.com/1.1/favorites/list.json?screen_name=${username}`, {
      headers: {
        'Authorization': `Bearer ${encodedParams}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch likes');
    }

    const data = await response.json();

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
