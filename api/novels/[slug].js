const { getNovelInfo } = require('../../utils/novelReader');

module.exports = async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const { slug } = req.query;
    
    if (!slug) {
      res.status(400).json({
        success: false,
        error: 'Novel slug is required'
      });
      return;
    }
    
    const novel = getNovelInfo(slug);
    
    if (!novel) {
      res.status(404).json({
        success: false,
        error: 'Novel not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      novel: {
        slug: novel.slug,
        title: novel.title,
        description: novel.description,
        coverImage: novel.coverImage,
        totalChapters: novel.totalChapters,
        chapters: novel.chapters.map(ch => ({
          number: ch.number,
          filename: ch.filename
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching novel:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch novel',
      message: error.message
    });
  }
};
